"""
Email Tool for CrewAI Agents

This tool allows agents to send emails via the Next.js Tool Gateway.
The gateway handles tenant credentials, AWS SES integration, and audit logging.
"""

import os
import requests
from typing import Optional
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import StructuredTool


class EmailTool:
    """
    Tool for sending emails via the Next.js Tool Gateway.
    
    This is a thin wrapper that calls the gateway endpoint with tenant context.
    The gateway handles:
    - Tenant credential retrieval from AWS Secrets Manager
    - AWS SES email sending
    - Audit logging in Supabase
    - Rate limiting per tenant
    """
    
    def __init__(self, tenant_id: str, actor_user_id: str, gateway_url: Optional[str] = None):
        """
        Initialize the email tool.
        
        Args:
            tenant_id: The tenant ID for multi-tenant isolation
            actor_user_id: The user ID making the request (for audit logging)
            gateway_url: Optional override for the gateway URL (defaults to env var)
        """
        self.tenant_id = tenant_id
        self.actor_user_id = actor_user_id
        self.gateway_url = gateway_url or os.getenv("GATEWAY_URL", "http://localhost:3000")
        self.gateway_secret = os.getenv("TOOL_GATEWAY_SECRET", "")
    
    def send_email(self, to: str, subject: str, body: str, from_email: Optional[str] = None) -> dict:
        """
        Send an email via the Tool Gateway.
        
        Args:
            to: Recipient email address
            subject: Email subject line
            body: Email body text
            from_email: Optional sender email (defaults to tenant's configured email)
        
        Returns:
            dict: Response from the gateway with success status and message ID
        
        Raises:
            Exception: If the email fails to send
        """
        endpoint = f"{self.gateway_url}/api/tools/email/send"
        
        payload = {
            "tenantId": self.tenant_id,
            "actorUserId": self.actor_user_id,
            "to": to,
            "subject": subject,
            "body": body,
        }
        
        if from_email:
            payload["from"] = from_email
        
        headers = {
            "Content-Type": "application/json",
            "X-Gateway-Secret": self.gateway_secret,
        }
        
        try:
            response = requests.post(
                endpoint,
                json=payload,
                headers=headers,
                timeout=30,
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_data = response.json()
                raise Exception(f"Failed to send email: {error_data.get('error', 'Unknown error')}")
        
        except requests.exceptions.RequestException as e:
            raise Exception(f"Error calling email gateway: {str(e)}")
    
    def __call__(self, to: str, subject: str, body: str, from_email: Optional[str] = None) -> str:
        """
        Make the tool callable directly by CrewAI agents.
        
        This method allows agents to use the tool like:
        email_tool(to="user@example.com", subject="Hello", body="Message")
        
        Args:
            to: Recipient email address
            subject: Email subject line
            body: Email body text
            from_email: Optional sender email
        
        Returns:
            str: Success message with details
        """
        try:
            result = self.send_email(to, subject, body, from_email)
            return f"Email sent successfully to {to}. Message ID: {result.get('messageId', 'N/A')}"
        except Exception as e:
            return f"Failed to send email: {str(e)}"


class EmailArgs(BaseModel):
    """Arguments schema for the email tool.
    
    Example JSON:
    {
        "to": "user@example.com",
        "subject": "Meeting Reminder",
        "body": "This is a reminder about our meeting tomorrow at 2pm."
    }
    """
    to: str = Field(..., description="Recipient email address (e.g., 'user@example.com')")
    subject: str = Field(..., description="Email subject line (e.g., 'Meeting Reminder')")
    body: str = Field(..., description="Email body text in plain text format (e.g., 'This is a reminder...')")
    from_email: Optional[str] = Field(None, description="Optional sender email address (defaults to tenant's configured email)")


def create_email_tool(tenant_id: str, actor_user_id: str):
    """
    Factory function to create a LangChain-compatible email tool for a specific tenant.
    
    Args:
        tenant_id: The tenant ID for multi-tenant isolation
        actor_user_id: The user ID making the request (for audit logging)
    
    Returns:
        Tool: LangChain-compatible email tool instance
    """
    import re
    from langchain.tools import Tool
    
    email_client = EmailTool(tenant_id, actor_user_id)
    
    def _send_email(instruction: str) -> str:
        """Send an email via the tenant's AWS SES configuration.
        
        Parse the instruction to extract to, subject, and body fields.
        """
        print(f"=" * 80, flush=True)
        print(f"EMAIL TOOL CALLED WITH INSTRUCTION:", flush=True)
        print(f"{instruction}", flush=True)
        print(f"=" * 80, flush=True)
        
        try:
            to_match = re.search(r'to:\s*([^\s;]+(?:@[^\s;]+)?)', instruction, re.IGNORECASE)
            subject_match = re.search(r'subject:\s*["\']?([^;"\']+)["\']?', instruction, re.IGNORECASE)
            body_match = re.search(r'body:\s*["\']?(.+?)["\']?(?:\s*$|;)', instruction, re.IGNORECASE | re.DOTALL)
            
            if not to_match:
                to_match = re.search(r'(?:email|send to|recipient)\s+(?:is\s+)?([^\s]+@[^\s,;]+)', instruction, re.IGNORECASE)
            if not subject_match:
                subject_match = re.search(r'(?:subject|title)\s+(?:is\s+)?["\']([^"\']+)["\']', instruction, re.IGNORECASE)
            if not body_match:
                body_match = re.search(r'(?:body|message|content)\s+(?:is\s+)?["\'](.+?)["\']', instruction, re.IGNORECASE | re.DOTALL)
            
            to = to_match.group(1).strip() if to_match else None
            subject = subject_match.group(1).strip() if subject_match else None
            body = body_match.group(1).strip() if body_match else None
            
            print(f"PARSED: to={to}, subject={subject}, body={body}", flush=True)
            
            if not to or not subject or not body:
                error_msg = f"Error: Could not parse email details. Please provide in format: 'to: email@example.com; subject: Your Subject; body: Your message here'. Got: {instruction}"
                print(f"PARSE ERROR: {error_msg}", flush=True)
                return error_msg
            
            print(f"Calling gateway at {email_client.gateway_url}/api/tools/email/send", flush=True)
            result = email_client.send_email(to=to, subject=subject, body=body)
            success_msg = f"Email sent successfully to {to}. Message ID: {result.get('messageId', 'N/A')}"
            print(f"SUCCESS: {success_msg}", flush=True)
            return success_msg
        except Exception as e:
            error_msg = f"Failed to send email: {str(e)}"
            print(f"EXCEPTION: {error_msg}", flush=True)
            return error_msg
    
    return Tool.from_function(
        func=_send_email,
        name="send_email",
        description="""Send an email via AWS SES. Use this tool when asked to send an email, notify someone via email, or communicate through email.

Provide the email details in this format:
to: recipient@example.com; subject: Your Subject Here; body: Your message content here

Example:
to: user@example.com; subject: Meeting Reminder; body: This is a reminder about our meeting tomorrow at 2pm.

Always extract the recipient email, subject, and body from the user's request and format them as shown above.""",
    )

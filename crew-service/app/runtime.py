"""
CrewAI Runtime Logic

This module handles the execution of CrewAI tasks with BLOX as the manager
and the 8 specialist agents as the team.
"""

from crewai import Crew, Task
from .agents import (
    make_blox,
    make_mark,
    make_cory,
    make_hali,
    make_alex,
    make_fint,
    make_cyra,
    make_tony,
    make_sage,
)
from .tools.email import create_email_tool


def run_blox_crew(tenant_id: str, actor_user_id: str, user_message: str, channel: str = "web") -> dict:
    """
    Execute a CrewAI task with BLOX and the 8 specialist agents.
    
    Args:
        tenant_id: The tenant ID for multi-tenant isolation
        actor_user_id: The user ID making the request (for audit logging)
        user_message: The user's request/message
        channel: The communication channel (web, email, sms)
    
    Returns:
        dict: Contains 'result' (the agent response) and optional 'trace' data
    """
    email_tool = create_email_tool(tenant_id, actor_user_id)
    
    blox = make_blox(tools=[email_tool])
    mark = make_mark(tools=[email_tool])
    cory = make_cory()
    hali = make_hali()
    alex = make_alex()
    fint = make_fint()
    cyra = make_cyra()
    tony = make_tony()
    sage = make_sage()

    planning_task = Task(
        description=f"""
        You are BLOX, the AI CEO. A user has requested via {channel}:

        \"\"\"{user_message}\"\"\"

        As the CEO, analyze this request and provide a comprehensive response.
        You can coordinate with your specialist team (M.A.R.K for Marketing, C.O.R.Y for Creative,
        H.A.L.I for Human Assistance, A.L.E.X for Admin, F.I.N.T for Finance, C.Y.R.A for Cybersecurity,
        T.O.N.Y for Technical, S.A.G.E for Social) when their expertise would add value.

        Provide a clear, comprehensive response to the user's request.
        Be concise but thorough.

        Tenant ID: {tenant_id}
        """,
        expected_output="A clear, comprehensive response to the user's request",
        agent=blox,
    )

    crew = Crew(
        agents=[blox, mark, cory, hali, alex, fint, cyra, tony, sage],
        tasks=[planning_task],
        process="sequential",
        verbose=True,
    )

    try:
        result = crew.kickoff()
        
        return {
            "result": str(result),
            "trace": {
                "tenant_id": tenant_id,
                "channel": channel,
                "process": "sequential",
                "agents_available": [
                    "BLOX", "M.A.R.K", "C.O.R.Y", "H.A.L.I", 
                    "A.L.E.X", "F.I.N.T", "C.Y.R.A", "T.O.N.Y", "S.A.G.E"
                ],
            }
        }
    except Exception as e:
        return {
            "result": f"Error executing crew: {str(e)}",
            "trace": {
                "tenant_id": tenant_id,
                "channel": channel,
                "error": str(e),
            }
        }

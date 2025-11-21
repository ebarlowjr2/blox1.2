"""
CrewAI Tools Module

This module contains tool wrappers that call the Next.js Tool Gateway.
Each tool is a thin wrapper that forwards requests to the gateway with tenant context.
"""

from .email import EmailTool

__all__ = ["EmailTool"]

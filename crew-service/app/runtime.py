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


def run_blox_crew(tenant_id: str, user_message: str, channel: str = "web") -> dict:
    """
    Execute a CrewAI task with BLOX and the 8 specialist agents.
    
    Args:
        tenant_id: The tenant ID for multi-tenant isolation
        user_message: The user's request/message
        channel: The communication channel (web, email, sms)
    
    Returns:
        dict: Contains 'result' (the agent response) and optional 'trace' data
    """
    blox = make_blox()
    mark = make_mark()
    cory = make_cory()
    hali = make_hali()
    alex = make_alex()
    fint = make_fint()
    cyra = make_cyra()
    tony = make_tony()
    sage = make_sage()

    crew = Crew(
        agents=[blox, mark, cory, hali, alex, fint, cyra, tony, sage],
        manager_agent=blox,
        process="hierarchical",  # BLOX will act as the CEO/manager
        verbose=True,
    )

    task_description = f"""
    You are BLOX, the AI CEO. A user has requested via {channel}:

    \"\"\"{user_message}\"\"\"

    Work with your team (M.A.R.K, C.O.R.Y, H.A.L.I, A.L.E.X, F.I.N.T, C.Y.R.A, T.O.N.Y, S.A.G.E)
    to produce the best possible answer.

    Guidelines:
    - Delegate subtasks to the appropriate specialist agents when helpful
    - Use each agent only where they add value
    - Coordinate their work and synthesize their inputs
    - Return one clear, comprehensive final response for the user
    - Be concise but thorough

    Tenant ID: {tenant_id}
    """

    task = Task(
        description=task_description,
        expected_output="A clear, comprehensive response to the user's request",
        agent=blox,
    )

    try:
        result = crew.kickoff(tasks=[task])
        
        return {
            "result": str(result),
            "trace": {
                "tenant_id": tenant_id,
                "channel": channel,
                "agents_used": [
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

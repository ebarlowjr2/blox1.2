"""
BLOX Crew Service - FastAPI Application

This microservice handles CrewAI multi-agent coordination for BLOX.
It exposes HTTP endpoints that the Next.js application can call.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from .runtime import run_blox_crew

load_dotenv()

app = FastAPI(
    title="BLOX Crew Service",
    description="CrewAI microservice for BLOX multi-agent coordination",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local Next.js dev
        "https://blox.onecs.net",  # Production
        "https://*.vercel.app",  # Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CrewRequest(BaseModel):
    """Request model for crew execution"""
    tenantId: str
    actorUserId: str
    message: str
    channel: str = "web"


class CrewResponse(BaseModel):
    """Response model for crew execution"""
    result: str
    trace: dict = {}


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    service: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify service is running"""
    return {
        "status": "healthy",
        "service": "blox-crew-service",
        "version": "0.1.0",
    }


@app.post("/run", response_model=CrewResponse)
async def run_crew(request: CrewRequest):
    """
    Execute a CrewAI task with BLOX and the 8 specialist agents.
    
    This endpoint receives a user message and tenant ID, then coordinates
    the BLOX CEO agent and specialist agents to produce a response.
    """
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY not configured in environment"
        )
    
    if not request.tenantId:
        raise HTTPException(status_code=400, detail="tenantId is required")
    if not request.message:
        raise HTTPException(status_code=400, detail="message is required")
    
    try:
        result = run_blox_crew(
            tenant_id=request.tenantId,
            actor_user_id=request.actorUserId,
            user_message=request.message,
            channel=request.channel,
        )
        
        return CrewResponse(**result)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing crew: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "BLOX Crew Service",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "run": "/run (POST)",
        }
    }

# BLOX Crew Service

Python microservice for CrewAI multi-agent coordination.

## Setup

1. Install dependencies:
```bash
poetry install
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

3. Run the service:
```bash
poetry run uvicorn app.main:app --reload --port 8001
```

## API Endpoints

### POST /run
Execute a CrewAI task with BLOX and the 8 specialist agents.

**Request:**
```json
{
  "tenantId": "uuid",
  "message": "User's request",
  "channel": "web"
}
```

**Response:**
```json
{
  "result": "Agent response",
  "trace": {}
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import (
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    ALLOWED_ORIGINS,
    BACKEND_HOST,
    BACKEND_PORT
)
from schemas import GenerateRequest, GenerateResponse, HealthResponse
from ollama_client import (
    get_available_models,
    resolve_target_model,
    generate_study_material_with_ollama
)

app = FastAPI(
    title="RecallKit AI Backend",
    description="100% Local AI Study Kit Engine powered by Ollama and Gemma 3.",
    version="1.0.0"
)

# CORS Middleware restricted exclusively to local frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/", tags=["Info"])
async def root():
    return {
        "app": "RecallKit AI Backend",
        "status": "online",
        "docs": "/docs",
        "health": "/health",
        "inference_engine": "Local Ollama"
    }

async def execute_health_check() -> HealthResponse:
    """Helper to verify connection with local Ollama and check available models."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            available_models = await get_available_models(client)
            connected = len(available_models) > 0 or False
            target_model = resolve_target_model(OLLAMA_MODEL, available_models)
            model_is_available = target_model in available_models

            return HealthResponse(
                status="ok" if (connected and model_is_available) else "degraded",
                backend="healthy",
                ollama_connected=connected,
                model=target_model,
                model_available=model_is_available,
                available_models=available_models
            )
    except Exception as e:
        return HealthResponse(
            status="degraded",
            backend="healthy",
            ollama_connected=False,
            model=OLLAMA_MODEL,
            model_available=False,
            available_models=[]
        )

# Support both /health and /api/health for frontend compatibility
@app.get("/health", response_model=HealthResponse, tags=["Health"])
@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return await execute_health_check()

async def execute_generation(request: GenerateRequest) -> GenerateResponse:
    """Core logic to process study notes through local Ollama."""
    try:
        return await generate_study_material_with_ollama(request.notes)
    except TimeoutError as err:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(err)
        )
    except RuntimeError as err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(err)
        )
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected server error during study generation: {str(err)}"
        )

# Support both /generate and /api/generate
@app.post("/generate", response_model=GenerateResponse, tags=["Generation"])
@app.post("/api/generate", response_model=GenerateResponse, tags=["Generation"])
async def generate_study_kit(request: GenerateRequest):
    return await execute_generation(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=BACKEND_HOST, port=BACKEND_PORT, reload=True)

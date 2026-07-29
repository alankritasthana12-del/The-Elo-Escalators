from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.config.settings import settings
from app.database.database import engine, Base
from app.ai.matcher import load_faiss_index

from app.api import lost, found, search, matches, dashboard, claim, items

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Only load FAISS index (fast - local file, no download)
    # Embedding model and OCR model are lazy-loaded on first request
    print("Starting AI Lost & Found Assistant...")
    
    # Ensure directories exist
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(settings.FAISS_PATH, exist_ok=True)
    
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    
    # Load FAISS index (fast, local file)
    load_faiss_index()
    
    print("Server ready! AI models will load on first request.")
    
    yield
    
    print("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered Lost & Found platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded images (directory guaranteed to exist from lifespan)
@app.on_event("startup")
async def mount_static():
    pass

# Mount static files
uploads_dir = settings.UPLOAD_FOLDER
os.makedirs(uploads_dir, exist_ok=True)
app.mount(f"/{uploads_dir}", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(lost.router)
app.include_router(found.router)
app.include_router(search.router)
app.include_router(matches.router)
app.include_router(dashboard.router)
app.include_router(claim.router)
app.include_router(items.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AI Lost & Found API is running"}

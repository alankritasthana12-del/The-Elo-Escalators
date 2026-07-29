import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Lost & Found Assistant"
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    UPLOAD_FOLDER: str = "uploads"
    MODEL_PATH: str = "all-MiniLM-L6-v2"
    FAISS_PATH: str = "faiss_index"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()

# Ensure required directories exist
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(settings.FAISS_PATH, exist_ok=True)

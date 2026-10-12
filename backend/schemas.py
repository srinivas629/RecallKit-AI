from pydantic import BaseModel, Field, field_validator
from typing import List
from config import MIN_NOTES_LENGTH, MAX_NOTES_LENGTH

class GenerateRequest(BaseModel):
    notes: str = Field(
        ...,
        description="Raw lecture notes or study text to transform into questions and flashcards."
    )

    @field_validator("notes")
    @classmethod
    def validate_notes(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Study notes cannot be empty or whitespace only.")
        if len(trimmed) < MIN_NOTES_LENGTH:
            raise ValueError(f"Study notes must be at least {MIN_NOTES_LENGTH} characters long.")
        if len(trimmed) > MAX_NOTES_LENGTH:
            raise ValueError(
                f"Study notes exceed maximum allowed length of {MAX_NOTES_LENGTH} characters "
                f"(received {len(trimmed)} characters)."
            )
        return trimmed

class QuizQuestion(BaseModel):
    id: int = Field(..., description="Unique 1-indexed identifier for the question (1 to 5).")
    question: str = Field(..., description="The multiple choice question text.")
    options: List[str] = Field(..., min_length=4, max_length=4, description="Exactly four distinct answer choices.")
    correct_index: int = Field(..., ge=0, le=3, description="0-indexed position (0, 1, 2, or 3) of the correct answer.")
    explanation: str = Field(..., description="Concise explanation explaining why the correct answer is right.")

class Flashcard(BaseModel):
    id: int = Field(..., description="Unique 1-indexed identifier for the flashcard (1 to 5).")
    front: str = Field(..., description="Key concept or prompt on the front of the flashcard.")
    back: str = Field(..., description="Clear, concise definition or answer on the back.")

class GenerateResponse(BaseModel):
    quiz: List[QuizQuestion] = Field(..., description="List of generated multiple choice questions.")
    flashcards: List[Flashcard] = Field(..., description="List of generated interactive flashcards.")

class HealthResponse(BaseModel):
    status: str
    backend: str
    ollama_connected: bool
    model: str
    model_available: bool
    available_models: List[str]

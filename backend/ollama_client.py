import json
import re
import httpx
from typing import Dict, Any, List, Optional
from config import OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT_SECONDS
from schemas import GenerateResponse, QuizQuestion, Flashcard

SYSTEM_PROMPT = """You are an expert educational study assistant.
Your task is to analyze study notes and generate high-quality learning materials.
You MUST output ONLY a valid JSON object with no preamble, conversational text, or markdown code blocks.

The JSON object must have this exact structure:
{
  "quiz": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Why this answer is correct."
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "Key concept or question?",
      "back": "Clear concise answer or definition."
    }
  ]
}

CRITICAL RULES:
1. Provide EXACTLY 5 multiple-choice questions in the "quiz" array.
2. Each question MUST have EXACTLY 4 distinct options in the "options" array.
3. "correct_index" MUST be an integer between 0 and 3 indicating the correct option index.
4. "explanation" MUST briefly explain why the correct option is right.
5. Provide EXACTLY 5 flashcards in the "flashcards" array.
6. Each flashcard MUST have "front" (prompt) and "back" (answer).
7. Keep questions, options, and explanations concise and direct (1-2 sentences max per explanation).
8. Return ONLY valid JSON."""

async def get_available_models(client: httpx.AsyncClient) -> List[str]:
    """Fetch the list of currently installed models from local Ollama."""
    try:
        res = await client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            return [m.get("name", "") for m in data.get("models", []) if m.get("name")]
        return []
    except Exception:
        return []

def resolve_target_model(configured_model: str, available_models: List[str]) -> str:
    """
    Ensure the target model is available locally.
    1. If configured_model is present in available_models, use it.
    2. If configured_model matches a tag prefix (e.g. gemma3:4b-it), use it.
    3. If configured_model is a gemma variant and another gemma model is installed, use that.
    4. Otherwise, return configured_model as-is (flagged as unavailable).
    """
    if configured_model in available_models:
        return configured_model

    for model_name in available_models:
        if model_name.startswith(configured_model):
            return model_name

    if "gemma" in configured_model.lower():
        for model_name in available_models:
            if "gemma" in model_name.lower():
                return model_name

    return configured_model

def sanitize_json_content(raw_text: str) -> str:
    """Strip markdown formatting, extra prose, and extract pure JSON."""
    text = raw_text.strip()

    # Remove markdown code fences if present
    fence_pattern = r"^```(?:json)?\s*([\s\S]*?)\s*```$"
    match = re.search(fence_pattern, text, re.IGNORECASE)
    if match:
        text = match.group(1).strip()

    # If extra text precedes or follows the JSON object, extract between first { and last }
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        text = text[first_brace : last_brace + 1]

    return text

def normalize_model_output(parsed: Dict[str, Any]) -> GenerateResponse:
    """Normalize fields in case the local LLM returned slight key variations."""
    raw_quiz = parsed.get("quiz") or parsed.get("questions") or []
    raw_flashcards = parsed.get("flashcards") or parsed.get("cards") or []

    quiz_list: List[QuizQuestion] = []
    for idx, item in enumerate(raw_quiz[:5], start=1):
        if not isinstance(item, dict):
            continue
        
        question_text = str(item.get("question") or item.get("prompt") or f"Question {idx}").strip()
        raw_options = item.get("options") or item.get("choices") or []
        
        # Ensure 4 options
        options = [str(opt).strip() for opt in raw_options if str(opt).strip()]
        if len(options) < 4:
            # Pad if needed
            while len(options) < 4:
                options.append(f"Option {len(options) + 1}")
        elif len(options) > 4:
            options = options[:4]

        # Resolve correct_index
        raw_correct = item.get("correct_index", item.get("correctAnswer", item.get("answer", 0)))
        correct_index = 0
        if isinstance(raw_correct, int) and 0 <= raw_correct <= 3:
            correct_index = raw_correct
        elif isinstance(raw_correct, str):
            c_str = raw_correct.strip().upper()
            if c_str in ["A", "0"]:
                correct_index = 0
            elif c_str in ["B", "1"]:
                correct_index = 1
            elif c_str in ["C", "2"]:
                correct_index = 2
            elif c_str in ["D", "3"]:
                correct_index = 3
            else:
                # Check if it matches option text
                for opt_i, opt_val in enumerate(options):
                    if opt_val.lower() == raw_correct.lower():
                        correct_index = opt_i
                        break

        explanation = str(
            item.get("explanation") or item.get("reason") or "Correct answer based on the study notes."
        ).strip()

        quiz_list.append(
            QuizQuestion(
                id=idx,
                question=question_text,
                options=options,
                correct_index=correct_index,
                explanation=explanation
            )
        )

    flashcard_list: List[Flashcard] = []
    for idx, item in enumerate(raw_flashcards[:5], start=1):
        if not isinstance(item, dict):
            continue
        
        front = str(item.get("front") or item.get("question") or item.get("term") or f"Concept {idx}").strip()
        back = str(item.get("back") or item.get("answer") or item.get("definition") or "Explanation").strip()

        flashcard_list.append(
            Flashcard(
                id=idx,
                front=front,
                back=back
            )
        )

    return GenerateResponse(quiz=quiz_list, flashcards=flashcard_list)

async def generate_study_material_with_ollama(notes: str) -> GenerateResponse:
    """
    Call local Ollama /api/chat with strict JSON output formatting.
    All inference is strictly local to 127.0.0.1:11434.
    """
    timeout = httpx.Timeout(OLLAMA_TIMEOUT_SECONDS, connect=5.0)

    async with httpx.AsyncClient(timeout=timeout) as client:
        # 1. Verify Ollama is reachable and resolve model
        available_models = await get_available_models(client)
        if not available_models:
            raise RuntimeError(
                f"Local Ollama server is unreachable at {OLLAMA_BASE_URL}. "
                "Please make sure Ollama is running ('ollama serve')."
            )

        active_model = resolve_target_model(OLLAMA_MODEL, available_models)
        if active_model not in available_models:
            raise RuntimeError(
                f"Model '{OLLAMA_MODEL}' is not available in local Ollama. "
                f"Available models: {', '.join(available_models) if available_models else 'None'}. "
                f"Please ensure your Gemma model is installed."
            )

        # 2. Construct Chat Request
        user_prompt = f"Study Notes:\n\n{notes}\n\nGenerate exactly 5 multiple choice questions and 5 flashcards based on the notes above."

        payload = {
            "model": active_model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.2,
                "top_p": 0.9,
                "num_predict": 1200
            }
        }

        # 3. Request inference
        try:
            res = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
        except httpx.ConnectError:
            raise RuntimeError(
                f"Failed to connect to local Ollama server at {OLLAMA_BASE_URL}. "
                "Please verify the Ollama service is active."
            )
        except httpx.TimeoutException:
            raise TimeoutError(
                f"Ollama inference timed out after {OLLAMA_TIMEOUT_SECONDS} seconds. "
                "The local model took too long to generate the study kit. "
                "Try submitting a slightly shorter notes excerpt or check system CPU/GPU usage."
            )

        if res.status_code != 200:
            raise RuntimeError(
                f"Ollama returned error status {res.status_code}: {res.text}"
            )

        data = res.json()
        message_content = data.get("message", {}).get("content", "")
        if not message_content:
            raise ValueError("Ollama returned an empty response.")

        # 4. Clean & Parse JSON
        cleaned = sanitize_json_content(message_content)
        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError as err:
            raise ValueError(
                f"Failed to parse model output as JSON: {err}. Raw output preview: {message_content[:200]}"
            )

        # 5. Validate & Normalize into Schema
        validated_response = normalize_model_output(parsed)

        # Ensure we have at least 1 question and 1 flashcard
        if not validated_response.quiz or not validated_response.flashcards:
            raise ValueError(
                "Model response could not be mapped to the required 5 questions and 5 flashcards."
            )

        return validated_response

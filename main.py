import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from services.ocr_service import extract_prescription_data
from services.mock_prescription import MOCK_PRESCRIPTION

load_dotenv()

app = FastAPI(title="RxLens API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://rxlens-client.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _is_quota_error(exc: Exception) -> bool:
    """Detect Gemini API quota exhaustion (429 RESOURCE_EXHAUSTED)."""
    msg = str(exc).upper()
    return "RESOURCE_EXHAUSTED" in msg or "429" in msg or "QUOTA" in msg


@app.post("/api/v1/parse-prescription")
async def parse_prescription(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WEBP images allowed")

    image_bytes = await file.read()

    try:
        structured_data = await extract_prescription_data(image_bytes)
        return structured_data

    except Exception as e:
        if _is_quota_error(e):
            # Gemini quota exhausted — return mock data so demos never break
            print(f"[WARN] Gemini quota exceeded. Serving mock prescription. ({e})")
            return MOCK_PRESCRIPTION

        # Any other unexpected error
        print(f"[ERROR] Prescription extraction failed: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)

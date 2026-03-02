import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from services.ocr_service import extract_prescription_data
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()

app = FastAPI(title="RxReader API", version="1.0.0")
# List the origins that are allowed to make requests to your API
# For local React development, this is usually localhost:3000 or 5173 (Vite)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://rxlens-client.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.post("/api/v1/parse-prescription")
async def parse_prescription(file: UploadFile = File(...)):
    # 1. Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WEBP images allowed")

    try:
        # 2. Extract handwriting using Vision LLM
        image_bytes = await file.read()
        structured_data = await extract_prescription_data(image_bytes)

        # # 3. Enhance with Generic Alternatives
        # for medicine in structured_data.get("medicines", []):
        #     medicine["alternatives"] = get_generic_alternatives(medicine["name"])

        return structured_data

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

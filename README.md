# RxLens API

A FastAPI-based service for extracting prescription data from handwritten images using OCR and Google Generative AI.

## Features

- Parse handwritten prescriptions from images (JPG, PNG, WEBP)
- Extract structured patient and medication data
- RESTful API with CORS support for web applications

## Prerequisites

- Python 3.8 or higher
- Google Cloud API key with Generative AI access

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rxlens_api
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Environment Setup

1. Copy the `.env` file and update it with your Google API key:
   ```bash
   cp .env .env.local
   ```

2. Edit `.env.local` and replace the `GOOGLE_API_KEY` with your actual Google Generative AI API key.

## Running the Application

Start the development server:
```bash
python main.py
```

Or with auto-reload for development:
```bash
uvicorn main:app --reload --host localhost --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Endpoints

- `POST /api/v1/parse-prescription`: Upload an image file to extract prescription data

## Testing the API

You can test the API using curl:
```bash
curl -X POST "http://localhost:8000/api/v1/parse-prescription" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/your/prescription.jpg"
```

## Project Structure

```
rxlens_api/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (template)
├── services/
│   ├── ocr_service.py      # OCR and data extraction logic
│   └── drug_service.py     # Drug-related services
└── README.md               # This file
```

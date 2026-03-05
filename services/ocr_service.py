
import base64
import os
from typing import Dict, List, Optional
from datetime import date, datetime
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
# ... other imports same as before


# Define the expected JSON structure for the LLM
class Patient(BaseModel):
    name: str = Field(..., description="Full name, e.g., 'John Doe'")
    date_of_birth: date = Field(
        ..., description="ISO format (YYYY-MM-DD), e.g., '1990-05-15'"
    )
    age: int = Field(..., ge=0, le=120, description="Age in years, e.g., 34")
    gender: str = Field(..., description="e.g., 'Male', 'Female', or 'Non-binary'")
    blood_group: Optional[str] = Field(None, description="e.g., 'O+ or AB-'")
    contact_number: Optional[str] = Field(None, description="e.g., '+1-555-0199'")
    emergency_contact: Optional[str] = Field(None, description="Name and/or number")
    known_allergies: List[str] = Field(
        default_factory=list, description="e.g., ['Penicillin', 'Peanuts']"
    )
    chronic_conditions: List[str] = Field(
        default_factory=list, description="e.g., ['Diabetes Type 2', 'Hypertension']"
    )


class Practitioner(BaseModel):
    practitioner_id: Optional[str] = Field(
        None, alias="id", description="UUID or Hospital ID"
    )
    name: str = Field(..., description="e.g., 'Dr. Sarah Smith'")
    specialization: Optional[str] = Field(
        None, description="e.g., 'Dermatology' or 'Pediatrics'"
    )
    license_number: Optional[str] = Field(
        None, description="Medical council reg number, e.g., 'MED-123456'"
    )
    qualifications: Optional[str] = Field(
        None, description="e.g., 'MBBS, MD (Internal Medicine)'"
    )
    clinic_name: str = Field(..., description="e.g., 'Green Valley Medical Center'")
    clinic_address: str = Field(..., description="Full physical address")
    contact_number: Optional[str] = Field(
        None, description="Clinic landline or work mobile"
    )


class AlternativeMedicine(BaseModel):
    name: str = Field(..., description="Medicine name, e.g., 'Amoxillin 500mg'")
    type: str = Field(..., description="Type: 'alternative' for brand alternatives or 'generic' for generic equivalent")


class PrescribedDrug(BaseModel):
    name: str = Field(..., description="Generic or Brand name, e.g., 'Amoxicillin'")
    strength: str = Field(
        ..., description="Concentration, e.g., '500mg' or '5ml/100mg'"
    )
    dosage: str = Field(
        ..., description="Amount per intake, e.g., '1 tablet' or '2 drops'"
    )
    frequency: str = Field(
        ..., description="e.g., 'TID (3 times a day)' or 'Every 8 hours'"
    )
    route: str = Field(default="Oral", description="e.g., 'Oral', 'Topical', 'IV'")
    duration: str = Field(..., description="Total time, e.g., '7 days'")
    instructions: Optional[str] = Field(
        None, description="e.g., 'Take with food, avoid alcohol'"
    )
    side_effects: List[str] = Field(
        default_factory=list, 
        description="Common side effects, e.g., ['Headache', 'Dizziness', 'Nausea']"
    )
    contraindications: List[str] = Field(
        default_factory=list,
        description="Situations when medicine shouldn't be used, e.g., ['Pregnancy', 'severe liver disease']"
    )
    precautions: Optional[str] = Field(
        None, description="Important warnings and precautions, e.g., 'Avoid driving if dizzy. May interact with alcohol.'"
    )
    alternatives: Optional[List[AlternativeMedicine]] = Field(
        None, description="List of alternative medicines and one generic equivalent with same API and strength"
    )   


class Prescription(BaseModel):
    prescription_id: str = Field(
        ..., description="Unique Rx number, e.g., 'RX-2024-9981'"
    )
    date_issued: datetime = Field(default_factory=datetime.now)

    # Reusing the specialized classes
    patient: Patient
    doctor: Practitioner
    medications: List[PrescribedDrug]

    # Clinical Context
    chief_complaint: Optional[str] = Field(
        None, description="Patient's reason for visit, e.g., 'Persistent dry cough'"
    )
    diagnosis: List[str] = Field(
        default_factory=list,
        description="Confirmed conditions, e.g., ['Acute Bronchitis']",
    )
    vitals_at_visit: Optional[Dict[str, str]] = Field(
        None,
        description="Vitals recorded, e.g., {'BP': '120/80', 'Temp': '98.6F', 'Weight': '75kg'}",
    )
    clinical_notes: Optional[str] = Field(
        None, description="Internal doctor notes or advice"
    )
    follow_up_date: Optional[date] = Field(None, description="Next suggested visit")


# Rebuild the model to ensure all type annotations are properly resolved
Prescription.model_rebuild()


async def extract_prescription_data(image_bytes: bytes):
    # Gemini can take image bytes directly via LangChain
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY environment variable not set. Get your key from https://aistudio.google.com/apikey"
        )

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash", temperature=0, api_key=api_key
    )
    structured_llm = llm.with_structured_output(Prescription)

    system_prompt = """
**Role:** You are the "LipiScan AI Agent," a Senior Medical Pharmacist and Handwriting Expert specialized in Indian prescriptions. Your goal is to accurately transcribe handwritten medical documents and provide patient-friendly context.

**Task:**
1. **Analyze Layout:** Identify the Doctor's Name, Clinic/Hospital Details, Date, and Patient Name.
2. **Transcribe Medicines:** Extract the exact Brand Name, Strength, Dosage, and Frequency.
3. **Decipher Handwriting:** Use medical context to resolve ambiguities.
4. **Identify Active Ingredients (API):** Determine generic chemical compositions.
5. **Standardize Instructions:** Convert Latin shorthand (OD, TDS, etc.) to plain English.
6. **Find Alternative Medicines:** For each prescribed medication:
   - List 2-3 commonly available alternative brand names with the same active ingredient and strength in India
   - Identify one generic equivalent (if available) with the same API and strength
   - Mark each alternative with its type: "alternative" for brand alternatives, "generic" for generic equivalent
7. **Extract Side Effects & Contraindications:** For each medicine, provide:
   - **side_effects**: Common or possible adverse reactions (e.g., 'Headache', 'Nausea', 'Dizziness')
   - **contraindications**: Medical conditions or situations when the medicine should NOT be used
   - **precautions**: Important warnings, drug interactions, or lifestyle modifications needed

**Constraint:** Return ONLY valid JSON. If unsure, set confidence_score < 0.5. Prioritize patient safety awareness.
"""

    # LangChain multi-modal message format for Gemini
    message = HumanMessage(
        content=[
            {
                "type": "text",
                "text": "Read this prescription and return structured JSON.",
            },
            {
                "type": "image_url",
                "image_url": f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode()}",
            },
        ]
    )
    output = await structured_llm.ainvoke([system_prompt, message])
    return output

# Import libraries
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# Insialisasi FastAPI
app = FastAPI()

# Konfigurasi CORS
origins = [
    "http://localhost:5173", 
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],   
    allow_headers=["*"],   
)

# Kelas untuk request body
class BeritaRequest(BaseModel):
    teks: str

# Load model dari Hugging Face Hub
repo_name = "faris27/indobert-hoax-detection" 
print(f"Memuat model dari Hugging Face Hub: {repo_name}...")
classifier = pipeline("text-classification", model=repo_name)
print("Model berhasil dimuat dan siap menerima permintaan.")


# Endpoint untuk root 
@app.get("/")
def read_root():
    return {"message": "Selamat datang di API Deteksi Hoaks!"}


# Endpoint utama untuk analisis teks
@app.post("/analyze/")
def analyze_text(request: BeritaRequest):
    text_to_analyze = request.teks
    result = classifier(text_to_analyze, truncation=True, max_length=512)
    return {"prediction": result[0]}
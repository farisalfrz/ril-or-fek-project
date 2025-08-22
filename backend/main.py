# Import libraries
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from bs4 import BeautifulSoup
import datetime
import requests

# Insialisasi FastAPI
app = FastAPI(openapi_url="/api/openapi.json")

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


# Variabel global untuk cache
cached_hoaxes = []
last_fetched_time = None
CACHE_DURATION_SECONDS = 3600  # Cache berlaku selama 1 jam (3600 detik)

# Endpoint API baru yang mengambil data dari RSS Feed
@app.get("/hoaxes")
def get_latest_hoaxes():
    global cached_hoaxes, last_fetched_time

    if last_fetched_time and (datetime.datetime.now() - last_fetched_time).total_seconds() < CACHE_DURATION_SECONDS:
        print("Mengembalikan data hoaks dari cache.")
        return cached_hoaxes

    print("Mengambil data hoaks baru dari RSS Feed...")
    try:
        RSS_URL = "https://turnbackhoax.id/feed/"

        # Tambahkan User-Agent untuk meniru browser
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}

        # Gunakan requests untuk mengambil konten feed
        response = requests.get(RSS_URL, headers=headers)
        response.raise_for_status() # Ini akan memunculkan error jika status bukan 200 OK

        # Proses konten dengan feedparser
        feed = feedparser.parse(response.content)

        latest_hoaxes = []
        for entry in feed.entries[:5]:
            soup = BeautifulSoup(entry.summary, 'html.parser')
            summary_text = soup.get_text().strip()
            if len(summary_text) > 200:
                summary_text = summary_text[:200] + "..."

            latest_hoaxes.append({
                "id": entry.id, "title": entry.title, "summary": summary_text,
                "source": "Turnbackhoax.id", "link": entry.link, "date": entry.published,
            })

        cached_hoaxes = latest_hoaxes
        last_fetched_time = datetime.datetime.now()

        return cached_hoaxes
    except Exception as e:
        print(f"Error saat mengambil RSS Feed: {e}")
        if cached_hoaxes:
            return cached_hoaxes
        raise HTTPException(status_code=500, detail="Gagal mengambil data hoaks terkini.")
        
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
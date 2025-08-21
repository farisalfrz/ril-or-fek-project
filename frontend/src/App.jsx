import { useState } from 'react';

function App() {
  // State untuk menyimpan teks dari input pengguna
  const [inputText, setInputText] = useState("");
  
  // State untuk menyimpan hasil prediksi dari API
  const [result, setResult] = useState(null);
  
  // State untuk menandakan proses loading saat API dipanggil
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi yang akan dijalankan saat tombol "Analisis" diklik
  const handleSubmit = async () => {
    // Validasi sederhana agar tidak mengirim teks kosong
    if (!inputText.trim()) {
      alert("Harap masukkan teks berita terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Panggil backend API kita yang berjalan di http://127.0.0.1:8000
      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kirim teks dalam format JSON
        body: JSON.stringify({ teks: inputText }), 
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung ke server API. Pastikan backend sudah berjalan.");
      }

      const data = await response.json();
      // Simpan hasil prediksi ke dalam state
      setResult(data.prediction);

    } catch (error) {
      console.error("Terjadi error saat memanggil API:", error);
      // Menampilkan pesan error di UI
      setResult({ label: "ERROR", score: 0, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk membantu menentukan warna pada kotak hasil
  const getResultStyle = () => {
    if (!result) return 'bg-slate-100';
    if (result.label === 'LABEL_1') return 'bg-rose-50 border-rose-500 text-rose-900'; // Hoaks
    if (result.label === 'LABEL_0') return 'bg-emerald-50 border-emerald-500 text-emerald-900'; // Fakta
    return 'bg-amber-50 border-amber-500 text-amber-900'; // Error
  };

  return (
    // Latar belakang utama dengan warna abu-abu terang
    <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      
      {/* Kartu utama dengan bayangan dan sudut tumpul */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6">
        
        {/* Bagian Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800">
            Agen Ril or Fek
          </h1>
          <p className="text-slate-500 mt-2">
            Analisis potensi hoaks pada berita berbahasa Indonesia dengan AI.
          </p>
        </div>

        {/* Bagian Input */}
        <div className="space-y-4">
          <textarea
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 resize-none text-slate-700"
            placeholder="Salin dan tempel SELURUH isi berita di sini..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? "Menganalisis..." : "Analisis Sekarang"}
          </button>
        </div>

        {/* Bagian Hasil */}
        {result && (
          <div className={`mt-8 p-5 border-l-4 rounded-r-lg ${getResultStyle()}`}>
            <h2 className="text-lg font-bold mb-1">Hasil Analisis:</h2>
            {result.label === 'LABEL_1' && <p className="text-2xl font-extrabold text-rose-700">Potensi HOAKS Tinggi</p>}
            {result.label === 'LABEL_0' && <p className="text-2xl font-extrabold text-emerald-700">Kemungkinan Besar FAKTA</p>}
            {result.label === 'ERROR' && <p className="text-xl font-bold text-amber-700">Terjadi Error</p>}
            
            {result.label !== 'ERROR' ? (
              <p className="text-slate-600">
                Tingkat kepercayaan: {Math.round(result.score * 100)}%
              </p>
            ) : (
               <p className="text-slate-600">{result.message}</p>
            )}
          </div>
        )}
      </div>
       <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Dibangun oleh Faris Alfarizi sebagai Proyek Portofolio.</p>
      </footer>
    </div>
  );
}

export default App;

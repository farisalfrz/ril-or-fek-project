import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Komponen Tombol Switch Dark Mode ---
const ThemeSwitcher = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};


// --- Komponen Halaman Utama (Analisis) ---
const HomePage = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const CONTOH_HOAKS = "Pemerintah akan segera membagikan bantuan kuota internet sebesar 50GB gratis yang berlaku seumur hidup untuk semua operator. Bantuan ini dalam rangka perayaan ulang tahun kemerdekaan. Cukup teruskan pesan ini ke 5 grup WhatsApp untuk mengaktifkan kuota Anda secara otomatis.";
  const CONTOH_FAKTA = "Badan Pusat Statistik (BPS) mengumumkan bahwa inflasi pada bulan Juli tercatat sebesar 0,21% secara bulanan. Kepala BPS menyatakan bahwa kenaikan harga pada kelompok transportasi menjadi salah satu pendorong utama inflasi bulan ini.";

  const handleExampleClick = (exampleText) => {
    setInputText(exampleText);
    setResult(null);
  };
  
  const handleClearClick = () => {
    setInputText("");
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      alert("Harap masukkan teks berita terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teks: inputText }),
      });
      if (!response.ok) {
        throw new Error("Gagal terhubung ke server API. Pastikan backend sudah berjalan.");
      }
      const data = await response.json();
      setResult(data.prediction);
    } catch (error) {
      console.error("Terjadi error saat memanggil API:", error);
      setResult({ label: "ERROR", score: 0, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultStyle = () => {
    if (!result) return 'bg-slate-100 dark:bg-slate-800';
    if (result.label === 'LABEL_1') return 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-900/20 dark:border-rose-500/50 dark:text-rose-200';
    if (result.label === 'LABEL_0') return 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-500/50 dark:text-emerald-200';
    return 'bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-900/20 dark:border-amber-500/50 dark:text-amber-200';
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Agen Ril or Fek</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Analisis potensi hoaks pada berita berbahasa Indonesia dengan AI.</p>
      </div>

      {/* === HIMBAUAN PENGGUNAAN === */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 text-slate-800 dark:text-slate-300 rounded-r-lg">
        <div className="flex">
          <div className="py-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold mb-2">Penting: 2 Aturan Agar Hasil Analisis Akurat</p>
            <ul className="list-disc list-inside text-sm space-y-2 text-slate-700 dark:text-slate-400">
              <li><strong>Masukkan Teks Berita Lengkap:</strong> Salin-tempel seluruh isi artikel (minimal 2-3 paragraf) untuk memberikan konteks yang cukup bagi AI.</li>
              <li><strong>Hindari Kalimat Fakta Tunggal:</strong> Jangan hanya memasukkan satu kalimat seperti <em>"Kemerdekaan Indonesia pada 17 Agustus 1945"</em>.</li>
              <p>Model saya adalah <strong>penganalisis gaya tulisan</strong>, bukan pemeriksa kamus fakta. Kalimat tunggal tidak memiliki struktur berita yang telah dipelajari oleh AI, sehingga dapat menyebabkan prediksi keliru.</p>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-2">
          <textarea
            className="w-full h-48 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 resize-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Salin dan tempel seluruh isi berita di sini..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Coba contoh:</span>
              <button onClick={() => handleExampleClick(CONTOH_FAKTA)} className="text-sm text-emerald-600 hover:underline disabled:text-slate-400" disabled={isLoading}>Fakta</button>
              <button onClick={() => handleExampleClick(CONTOH_HOAKS)} className="text-sm text-rose-600 hover:underline disabled:text-slate-400" disabled={isLoading}>Hoaks</button>
            </div>
            <button 
              onClick={handleClearClick} 
              className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors" 
              disabled={isLoading || !inputText}
            >
              Clear
            </button>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={isLoading}
            >
              {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              {isLoading ? "Menganalisis..." : "Analisis Sekarang"}
            </button>
          </div>
        </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className={`mt-8 p-5 border-l-4 rounded-r-lg ${getResultStyle()}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-bold mb-1">Hasil Analisis:</h2>
            {result.label === 'LABEL_1' && <p className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">Potensi HOAKS Tinggi</p>}
            {result.label === 'LABEL_0' && <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">Kemungkinan Besar FAKTA</p>}
            {result.label === 'ERROR' && <p className="text-xl font-bold text-amber-700 dark:text-amber-300">Terjadi Error</p>}
            {result.label !== 'ERROR' ? (
              <>
                <p className="text-slate-600 dark:text-slate-300 mb-3">Tingkat kepercayaan: {Math.round(result.score * 100)}%</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  {result.label === 'LABEL_1' ? "Model mendeteksi pola bahasa yang umum ditemukan pada disinformasi." : "Struktur teks ini konsisten dengan artikel berita faktual."}
                </p>
              </>
            ) : (<p className="text-slate-600 dark:text-slate-300">{result.message}</p>)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* === DISCLAIMER PENGGUNAAN === */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
        <p><strong>Disclaimer:</strong> Hasil analisis adalah prediksi berdasarkan model AI dan bukan merupakan penentu kebenaran mutlak. Selalu lakukan verifikasi silang ke sumber yang kredibel.</p>
      </div>
    </div>
  );
};

// --- Komponen Halaman "Tentang Model" ---
const AboutPage = () => {
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Di Balik Layar</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">Teknologi di Balik Ril or Fek</p>
      </div>
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Sumber Data & Dataset</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Kualitas dan performa sebuah model AI sangat bergantung pada kualitas, kuantitas, dan keragaman data yang digunakan untuk melatihnya. Data yang bersih, relevan, dan seimbang adalah fondasi untuk menciptakan model yang akurat dan tidak bias. Model ini dilatih menggunakan dataset publik "Deteksi Berita Hoaks Indo Dataset" oleh Mochamad Abdul Azis.
          <a href="https://www.kaggle.com/datasets/mochamadabdulazis/deteksi-berita-hoaks-indo-dataset" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Kunjungi di Kaggle.</a>
        </p>
        <ul className="text-sm text-slate-600 dark:text-slate-300 list-disc list-inside space-y-2">
          <li><b>Total Artikel:</b> 24,592 artikel setelah dibersihkan.</li>
          <li><b>Sumber Berita Asli:</b> Turnbackhoax.id, CNN Indonesia, Kompas, dan Detik.com.</li>
          <li><b>Distribusi Label:</b> Dataset ini sangat seimbang, terdiri dari berita Fakta 52.6% dan berita Hoaks 48.4%, yang ideal untuk melatih model yang tidak bias.</li>
        </ul>
      </div>
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Pendekatan Dua Model</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-md border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg text-slate-700 dark:text-slate-200">1. Baseline Model</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Model dasar ini menggunakan pendekatan klasik <strong>TF-IDF</strong> dan <strong>Naive Bayes</strong>. Tujuannya adalah untuk menciptakan titik acuan (benchmark) performa sebelum beralih ke model yang lebih kompleks.</p>
            <p className="mt-3 text-center text-2xl font-bold text-slate-500 dark:text-slate-400">Akurasi: 95.65%</p>
          </div>
          <div className="border p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30">
            <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300">2. Advanced Model (IndoBERT)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Model utama saya adalah <strong>IndoBERT</strong>, sebuah model Transformer canggih yang sudah dilatih pada jutaan teks Bahasa Indonesia. Kemampuannya memahami konteks membuatnya jauh lebih unggul.</p>
            <p className="mt-3 text-center text-2xl font-bold text-blue-700 dark:text-blue-400">Akurasi: 99.84%</p>
          </div>
        </div>
      </div>
      {/* === BAGIAN BARU: PROSES PELATIHAN === */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Proses Pelatihan & Optimisasi</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Model IndoBERT tidak digunakan begitu saja, melainkan melalui proses <strong>fine-tuning</strong> selama 3 epoch. Saya memonitor performanya untuk memilih versi terbaik dan menghindari <strong>overfitting</strong>.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">Epoch</th>
                <th scope="col" className="px-6 py-3">Training Loss</th>
                <th scope="col" className="px-6 py-3">Validation Loss</th>
                <th scope="col" className="px-6 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4">0.0689</td>
                <td className="px-6 py-4">0.0118</td>
                <td className="px-6 py-4">Kinerja membaik</td>
              </tr>
              <tr className="bg-emerald-50 dark:bg-emerald-900/30 border-b border-emerald-200 dark:border-emerald-700">
                <td className="px-6 py-4 font-bold">2</td>
                <td className="px-6 py-4 font-bold">0.0109</td>
                <td className="px-6 py-4 font-bold">0.0108</td>
                <td className="px-6 py-4 font-bold text-emerald-700 dark:text-emerald-400">Model Terbaik</td>
              </tr>
              <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">0.0029</td>
                <td className="px-6 py-4">0.0118</td>
                <td className="px-6 py-4 text-rose-700 dark:text-rose-400">Mulai Overfitting</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">Berkat `load_best_model_at_end=True`, model dari <strong>Epoch 2</strong> secara otomatis dipilih sebagai model final, sehingga menghasilkan performa yang optimal.</p>
      </div>
    </div>
  );
};


// --- Komponen Utama Aplikasi (Router & Theme Manager) ---
function App() {
  const [page, setPage] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen flex flex-col font-sans">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm w-full sticky top-0 z-50">
        <div className="relative flex items-center justify-center max-w-4xl mx-auto p-4">
          <nav>
            <button 
              onClick={() => setPage('home')}
              className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors duration-200 ${page === 'home' ? 'text-white bg-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              Analisis
            </button>
            <button 
              onClick={() => setPage('about')}
              className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors duration-200 ml-4 ${page === 'about' ? 'text-white bg-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              Tentang Model
            </button>
          </nav>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        {page === 'home' && <HomePage />}
        {page === 'about' && <AboutPage />}
      </main>
      
      <footer className="w-full text-center p-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>Dibangun oleh <strong>Faris Alfarizi</strong> sebagai proyek portofolio pribadi.</p>
      </footer>
    </div>
  );
}

export default App;

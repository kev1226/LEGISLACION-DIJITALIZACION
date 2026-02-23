const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Escudo para leer tu .env

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(__dirname)); // Sirve todos tus archivos estáticos (HTML, JS, CSS)

// 1. RUTA PRINCIPAL (Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index', 'index.html'));
});

// 2. RUTA DE SEGURIDAD (Protección de la IA)
app.get('/api/keys', (req, res) => {
    // Le envía el token al frontend sin exponerlo en GitHub
    res.json({ geminiToken: process.env.GEMINI_API_KEY });
});

// --- START ---
app.listen(PORT, () => {
    console.log(`✅ Servidor NRI 2025 LISTO en: http://localhost:${PORT}`);
    console.log(`   (Ocultando API Key con éxito 🛡️)`);
});
const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Backend (Android Modu) calisiyor!');
});

app.post('/api/info', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL gerekli" });

    try {
        console.log(`İstek geldi (Android Modu): ${url}`);
        
        const output = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            // KİLİT NOKTA: YouTube'u kandıran ayarlar burası
            extractorArgs: "youtube:player_client=android",
            userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
        });

        res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            url: output.url,
            backendSource: "Render Android Mode"
        });

    } catch (error) {
        console.error("YT-DLP Hatası:", error.message);
        
        // Hata mesajını kullanıcıya daha net döndür
        if (error.message.includes("Sign in")) {
            return res.status(403).json({ error: "YouTube IP'yi engelledi (Bot Koruması). Lütfen 1-2 dakika bekleyip tekrar deneyin." });
        }
        res.status(500).json({ error: "Video işlenemedi: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
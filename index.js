// index.js
const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const app = express();

// CORS ayarları (Her yerden isteğe izin ver)
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Backend calisiyor! /api/info endpointini kullan.');
});

app.post('/api/info', async (req, res) => {
    const { url, isAudio } = req.body;

    if (!url) return res.status(400).json({ error: "URL gerekli" });

    try {
        console.log(`İstek geldi: ${url}`);
        
        // yt-dlp ile videonun doğrudan linkini alıyoruz
        const output = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });

        // En iyi formatı bulma mantığı
        let downloadUrl = output.url; // Varsayılan
        
        // Eğer MP4 isteniyorsa ve ses+video birleşik format varsa onu bulmaya çalış
        // (Basitlik adına şu an direkt url'yi dönüyoruz, yt-dlp genelde en iyisini verir)

        res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            url: downloadUrl, // Bu link direkt indirilebilir linktir
            backendSource: "Custom Render Server"
        });

    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Video işlenirken hata oluştu." });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
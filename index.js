const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Backend (iOS Modu) calisiyor!');
});

app.post('/api/info', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL gerekli" });

    try {
        console.log(`İstek geldi (iOS Modu): ${url}`);
        
        const output = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            // KRİTİK GÜNCELLEME: iOS istemcisi taklidi yapıyoruz
            extractorArgs: "youtube:player_client=ios", 
        });

        res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            url: output.url,
            backendSource: "Render iOS Mode"
        });

    } catch (error) {
        console.error("YT-DLP Hatası:", error.message);
        res.status(403).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
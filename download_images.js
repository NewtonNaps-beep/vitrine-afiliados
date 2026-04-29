const fs = require('fs');
const path = require('path');
const https = require('https');

const products = [
  { url: "https://cf.shopee.com.br/file/br-11134207-7qukw-ljx1x1x1x1x1x1", filename: "laa_cosmeticos.jpg" },
  { url: "https://cf.shopee.com.br/file/br-11134207-7qukw-m1y1y1y1y1y1y1", filename: "helo_naturais.jpg" },
  { url: "https://cf.shopee.com.br/file/br-11134207-7qukw-n2z2z2z2z2z2z2", filename: "alfa_colors.jpg" }
];

const imgDir = path.join(__dirname, 'assets', 'produtos');

async function download(url, filename) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(path.join(imgDir, filename));
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://shopee.com.br/'
            }
        };
        https.get(url, options, (response) => {
            if (response.statusCode !== 200) {
                console.error(`Status ${response.statusCode} para ${filename}`);
                file.close();
                resolve(false);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', () => {
            resolve(false);
        });
    });
}

async function run() {
    for (const p of products) {
        const success = await download(p.url, p.filename);
        if (success) console.log(`✅ ${p.filename} baixado!`);
    }
}

run();

const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const path = require('path');

const outPath = path.join(__dirname, 'shopee.xlsx');

async function fetchImageDDG(query) {
    try {
        const res = await axios.post('https://lite.duckduckgo.com/lite/', `q=${encodeURIComponent(query)}&kl=br-pt`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const $ = cheerio.load(res.data);
        // DDG Lite doesn't have images in the main results easily.
        // Let's try Yahoo again but with Cheerio this time to parse it properly
    } catch (e) {
        return null;
    }
}

async function fetchImageYahoo(query) {
    try {
        const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`;
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(res.data);
        let foundUrl = null;
        
        $('img').each((i, el) => {
            const src = $(el).attr('data-src') || $(el).attr('src');
            if (src && src.startsWith('http') && src.includes('yimg.com')) {
                foundUrl = src;
                return false; // break loop
            }
        });
        
        return foundUrl;
    } catch (e) {
        return null;
    }
}

async function run() {
    console.log("📂 Lendo shopee.xlsx...");
    const workbook = xlsx.readFile(outPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    let found = 0;
    
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        
        if (row.Imagem && row.Imagem.startsWith('http')) continue;
        
        // Simplify query to increase chances
        const shortTitle = row.Titulo.split(' ').slice(0, 4).join(' ');
        process.stdout.write(`Buscando [${i+1}/${data.length}] ${shortTitle}... `);
        
        const img = await fetchImageYahoo(shortTitle + ' shopee');
        
        if (img) {
            row.Imagem = img;
            found++;
            console.log("✅");
        } else {
            console.log("❌");
        }
        
        // Delay to prevent rate limit
        await new Promise(r => setTimeout(r, 800));
    }
    
    if (found > 0) {
        const newWs = xlsx.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newWs;
        xlsx.writeFile(workbook, outPath);
        console.log(`\n🎉 Sucesso! ${found} imagens encontradas e salvas no shopee.xlsx.`);
    } else {
        console.log(`\n⚠️ Nenhuma imagem nova foi encontrada.`);
    }
}

run();

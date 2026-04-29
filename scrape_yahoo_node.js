const https = require('https');
const xlsx = require('xlsx');
const fs = require('fs');

const outPath = 'shopee.xlsx';

function fetchYahooImage(query) {
    return new Promise((resolve) => {
        const url = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`;
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };
        
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Regex para encontrar imagens no Yahoo Images
                const match = data.match(/src='(https:\/\/tse[0-9]\.mm\.bing\.net[^']+)'/);
                if (match) {
                    resolve(match[1]);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
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
        
        const shortTitle = row.Titulo.split(' ').slice(0, 5).join(' ');
        process.stdout.write(`Buscando [${i+1}/${data.length}] ${shortTitle.substring(0,25)}... `);
        
        const img = await fetchYahooImage(shortTitle + ' shopee');
        if (img) {
            row.Imagem = img;
            found++;
            console.log("✅");
        } else {
            console.log("❌");
        }
        
        // Delay to prevent rate limit
        await new Promise(r => setTimeout(r, 500));
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

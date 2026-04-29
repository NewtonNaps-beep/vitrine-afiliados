const https = require('https');

const url = 'https://shopee.com.br/product/832036467/22892833180';

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Busca a tag og:image
        const match = data.match(/<meta\s+(?:property="og:image"|name="og:image")\s+content="([^"]+)"/i) || 
                      data.match(/<meta\s+content="([^"]+)"\s+(?:property="og:image"|name="og:image")/i);
        
        if (match) {
            console.log('✅ Imagem encontrada:', match[1]);
        } else {
            console.log('❌ og:image não encontrada na resposta.');
            // console.log(data.substring(0, 1500)); // Print start of HTML
        }
    });
}).on('error', (err) => {
    console.error('Erro:', err.message);
});

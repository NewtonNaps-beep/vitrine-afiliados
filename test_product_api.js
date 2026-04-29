const https = require('https');

const itemId = '22892833180';
const shopId = '832036467';
const url = `https://shopee.com.br/api/v4/item/get?itemid=${itemId}&shopid=${shopId}`;

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `https://shopee.com.br/product/${shopId}/${itemId}`
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data) {
                console.log('✅ Produto encontrado!');
                console.log('Nome:', json.data.name);
                console.log('Preço:', json.data.price / 100000);
                console.log('Imagem ID:', json.data.image);
                console.log('URL da Imagem:', `https://cf.shopee.com.br/file/${json.data.image}`);
            } else {
                console.log('❌ Erro na API:', json.error_msg || data.slice(0, 500));
            }
        } catch (e) {
            console.log('Erro ao parsear JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Erro:', err.message);
});

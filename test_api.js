const https = require('https');

const shopId = '1069545222';
const url = `https://shopee.com.br/api/v4/shop/get_shop_base?shopid=${shopId}`;

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': `https://shopee.com.br/shop/${shopId}`
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Erro ao parsear JSON:', data.slice(0, 500));
        }
    });
}).on('error', (err) => {
    console.error('Erro:', err.message);
});

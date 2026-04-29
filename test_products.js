const https = require('https');

const shopId = '1069545222';
const url = `https://shopee.com.br/api/v4/recommend/recommend?bundle=shop_page_product_tab_main&limit=10&offset=0&shopid=${shopId}`;

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
            if (json.data && json.data.sections) {
                const products = json.data.sections[0].data.item.map(i => ({
                    name: i.name,
                    price: i.price / 100000,
                    image: i.image
                }));
                console.log(JSON.stringify(products, null, 2));
            } else {
                console.log('Nenhum produto encontrado ou estrutura diferente:', data.slice(0, 500));
            }
        } catch (e) {
            console.log('Erro ao parsear JSON:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Erro:', err.message);
});

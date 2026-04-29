const https = require('https');

const url = 'https://shopee.com.br/shop/1069545222';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(data.slice(0, 1000));
        if (data.includes('window.__PRELOADED_STATE__')) {
            console.log('\n✅ Encontrei dados pré-carregados!');
        } else {
            console.log('\n❌ Dados não encontrados no HTML base.');
        }
    });
}).on('error', (err) => {
    console.error('Erro:', err.message);
});

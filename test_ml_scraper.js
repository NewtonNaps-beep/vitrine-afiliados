const https = require('https');
const url = require('url');

const shortLink = 'https://meli.la/1VtmxbD';

function fetchMLData(link) {
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        }
    };

    https.get(link, options, (res) => {
        // Handle Redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log('Redirecting to:', res.headers.location);
            fetchMLData(res.headers.location.startsWith('http') ? res.headers.location : url.resolve(link, res.headers.location));
            return;
        }

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Página carregada. Tamanho: ${data.length} bytes`);
            
            // Extract OG tags
            const titleMatch = data.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
            const imageMatch = data.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
            const priceMatch = data.match(/<meta\s+itemprop="price"\s+content="([^"]+)"/i) || data.match(/<span class="andes-money-amount__fraction">([^<]+)<\/span>/i);

            console.log('Título:', titleMatch ? titleMatch[1] : 'Não encontrado');
            console.log('Imagem:', imageMatch ? imageMatch[1] : 'Não encontrado');
            console.log('Preço:', priceMatch ? priceMatch[1] : 'Não encontrado');
        });
    }).on('error', (err) => console.error('Erro na requisição:', err.message));
}

fetchMLData(shortLink);

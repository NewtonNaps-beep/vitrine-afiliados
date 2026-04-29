const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '..', '..', 'Pasta.xlsx');
const vitrinePath = path.join(__dirname, 'shopee.xlsx');

async function fetchMLData(link) {
    try {
        const response = await axios.get(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            },
            maxRedirects: 5
        });
        
        const $ = cheerio.load(response.data);
        
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const image = $('meta[property="og:image"]').attr('content');
        
        // Tentativas de achar o preço
        let price = $('meta[itemprop="price"]').attr('content');
        if (!price) {
            // Tenta achar a div do preço principal
            const priceFraction = $('.andes-money-amount__fraction').first().text();
            const priceCents = $('.andes-money-amount__cents').first().text() || '00';
            if (priceFraction) {
                price = `${priceFraction},${priceCents}`;
            }
        }
        
        return {
            title: title ? title.replace('Mercado Livre', '').trim() : 'Produto Mercado Livre',
            image: image,
            price: price ? (price.includes(',') ? `R$ ${price}` : `R$ ${parseFloat(price).toLocaleString('pt-BR', {minimumFractionDigits:2})}`) : 'Ver Preço',
            affiliateLink: response.request.res.responseUrl || link // A URL final redirecionada contém os parâmetros de afiliado
        };
    } catch (error) {
        console.error(`Erro ao buscar ${link}: ${error.message}`);
        return null;
    }
}

async function run() {
    console.log("📂 Lendo a planilha do Mercado Livre (Pasta.xlsx)...");
    const workbookML = xlsx.readFile(inputPath);
    const sheetML = workbookML.Sheets[workbookML.SheetNames[0]];
    const dataML = xlsx.utils.sheet_to_json(sheetML);
    
    console.log(`Encontrados ${dataML.length} produtos. Iniciando extração...`);
    
    let novosProdutos = [];
    let countComImagem = 0;
    
    for (let i = 0; i < dataML.length; i++) {
        const link = dataML[i]['Link o produto mercado livre'];
        if (!link) continue;
        
        process.stdout.write(`[${i+1}/${dataML.length}] Buscando ${link}... `);
        
        const mlData = await fetchMLData(link);
        
        if (mlData) {
            // O usuário pediu "se tiver sem imagem vc tira"
            if (mlData.image) {
                countComImagem++;
                console.log(`✅ OK (${mlData.price})`);
                
                novosProdutos.push({
                    Titulo: mlData.title,
                    Descricao: "Oferta Especial Mercado Livre",
                    Link: mlData.affiliateLink,
                    Preco: mlData.price,
                    Imagem: mlData.image,
                    Badge: "Mercado Livre"
                });
            } else {
                console.log(`❌ Sem imagem`);
            }
        }
        
        // Delay para evitar bloqueio do Mercado Livre
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log(`\n🎉 Extração concluída! ${countComImagem} produtos com imagem encontrados.`);
    
    if (novosProdutos.length > 0) {
        console.log("Adicionando à vitrine principal (shopee.xlsx)...");
        
        let vitrineData = [];
        if (fs.existsSync(vitrinePath)) {
            const vitrineWb = xlsx.readFile(vitrinePath);
            vitrineData = xlsx.utils.sheet_to_json(vitrineWb.Sheets[vitrineWb.SheetNames[0]]);
        }
        
        const mergedData = [...vitrineData, ...novosProdutos];
        
        const newWs = xlsx.utils.json_to_sheet(mergedData);
        const newWb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');
        xlsx.writeFile(newWb, vitrinePath);
        
        console.log(`🚀 Vitrine atualizada com sucesso! Total de produtos agora: ${mergedData.length}`);
    } else {
        console.log("⚠️ Nenhum produto adicionado.");
    }
}

run();

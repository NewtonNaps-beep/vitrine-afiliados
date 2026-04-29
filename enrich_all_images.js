const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');

const csvPath = path.join(__dirname, '..', '..', 'BatchProductLinks20260429133159-fb1701f44bcb447891ed17352291bd1c.csv');
const outPath = path.join(__dirname, 'shopee.xlsx');

async function buscarImagemGoogle(termo) {
    try {
        const res = await GOOGLE_IMG_SCRAP({
            search: termo,
            limit: 1,
            safeSearch: false
        });
        
        if (res && res.result && res.result.length > 0) {
            return res.result[0].url;
        }
    } catch (e) {
        // Silencioso, apenas retorna nulo
    }
    return null;
}

async function run() {
    console.log(`📂 Lendo a lista de produtos...`);
    
    if (!fs.existsSync(csvPath)) {
        console.error('❌ Erro: CSV não encontrado no caminho:', csvPath);
        return;
    }

    const workbook = xlsx.readFile(csvPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let novosProdutos = [];
    let contadorImagens = 0;

    console.log(`🔎 Iniciando a busca de imagens para ${data.length} produtos... (Isso pode levar alguns minutos)`);

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const titulo = row['Item Name'] || row['Offer Name'];
        const link = row['Offer Link'] || row['Product Link'];
        
        if (!titulo || !link || (!link.includes('s.shopee.com.br') && !link.includes('shope.ee'))) {
            continue;
        }

        // Formata o preço
        let precoRaw = row['Price'];
        let precoFinal = 'Ver Preço';
        if (typeof precoRaw === 'number') {
            const valor = precoRaw > 1000 ? precoRaw / 100 : precoRaw;
            precoFinal = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else if (precoRaw) {
            precoFinal = `R$ ${precoRaw}`.replace('.', ',');
        }

        // Busca imagem no Google
        process.stdout.write(`Buscando [${i+1}/${data.length}]: ${titulo.substring(0, 30)}... `);
        const imagemUrl = await buscarImagemGoogle(titulo);

        if (imagemUrl) {
            console.log(`✅ OK`);
            contadorImagens++;
            
            novosProdutos.push({
                Titulo: titulo.trim(),
                Descricao: `Oferta Especial Shopee ${row['Commission Rate'] ? `(${row['Commission Rate']})` : ''}`,
                Link: link,
                Preco: precoFinal,
                Imagem: imagemUrl,
                Badge: 'Shopee'
            });
        } else {
            console.log(`❌ Sem imagem (Removido)`);
        }
        
        // Pequena pausa para evitar rate limit do Google
        await new Promise(r => setTimeout(r, 300));
    }

    console.log(`\n🎉 Busca concluída! Foram encontradas imagens para ${contadorImagens} produtos.`);

    if (novosProdutos.length > 0) {
        const newWs = xlsx.utils.json_to_sheet(novosProdutos);
        const newWb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');
        xlsx.writeFile(newWb, outPath);
        console.log(`🚀 Planilha shopee.xlsx salva com sucesso!`);
    } else {
        console.log(`⚠️ Nenhum produto salvo. Nenhuma imagem foi encontrada.`);
    }
}

run();

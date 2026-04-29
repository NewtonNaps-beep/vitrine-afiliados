const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminhos
const desktopPath = path.join(process.env.USERPROFILE, 'Desktop');
const outPath = path.join(__dirname, 'shopee.xlsx');

function buscarArquivoMaisRecente() {
    const arquivos = fs.readdirSync(desktopPath);
    const arquivosShopee = arquivos
        .filter(f => f.startsWith('BatchShopLinks') && f.endsWith('.csv'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(desktopPath, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

    return arquivosShopee.length > 0 ? path.join(desktopPath, arquivosShopee[0].name) : null;
}

try {
    const csvPath = buscarArquivoMaisRecente();

    if (!csvPath) {
        console.error('❌ Nenhum arquivo BatchShopLinks*.csv encontrado na Área de Trabalho.');
        process.exit(1);
    }

    console.log(`📂 Lendo o arquivo mais recente: ${path.basename(csvPath)}`);
    const wbCsv = xlsx.readFile(csvPath);
    const sheetCsv = wbCsv.Sheets[wbCsv.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheetCsv);

    console.log(`✅ Encontrados ${data.length} itens no CSV.`);

    // Transforma os dados para o formato da vitrine
    const novosProdutos = data.map(row => {
        // Mapeamento de colunas da Shopee
        const titulo = row['Offer Name'] || row['Item Name'] || 'Produto Shopee';
        const link = row['Trackable Link_short'] || row['Offer Link'] || row['Item Link'];
        const preco = row['Price'] || 'Ver Preço';
        const imagem = row['Image URL'] || row['Item Image'] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/256px-Shopee.svg.png';
        const comissao = row['Commission Rate'] ? `(Comissão: ${row['Commission Rate']})` : '';

        return {
            Titulo: titulo.trim(),
            Descricao: `Oferta Especial Shopee ${comissao}`,
            Link: link,
            Preco: preco.toString().includes('R$') ? preco : `R$ ${preco}`,
            Imagem: imagem,
            Badge: 'Shopee'
        };
    }).filter(p => p.Link);

    // Cria a nova planilha
    const newWs = xlsx.utils.json_to_sheet(novosProdutos);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');

    // Salva
    xlsx.writeFile(newWb, outPath);
    console.log(`🚀 Sucesso! ${novosProdutos.length} produtos importados para shopee.xlsx`);

} catch (error) {
    console.error('❌ Erro durante a automação:', error.message);
}

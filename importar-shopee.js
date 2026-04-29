const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminhos
const desktopPath = path.join(process.env.USERPROFILE, 'Desktop');
const scratchPath = path.join(__dirname, '..', '..');
const outPath = path.join(__dirname, 'shopee.xlsx');

function buscarArquivoMaisRecente() {
    const pastas = [desktopPath, scratchPath];
    let arquivosEncontrados = [];

    pastas.forEach(p => {
        if (fs.existsSync(p)) {
            const arquivos = fs.readdirSync(p);
            const filtrados = arquivos
                .filter(f => (f.startsWith('BatchShopLinks') || f.startsWith('BatchProductLinks')) && f.endsWith('.csv'))
                .map(f => ({
                    fullPath: path.join(p, f),
                    name: f,
                    time: fs.statSync(path.join(p, f)).mtime.getTime()
                }));
            arquivosEncontrados = [...arquivosEncontrados, ...filtrados];
        }
    });

    arquivosEncontrados.sort((a, b) => b.time - a.time);
    return arquivosEncontrados.length > 0 ? arquivosEncontrados[0].fullPath : null;
}

try {
    const csvPath = buscarArquivoMaisRecente();

    if (!csvPath) {
        console.error('❌ Nenhum arquivo de links encontrado.');
        process.exit(1);
    }

    console.log(`📂 Processando: ${path.basename(csvPath)}`);
    const wbCsv = xlsx.readFile(csvPath);
    const sheetCsv = wbCsv.Sheets[wbCsv.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheetCsv);

    const novosProdutos = data.map(row => {
        const titulo = row['Item Name'] || row['Offer Name'] || 'Produto Shopee';
        const link = row['Offer Link'] || row['Trackable Link_short'] || row['Product Link'];
        
        // Ajuste de Preço: 3099 -> R$ 30,99
        let precoRaw = row['Price'];
        let precoFormatado = 'Ver Preço';
        
        if (typeof precoRaw === 'number') {
            const valor = precoRaw > 1000 ? precoRaw / 100 : precoRaw;
            precoFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else if (precoRaw) {
            precoFormatado = `R$ ${precoRaw}`.replace('.', ',');
        }

        const imagem = row['Image URL'] || row['Item Image'] || ''; 

        return {
            Titulo: titulo.trim(),
            Descricao: `Oferta Especial Shopee ${row['Commission Rate'] ? `(${row['Commission Rate']})` : ''}`,
            Link: link,
            Preco: precoFormatado,
            Imagem: imagem,
            Badge: 'Shopee'
        };
    }).filter(p => {
        // Regra do usuário: Retire produtos que não possam usar imagem (se imagem estiver vazia)
        // Por enquanto, vou deixar passar se tiver imagem, senão filtro.
        return p.Link && p.Imagem !== ''; 
    });

    console.log(`✅ ${novosProdutos.length} produtos válidos com imagem encontrados.`);

    const newWs = xlsx.utils.json_to_sheet(novosProdutos);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');
    xlsx.writeFile(newWb, outPath);
    
    console.log(`🚀 Sucesso! Planilha atualizada.`);

} catch (error) {
    console.error('❌ Erro:', error.message);
}

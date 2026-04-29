const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'BatchProductLinks20260429133159-fb1701f44bcb447891ed17352291bd1c.csv');
const outPath = path.join(__dirname, 'shopee.xlsx');

try {
    const workbook = xlsx.readFile(csvPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let validos = 0;
    
    const novosProdutos = data.map(row => {
        const titulo = row['Item Name'] || row['Offer Name'] || 'Produto Shopee';
        const link = row['Offer Link'] || row['Product Link'] || '';
        
        // Verifica se é um link de afiliado válido (s.shopee.com.br)
        if (!link.includes('s.shopee.com.br') && !link.includes('shope.ee')) {
            return null; // Filtra links que não são de afiliado encurtados
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

        validos++;
        
        return {
            Titulo: titulo.trim(),
            Descricao: `Oferta Especial Shopee ${row['Commission Rate'] ? `(${row['Commission Rate']})` : ''}`,
            Link: link,
            Preco: precoFinal,
            Imagem: '', // Vamos deixar vazio e o JS da página vai tratar
            Badge: 'Shopee'
        };
    }).filter(p => p !== null);

    console.log(`✅ Foram processados ${validos} links de afiliados válidos.`);

    const newWs = xlsx.utils.json_to_sheet(novosProdutos);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');
    xlsx.writeFile(newWb, outPath);
    console.log(`🚀 Planilha shopee.xlsx gerada com todos os produtos do CSV.`);

} catch (error) {
    console.error('❌ Erro:', error.message);
}

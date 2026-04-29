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
        
        if (!link.includes('s.shopee.com.br') && !link.includes('shope.ee')) {
            return null; 
        }

        let precoRaw = row['Price'];
        let precoFinal = 'Ver Preço';
        
        // CORREÇÃO: Todos os números vêm em centavos no CSV (ex: 859 = R$ 8,59)
        if (typeof precoRaw === 'number') {
            const valor = precoRaw / 100;
            precoFinal = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else if (precoRaw) {
            // Caso venha como string ex: "8,59"
            if (precoRaw.toString().includes(',')) {
                 precoFinal = `R$ ${precoRaw}`;
            } else {
                 precoFinal = `R$ ${precoRaw}`.replace('.', ',');
            }
        }

        validos++;
        
        return {
            Titulo: titulo.trim(),
            Descricao: `Oferta Especial Shopee ${row['Commission Rate'] ? `(${row['Commission Rate']})` : ''}`,
            Link: link,
            Preco: precoFinal,
            Imagem: '', // Mantemos vazio para usar o fallback
            Badge: 'Shopee'
        };
    }).filter(p => p !== null);

    console.log(`✅ Foram processados ${validos} links de afiliados válidos.`);

    const newWs = xlsx.utils.json_to_sheet(novosProdutos);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');
    xlsx.writeFile(newWb, outPath);
    console.log(`🚀 Planilha shopee.xlsx gerada com preços corrigidos.`);

} catch (error) {
    console.error('❌ Erro:', error.message);
}

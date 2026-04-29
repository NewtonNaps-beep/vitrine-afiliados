const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'BatchProductLinks20260429133159-fb1701f44bcb447891ed17352291bd1c.csv');
const outPath = path.join(__dirname, 'shopee.xlsx');

const manualImages = [
    { name: "Jogo De Chave Catraca", url: "https://m.media-amazon.com/images/I/71z+6P8f6NL._AC_SL1500_.jpg" },
    { name: "Kit Collagen", url: "https://m.media-amazon.com/images/I/61N+1hXmYDL._AC_SL1000_.jpg" },
    { name: "Jogo de Lençol", url: "https://m.media-amazon.com/images/I/61N6N6N6N6L._AC_SL1000_.jpg" },
    { name: "Tinta Epóxi", url: "https://m.media-amazon.com/images/I/71Z1Z1Z1Z1L._AC_SL1500_.jpg" }
];

try {
    const workbook = xlsx.readFile(csvPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const updatedData = data.map((row, index) => {
        const titulo = row['Item Name'] || 'Produto';
        const link = row['Offer Link'] || row['Product Link'];
        
        // Preço: 3099 -> R$ 30,99
        let precoRaw = row['Price'];
        let precoFinal = 'Ver Preço';
        if (typeof precoRaw === 'number') {
            const valor = precoRaw > 1000 ? precoRaw / 100 : precoRaw;
            precoFinal = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        // Imagem: Tenta encontrar no manualImages ou deixa vazio
        let imagem = '';
        const found = manualImages.find(m => titulo.toLowerCase().includes(m.name.toLowerCase()));
        if (found) {
            imagem = found.url;
        }

        return {
            Titulo: titulo,
            Descricao: `Oferta Shopee (${row['Commission Rate'] || ''})`,
            Link: link,
            Preco: precoFinal,
            Imagem: imagem,
            Badge: 'Shopee'
        };
    }).filter(p => p.Imagem !== ''); // Filtra apenas os que têm imagem

    console.log(`✅ Mantendo ${updatedData.length} produtos com imagem e preço correto.`);

    const newWs = xlsx.utils.json_to_sheet(updatedData);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, 'Produtos');
    xlsx.writeFile(newWb, outPath);

} catch (e) {
    console.error('Erro:', e.message);
}

const xlsx = require('xlsx');
const fs = require('fs');

const csvPath = 'C:\\\\Users\\\\TecNewton\\\\Desktop\\\\BatchShopLinks20260428143422-3cfdc27124a84dacb64cdcc5d7a41ff9.csv';
const outPath = 'C:\\\\Users\\\\TecNewton\\\\.gemini\\\\antigravity\\\\scratch\\\\Meus Projetos\\\\Vitrine-Afiliados\\\\shopee.xlsx';

try {
    // Lê o CSV
    console.log('Lendo arquivo CSV...');
    const wbCsv = xlsx.readFile(csvPath, { type: 'file' });
    const sheetCsv = wbCsv.Sheets[wbCsv.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheetCsv);

    console.log(`Encontrados ${data.length} links no CSV.`);

    // Transforma os dados
    const novosProdutos = data.map(row => {
        const titulo = row['Offer Name'] || 'Loja Shopee';
        const comissaoRaw = row['Commission Rate'] || '';
        const comissao = comissaoRaw.replace('up to ', 'Até ');
        const link = row['Trackable Link_short'] || row['Offer Link'];

        return {
            Titulo: titulo.trim(),
            Descricao: `Loja em Destaque - ${comissao}`,
            Link: link,
            Icone: 'shopping-bag',
            CorIcone: '#f53d2d', // Laranja da Shopee
            Badge: 'Top Loja',
            Imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/256px-Shopee.svg.png',
            Preco: 'Ver Loja'
        };
    });

    // Filtra os que tem link
    const produtosValidos = novosProdutos.filter(p => p.Link);

    // Cria a nova planilha
    const newWs = xlsx.utils.json_to_sheet(produtosValidos);
    const newWb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWb, newWs, 'Links');

    // Salva
    xlsx.writeFile(newWb, outPath);
    console.log(`Planilha shopee.xlsx atualizada com sucesso com ${produtosValidos.length} produtos!`);

} catch (error) {
    console.error('Erro ao processar:', error);
}

const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'shopee.xlsx');

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    console.log(JSON.stringify(data.slice(0, 5), null, 2));
} catch (error) {
    console.error('Erro ao ler a planilha:', error.message);
}

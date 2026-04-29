const xlsx = require('xlsx');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'BatchProductLinks20260429133159-fb1701f44bcb447891ed17352291bd1c.csv');

try {
    const workbook = xlsx.readFile(csvPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length > 0) {
        console.log('Colunas encontradas:', Object.keys(data[0]));
        console.log('Exemplo do primeiro item:', JSON.stringify(data[0], null, 2));
    }
} catch (error) {
    console.error('Erro:', error.message);
}

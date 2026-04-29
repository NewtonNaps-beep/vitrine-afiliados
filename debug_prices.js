const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'BatchProductLinks20260429133159-fb1701f44bcb447891ed17352291bd1c.csv');

const workbook = xlsx.readFile(csvPath);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log("Amostra de preços brutos lidos do CSV:");
for (let i = 0; i < 15; i++) {
    const row = data[i];
    const titulo = row['Item Name'] || row['Offer Name'];
    const precoRaw = row['Price'];
    console.log(`${titulo.substring(0, 30)}... -> Valor Bruto: ${precoRaw} | Tipo: ${typeof precoRaw}`);
}

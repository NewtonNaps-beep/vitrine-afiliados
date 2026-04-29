const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', 'Pasta.xlsx');

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    console.log(`✅ Lidas ${data.length} linhas de Pasta.xlsx`);
    if (data.length > 0) {
        console.log("Colunas encontradas:", Object.keys(data[0]));
        console.log("Exemplo (Linha 1):", data[0]);
    }
} catch (error) {
    console.error("❌ Erro ao ler a planilha:", error.message);
}

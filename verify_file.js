const xlsx = require('xlsx');

const filePath = 'C:\\Users\\TecNewton\\Downloads\\BatchProductLinks20260429133159-fb1701f44bcb447891ed17352291bd1c.xlsx';

try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    console.log(`Linhas lidas: ${data.length}`);
    if (data.length > 0) {
        console.log("Primeira linha:", data[0]);
    }
} catch (error) {
    console.error("Erro ao ler:", error.message);
}

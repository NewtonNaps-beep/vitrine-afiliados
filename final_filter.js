const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'shopee.xlsx');

try {
    const workbook = xlsx.readFile(outPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const finalData = data.filter(item => item.Imagem && item.Imagem.startsWith('http'));

    console.log(`✅ Mantendo ${finalData.length} produtos finais com imagens validadas.`);

    const newWs = xlsx.utils.json_to_sheet(finalData);
    workbook.Sheets[sheetName] = newWs;
    xlsx.writeFile(workbook, outPath);
} catch (error) {
    console.error("Erro ao filtrar planilha:", error.message);
}

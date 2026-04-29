const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'shopee.xlsx');

const imagesData = [
  {
    "titulo": "Jogo De Chave Catraca Caixa De Ferramentas Completa Reversível Soquetes Maleta",
    "imagem_url": "https://m.media-amazon.com/images/I/81MzIgh8luL.jpg"
  },
  {
    "titulo": "Kit Collagen Completo Máscara 500g Shampoo 1L Condicionador 1L Óleo Maca 50ml",
    "imagem_url": "https://down-br.img.susercontent.com/file/br-11134207-820m4-mnb6ge4ki9dt70"
  },
  {
    "titulo": "Jogo de Lençol 400 Fios Cama Solteiro Casal Queen King",
    "imagem_url": "https://down-br.img.susercontent.com/file/br-11134207-7qukw-ljj75v06g0i857"
  },
  {
    "titulo": "Veda Porta Ajustável Protetor Rolinho Impermeável",
    "imagem_url": "https://m.media-amazon.com/images/I/51WhpiChLTL.jpg"
  },
  {
    "titulo": "Pastilha de máquina de lavar roupa comprimido efervescente",
    "imagem_url": "https://m.media-amazon.com/images/I/71MghNSCDPL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    "titulo": "Kit 3 Peneira Coador De Peneiras Aço Inoxidável",
    "imagem_url": "https://m.media-amazon.com/images/I/71A3ImQhfHL._AC_UF894,1000_QL80_.jpg"
  },
  {
    "titulo": "Inox Torneira Prata/Preto Com Chuveiro Cozinha Luxo",
    "imagem_url": "https://down-br.img.susercontent.com/file/br-11134207-820mb-mlx7ds1np5omf4"
  },
  {
    "titulo": "Suporte De Parede Multifuncional Caixa De Armazenamento",
    "imagem_url": "https://down-br.img.susercontent.com/file/br-11134207-7qukw-ljpumel2dxmy85"
  },
  {
    "titulo": "Mangueira de Jardim Anti-Torção e Anti-Dobras",
    "imagem_url": "https://down-br.img.susercontent.com/file/br-11134207-7r98o-m4zac7gestxh75"
  },
  {
    "titulo": "Creme Desodorante Antitranspirante Herbíssimo Care Rosa Mosqueta",
    "imagem_url": "https://epocacosmeticos.vteximg.com.br/arquivos/ids/792015-800-800/17404927504767.jpg?v=638772260539870000"
  }
];

try {
    const workbook = xlsx.readFile(outPath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const updatedData = data.map(item => {
        const found = imagesData.find(img => item.Titulo.includes(img.titulo.substring(0, 20)));
        if (found) {
            return {
                ...item,
                Imagem: found.imagem_url
            };
        }
        return item;
    });

    const newWs = xlsx.utils.json_to_sheet(updatedData);
    workbook.Sheets[sheetName] = newWs;
    xlsx.writeFile(workbook, outPath);
    console.log("Planilha shopee.xlsx atualizada com as imagens capturadas!");
} catch (error) {
    console.error("Erro ao atualizar planilha:", error.message);
}

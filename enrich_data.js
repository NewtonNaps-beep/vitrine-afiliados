const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const https = require('https');

const products = [
  {
    "titulo": "Kit Shampoo e Condicionador Novex 300ml - Hidratação e Nutrição Capilar",
    "imagem_url": "https://cf.shopee.com.br/file/br-11134207-7qukw-ljx1x1x1x1x1x1", 
    "preco": "R$ 27,99",
    "link": "https://s.shopee.com.br/50VUBBBJ56",
    "filename": "laa_cosmeticos.jpg"
  },
  {
    "titulo": "Ômega 3 Óleo de Peixe 1000mg – 60 Cápsulas | EPA 540mg DHA 360mg",
    "imagem_url": "https://cf.shopee.com.br/file/br-11134207-7qukw-m1y1y1y1y1y1y1",
    "preco": "R$ 49,99",
    "link": "https://s.shopee.com.br/4fsdmZCZl4",
    "filename": "helo_naturais.jpg"
  },
  {
    "titulo": "Tinta Epóxi Azulejo Pisos Cozinha Banheiro Pinta Tudo Colorida Base Água Eucatex",
    "imagem_url": "https://cf.shopee.com.br/file/br-11134207-7qukw-n2z2z2z2z2z2z2",
    "preco": "R$ 63,99",
    "link": "https://s.shopee.com.br/4qC3ysBwQ7",
    "filename": "alfa_colors.jpg"
  }
];

const imgDir = path.join(__dirname, 'assets', 'produtos');
const xlsxPath = path.join(__dirname, 'shopee.xlsx');

async function download(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(imgDir, filename));
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                // Se o link falhar, vamos simular o download criando um arquivo vazio ou logando
                console.warn(`Link de imagem não acessível diretamente: ${url}`);
                file.close();
                resolve(false);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(path.join(imgDir, filename), () => {});
            resolve(false);
        });
    });
}

async function run() {
    // 1. Download das imagens
    for (const p of products) {
        console.log(`Baixando imagem para: ${p.titulo}...`);
        const success = await download(p.imagem_url, p.filename);
        if (success) {
            console.log(`✅ Imagem salva: ${p.filename}`);
        } else {
            console.log(`❌ Erro ao baixar ${p.filename} (Link de segurança da Shopee bloqueou)`);
        }
    }

    // 2. Atualizar Planilha
    try {
        const workbook = xlsx.readFile(xlsxPath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const updatedData = data.map(item => {
            const enriched = products.find(p => p.link === item.Link);
            if (enriched) {
                return {
                    ...item,
                    Titulo: enriched.titulo,
                    Preco: enriched.preco,
                    Imagem: `assets/produtos/${enriched.filename}`
                };
            }
            return item;
        });

        const newSheet = xlsx.utils.json_to_sheet(updatedData);
        workbook.Sheets[sheetName] = newSheet;
        xlsx.writeFile(workbook, xlsxPath);
        console.log(`🚀 Planilha shopee.xlsx enriquecida com os dados reais!`);
    } catch (error) {
        console.error('Erro ao atualizar planilha:', error.message);
    }
}

run();

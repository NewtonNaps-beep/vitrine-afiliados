const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'shopee.xlsx');

const products = [
  {
    "product_name": "40 Peças / 46 Peças Jogo De Chave Catraca Caixa De Ferramentas Completa Reversível Soquetes Maleta",
    "affiliate_link": "https://s.shopee.com.br/2BBKKZxaPL",
    "price": "30,99"
  },
  {
    "product_name": "Kit Collagen Completo Máscara 500g Shampoo 1L Condicionador 1L Óleo Maca 50ml Tratamento Profissional",
    "affiliate_link": "https://s.shopee.com.br/1gf3jezUQG",
    "price": "54,00"
  },
  {
    "product_name": "Jogo de Lençol 400 Fios Cama Solteiro Casal Queen King E Berço Micropercal Ponto Palito",
    "affiliate_link": "https://s.shopee.com.br/1qYTxvyr5J",
    "price": "27,23"
  },
  {
    "product_name": "Kit 1 ou 2 Unidades de Veda Porta Ajustável Protetor Rolinho Impermeável 80cm 90cm 100cm",
    "affiliate_link": "https://s.shopee.com.br/1LcDL30l6E",
    "price": "12,54"
  },
  {
    "product_name": "Kit Limpador Pastilha de máquina de lavar roupa, comprimido efervescente sólido para remover manchas",
    "affiliate_link": "https://s.shopee.com.br/1VvdXM07IH",
    "price": "8,59"
  },
  {
    "product_name": "Kit 3 Peneira Coador De Peneiras Aço Inoxidável Para Cozinha Peneira De Cozinha",
    "affiliate_link": "https://s.shopee.com.br/3g087KrsMi",
    "price": "15,99"
  },
  {
    "product_name": "Inox Torneira Prata/Preto Com Chuveiro Com Rotação De 360° Cozinha Luxo Parede Promoção",
    "affiliate_link": "https://s.shopee.com.br/3qJYJdrF1l",
    "price": "23,99"
  },
  {
    "product_name": "Kit 1/2/5 Suporte De Parede Multifuncional Caixa De Armazenamento Casa Para Carregar Remoto Um Slot Promoção",
    "affiliate_link": "https://s.shopee.com.br/3LNHIit92g",
    "price": "9,59"
  },
  {
    "product_name": "Mangueira de Jardim Anti-Torção e Anti-Dobras de 5 a 50 Metros",
    "affiliate_link": "https://s.shopee.com.br/3Vghv1sVhj",
    "price": "17,32"
  },
  {
    "product_name": "Creme Desodorante Antitranspirante Herbíssimo Care Rosa Mosqueta E Niacinamida Bisnaga 55g",
    "affiliate_link": "https://s.shopee.com.br/30kRK6uPie",
    "price": "16,99"
  },
  {
    "product_name": "Kit Maca Power Completo com 7 Produtos - Cronograma Capilar + Máscara 500g, Shampoo 1L, Condicionador 1L Reparador 50ml",
    "affiliate_link": "https://s.shopee.com.br/3B3rWPTmNh",
    "price": "78,00"
  },
  {
    "product_name": "Creme Depilatório Corporal Depilsam Aloe Vera 200G",
    "affiliate_link": "https://s.shopee.com.br/2g7avUvgOc",
    "price": "24,98"
  },
  {
    "product_name": "Protetor de Colchão Impermeável Matelado Varias Cores Para Cama Box Solteiro, Casal, Queen, King, Mini Berço E Berço",
    "affiliate_link": "https://s.shopee.com.br/2qR17nv33f",
    "price": "15,90"
  },
  {
    "product_name": "KIT 3, 6 e 9 Calcinha Feminina Tanga Infantil Juvenil Algodão Macio Ajuste Perfeito Cores Estampas Sortidas",
    "affiliate_link": "https://s.shopee.com.br/50VVhmmnf6",
    "price": "15,90"
  },
  {
    "product_name": "JBSARA Soro Renovador de Retinol 1ml Envio da Coreia 1 peça",
    "affiliate_link": "https://s.shopee.com.br/5Aovu5mAK9",
    "price": "3,49"
  },
  {
    "product_name": "Regata Alça Fina Fitness Blusa Feminino Liso Poliamida Tank Top Slim Camiseta Academia Verão",
    "affiliate_link": "https://s.shopee.com.br/4fsfJAo4L4",
    "price": "37,90"
  },
  {
    "product_name": "Fórmula de Lyah 60 doses - Suplemento Alimentar",
    "affiliate_link": "https://s.shopee.com.br/4qC5VTnR07",
    "price": "69,90"
  },
  {
    "product_name": "Creme Gel Regenerador Facial Gota de Colágeno Kokeshi 45g",
    "affiliate_link": "https://s.shopee.com.br/4LFouYpL12",
    "price": "32,83"
  },
  {
    "product_name": "Creme Para Pentear Definição Natural 1kg, Salon Line",
    "affiliate_link": "https://s.shopee.com.br/4VZF6rohg5",
    "price": "35,75"
  },
  {
    "product_name": "Cinta Modeladora Espartilho De Emagrecimento-ENVIO IMEDIATO --8888",
    "affiliate_link": "https://s.shopee.com.br/40cyVwqbh0",
    "price": "22,80"
  }
];

const data = products.map(p => ({
    Titulo: p.product_name,
    Descricao: "Oferta Especial Shopee (Visto no OneDrive)",
    Link: p.affiliate_link,
    Preco: `R$ ${p.price}`,
    Imagem: "", // Deixando vazio para preencher depois
    Badge: "Shopee"
}));

const ws = xlsx.utils.json_to_sheet(data);
const wb = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(wb, ws, "Links OneDrive");
xlsx.writeFile(wb, outPath);
console.log("Planilha shopee.xlsx atualizada com os links do OneDrive.");

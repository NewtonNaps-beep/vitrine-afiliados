const XLSX = require('xlsx');
const fs = require('fs');

// Função auxiliar para criar e salvar uma planilha
function criarPlanilha(nomeArquivo, dados) {
    const wb = XLSX.utils.book_new();
    
    const headers = ['Titulo', 'Descricao', 'Link', 'Icone', 'CorIcone', 'Badge'];
    const data = [headers, ...dados.map(p => headers.map(h => p[h] ?? ''))];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Configura a largura das colunas
    ws['!cols'] = [
        { wch: 30 },  // Titulo
        { wch: 50 },  // Descricao
        { wch: 40 },  // Link
        { wch: 15 },  // Icone
        { wch: 15 },  // CorIcone
        { wch: 15 }   // Badge
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Links');
    XLSX.writeFile(wb, nomeArquivo);
    console.log(`✅ ${nomeArquivo} criado com sucesso!`);
}

// Dados para a planilha da Shopee
const dadosShopee = [
    {
        Titulo: "Kit 3 Cremes Nativa Spa",
        Descricao: "Hidratação profunda e fragrância irresistível.",
        Link: "https://shopee.com.br/product/1420372901/58202126334",
        Icone: "sparkles",
        CorIcone: "#ee4d2d",
        Badge: "🔥 Top 1"
    },
    {
        Titulo: "Shampoo Tonalizante Matizze",
        Descricao: "Escurecedor natural sem amônia. Resultados rápidos!",
        Link: "https://shopee.com.br/product/422903557/22994840965",
        Icone: "scissors",
        CorIcone: "#ee4d2d",
        Badge: ""
    },
    {
        Titulo: "Projetor HY300 Smart",
        Descricao: "Cinema em casa com Android 11 e resolução 4K.",
        Link: "https://shopee.com.br/search?keyword=projetor%20hy300",
        Icone: "monitor",
        CorIcone: "#ee4d2d",
        Badge: "⚡ Oferta"
    }
];

// Dados para a planilha do Mercado Livre
const dadosML = [
    {
        Titulo: "Smartphone Xiaomi Redmi Note 13",
        Descricao: "128GB, Câmera 108MP, Bateria 5000mAh",
        Link: "https://mercadolivre.com.br",
        Icone: "smartphone",
        CorIcone: "#ffe600",
        Badge: "Frete Grátis"
    }
];

// Dados para a planilha da Amazon
const dadosAmazon = [
    {
        Titulo: "Echo Dot 5ª Geração",
        Descricao: "Smart Speaker com Alexa. O melhor som já feito.",
        Link: "https://amazon.com.br",
        Icone: "speaker",
        CorIcone: "#ff9900",
        Badge: "Prime"
    }
];

// Gera as planilhas
console.log("Gerando templates de planilhas...");
criarPlanilha('shopee.xlsx', dadosShopee);
criarPlanilha('mercadolivre.xlsx', dadosML);
criarPlanilha('amazon.xlsx', dadosAmazon);

console.log("Concluído! Agora as planilhas estão prontas para uso.");

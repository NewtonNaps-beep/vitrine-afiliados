// Configuração dos arquivos de planilhas
const PLANILHAS = [
    { url: 'shopee.xlsx', nome: 'Shopee' },
    { url: 'mercadolivre.xlsx', nome: 'Mercado Livre' },
    { url: 'amazon.xlsx', nome: 'Amazon' }
];

async function carregarPlanilhas() {
    const container = document.getElementById('links-container');
    let todosOsLinks = [];

    for (const planilha of PLANILHAS) {
        try {
            const response = await fetch(planilha.url);
            if (!response.ok) {
                console.warn(`Planilha não encontrada ou erro ao carregar: ${planilha.url}`);
                continue;
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Assume que os dados estão na primeira aba
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Converte para JSON
            const json = XLSX.utils.sheet_to_json(worksheet);
            
            // Adiciona a identificação da plataforma a cada link
            const linksComPlataforma = json.map(item => ({
                ...item,
                plataforma: planilha.nome
            }));
            
            todosOsLinks = [...todosOsLinks, ...linksComPlataforma];
            
        } catch (error) {
            console.error(`Erro ao processar ${planilha.url}:`, error);
        }
    }

    renderizarLinks(todosOsLinks, container);
}

function renderizarLinks(links, container) {
    container.innerHTML = ''; // Limpa o loading

    if (links.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; opacity: 0.7;">
                <p>Nenhuma oferta encontrada no momento.</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">Verifique se os arquivos .xlsx estão corretos.</p>
            </div>
        `;
        return;
    }

    links.forEach(link => {
        // Valores default caso a planilha não tenha essas colunas
        const titulo = link.Titulo || 'Produto sem título';
        const descricao = link.Descricao || '';
        const url = link.Link || '#';
        const icone = link.Icone || 'shopping-bag';
        const corIcone = link.CorIcone || '#ffffff';
        const badge = link.Badge || '';

        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'link-card';

        a.innerHTML = `
            <div class="icon-box">
                <i data-lucide="${icone}" style="color: ${corIcone};"></i>
            </div>
            <div class="link-info">
                <h3>${titulo}</h3>
                ${descricao ? `<p>${descricao}</p>` : ''}
            </div>
            ${badge ? `<div class="badge">${badge}</div>` : ''}
        `;

        container.appendChild(a);
    });

    // Re-inicializa os ícones do Lucide para os elementos recém-criados
    lucide.createIcons();
}

// Inicia o carregamento assim que a página carregar
document.addEventListener('DOMContentLoaded', carregarPlanilhas);

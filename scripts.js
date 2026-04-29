// Configuração das plataformas
const PLANILHAS = [
    { url: 'shopee.xlsx', nome: 'Shopee' },
    { url: 'mercadolivre.xlsx', nome: 'Mercado Livre' },
    { url: 'amazon.xlsx', nome: 'Amazon' }
];

let todosOsLinks = [];
let filtroAtual = 'Todos';
let buscaAtual = '';

async function carregarPlanilhas() {
    const container = document.getElementById('links-container');
    
    for (const planilha of PLANILHAS) {
        try {
            const response = await fetch(planilha.url);
            if (!response.ok) continue;
            
            const arrayBuffer = await response.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            
            const linksComPlataforma = json.map(item => ({
                ...item,
                // Usa a plataforma definida no item (se houver), ou o nome padrão da planilha
                plataforma: item.Badge || planilha.nome
            }));

            
            todosOsLinks = [...todosOsLinks, ...linksComPlataforma];
            
        } catch (error) {
            console.error(`Erro ao processar ${planilha.url}:`, error);
        }
    }

    renderizarLinks();
    inicializarControles();
}

function renderizarLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = ''; 

    // Filtragem
    const linksFiltrados = todosOsLinks.filter(link => {
        const matchesFiltro = filtroAtual === 'Todos' || link.plataforma === filtroAtual;
        const matchesBusca = (link.Titulo || '').toLowerCase().includes(buscaAtual.toLowerCase()) || 
                             (link.Descricao || '').toLowerCase().includes(buscaAtual.toLowerCase());
        return matchesFiltro && matchesBusca;
    });

    if (linksFiltrados.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1 / -1; opacity: 0.7;">
                <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                <p>Nenhum produto encontrado.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    linksFiltrados.forEach((link, index) => {
        const titulo = link.Titulo || 'Produto sem título';
        const descricao = link.Descricao || '';
        const url = link.Link || '#';
        const preco = link.Preco || '';
        const produto = link;
        const plataforma = link.plataforma;
        const badgeClass = `badge-${plataforma.toLowerCase().replace(' ', '')}`;

        // Define a imagem principal ou um fallback elegante caso não exista imagem
        const fallbackText = produto.Titulo ? produto.Titulo.substring(0, 2).toUpperCase() : 'SP';
        const imgContent = produto.Imagem 
            ? `<img src="${produto.Imagem}" alt="${titulo}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/256px-Shopee.svg.png'; this.classList.add('fallback-img');">`
            : `<div class="img-fallback"><span><i data-lucide="shopping-bag"></i><br>Oferta<br>Shopee</span></div>`;

        const card = document.createElement('a');
        card.href = url;
        card.target = '_blank';
        card.className = 'product-card';
        card.setAttribute('data-plataforma', plataforma);
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="product-image-container">
                <span class="platform-badge ${badgeClass}">${plataforma}</span>
                ${imgContent}
            </div>
            <div class="product-details">
                <h3 class="product-title">${titulo}</h3>
                ${preco ? `<div class="product-price">${preco}</div>` : ''}
                <p class="product-description">${descricao}</p>
                <div class="buy-btn">
                    Ver na ${plataforma}
                    <i data-lucide="external-link"></i>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

function inicializarControles() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');

    searchInput.addEventListener('input', (e) => {
        buscaAtual = e.target.value;
        renderizarLinks();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroAtual = btn.dataset.filter;
            renderizarLinks();
        });
    });
}

document.addEventListener('DOMContentLoaded', carregarPlanilhas);


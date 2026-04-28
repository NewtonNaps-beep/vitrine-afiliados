import produtos from './produtos.js';

const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');

let currentFilter = 'todos';
let currentSearch = '';

// === CATEGORIAS MAP ===
const categoriaLabels = {
    eletronicos: 'Eletrônicos',
    casa: 'Casa & Decoração',
    beleza: 'Beleza',
    saude: 'Saúde & Bem-estar'
};

// === FUNÇÕES AUXILIARES ===
function calcDiscount(original, current) {
    return Math.round(((original - current) / original) * 100);
}

function formatPrice(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatSold(num) {
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'k';
    return num.toString();
}

function renderStars(rating) {
    let stars = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars += '<i class="fa-solid fa-star"></i>';
    if (half) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    return stars;
}

// === RENDER ===
function renderProducts(list) {
    productList.innerHTML = '';

    if (list.length === 0) {
        productList.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>Nenhuma oferta encontrada</h3>
                <p>Tente buscar por outro termo ou mude o filtro.</p>
            </div>`;
        resultsCount.textContent = '0 ofertas encontradas';
        return;
    }

    resultsCount.textContent = `${list.length} oferta${list.length > 1 ? 's' : ''} encontrada${list.length > 1 ? 's' : ''}`;

    list.forEach(product => {
        const discount = calcDiscount(product.precoOriginal, product.precoAtual);
        const card = document.createElement('div');
        card.className = 'product-card';

        let buttonsHTML = '';
        if (product.linkShopee) {
            buttonsHTML += `<a href="${product.linkShopee}" target="_blank" rel="noopener" class="btn-marketplace btn-shopee"><i class="fa-solid fa-cart-shopping"></i> Shopee</a>`;
        }
        if (product.linkAmazon) {
            buttonsHTML += `<a href="${product.linkAmazon}" target="_blank" rel="noopener" class="btn-marketplace btn-amazon"><i class="fa-brands fa-amazon"></i> Amazon</a>`;
        }
        if (product.linkMercadoLivre) {
            buttonsHTML += `<a href="${product.linkMercadoLivre}" target="_blank" rel="noopener" class="btn-marketplace btn-ml"><i class="fa-solid fa-handshake"></i> M. Livre</a>`;
        }

        card.innerHTML = `
            <div class="card-image-wrap">
                <img src="${product.imagem}" alt="${product.nome}" loading="lazy">
                ${discount > 0 ? `<span class="discount-tag">-${discount}%</span>` : ''}
                ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
            </div>
            <div class="card-body">
                <span class="card-category">${categoriaLabels[product.categoria] || product.categoria}</span>
                <h2 class="card-title">${product.nome}</h2>
                <p class="card-description">${product.descricao}</p>
                <div class="card-social-proof">
                    <span class="card-rating">${renderStars(product.avaliacao)} ${product.avaliacao}</span>
                    <span class="card-sold"><i class="fa-solid fa-bag-shopping"></i> ${formatSold(product.vendidos)} vendidos</span>
                </div>
                <div class="card-pricing">
                    <span class="price-current">${formatPrice(product.precoAtual)}</span>
                    ${product.precoOriginal > product.precoAtual ? `<span class="price-original">${formatPrice(product.precoOriginal)}</span>` : ''}
                </div>
            </div>
            <div class="card-buttons">
                ${buttonsHTML}
            </div>
        `;

        productList.appendChild(card);
    });
}

// === FILTRO + BUSCA + SORT ===
function getFilteredProducts() {
    let list = [...produtos];

    // Filtro categoria
    if (currentFilter !== 'todos') {
        list = list.filter(p => p.categoria === currentFilter);
    }

    // Busca
    if (currentSearch) {
        const term = currentSearch.toLowerCase();
        list = list.filter(p =>
            p.nome.toLowerCase().includes(term) ||
            p.codigo.includes(term) ||
            p.descricao.toLowerCase().includes(term) ||
            (categoriaLabels[p.categoria] || '').toLowerCase().includes(term)
        );
    }

    // Sort
    const sort = sortSelect.value;
    if (sort === 'menor-preco') {
        list.sort((a, b) => a.precoAtual - b.precoAtual);
    } else if (sort === 'maior-desconto') {
        list.sort((a, b) => {
            const dA = calcDiscount(a.precoOriginal, a.precoAtual);
            const dB = calcDiscount(b.precoOriginal, b.precoAtual);
            return dB - dA;
        });
    } else if (sort === 'mais-vendidos') {
        list.sort((a, b) => b.vendidos - a.vendidos);
    }

    return list;
}

function refresh() {
    renderProducts(getFilteredProducts());
}

// === EVENT LISTENERS ===
searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value;
    refresh();
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchInput.value = '';
        currentSearch = '';
        refresh();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        refresh();
    });
});

sortSelect.addEventListener('change', refresh);

// === INIT ===
refresh();

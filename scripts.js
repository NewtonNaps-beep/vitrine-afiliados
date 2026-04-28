import produtos from './produtos.js';

const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');

function renderProducts(filteredProducts) {
    productList.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p style="text-align:center; color: #BDBDBD; margin-top: 20px; grid-column: 1 / -1;">Nenhum produto encontrado.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let badgeHTML = '';
        if (product.badge) {
            let badgeClass = 'badge-default';
            if (product.badge.toLowerCase() === 'oferta') badgeClass = 'badge-oferta';
            if (product.badge.toLowerCase() === 'novo') badgeClass = 'badge-novo';
            if (product.badge.toLowerCase() === 'mais vendido') badgeClass = 'badge-vendido';
            badgeHTML = `<span class="badge ${badgeClass}">${product.badge}</span>`;
        }
        
        card.innerHTML = `
            <div class="product-image-container" style="--bg-image: url('${product.imagem}')">
                ${badgeHTML}
                <img src="${product.imagem}" alt="${product.nome}" class="product-image">
            </div>
            <div class="product-info">
                <div class="product-header">
                    <span class="product-code">Cód. ${product.codigo}</span>
                </div>
                <h2 class="product-title">${product.nome}</h2>
                <p class="product-description">${product.descricao}</p>
                <div class="product-price">${product.preco}</div>
                <div class="marketplace-buttons">
                    ${product.linkShopee ? `<a href="${product.linkShopee}" target="_blank" class="btn btn-shopee" title="Comprar na Shopee"><i class="fa-solid fa-cart-shopping"></i> Shopee</a>` : ''}
                    ${product.linkAmazon ? `<a href="${product.linkAmazon}" target="_blank" class="btn btn-amazon" title="Comprar na Amazon"><i class="fa-brands fa-amazon"></i> Amazon</a>` : ''}
                    ${product.linkMercadoLivre ? `<a href="${product.linkMercadoLivre}" target="_blank" class="btn btn-ml" title="Comprar no Mercado Livre"><i class="fa-solid fa-handshake"></i> M. Livre</a>` : ''}
                </div>
            </div>
        `;
        
        productList.appendChild(card);
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = produtos.filter(product => {
        return product.nome.toLowerCase().includes(searchTerm) || 
               product.codigo.toLowerCase().includes(searchTerm) ||
               (product.descricao && product.descricao.toLowerCase().includes(searchTerm));
    });
    
    renderProducts(filtered);
}

// Inicializar
renderProducts(produtos);

// Event Listener para Busca
searchInput.addEventListener('input', handleSearch);
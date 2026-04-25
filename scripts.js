import produtos from './produtos.js';

const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');

function renderProducts(filteredProducts) {
    productList.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p style="text-align:center; color: #BDBDBD; margin-top: 20px;">Nenhum produto encontrado.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}" class="product-image">
            <div class="product-info">
                <p class="product-title"><span class="product-code">Cod ${product.codigo}</span> - ${product.nome}</p>
                <div class="marketplace-buttons">
                    ${product.linkShopee ? `<a href="${product.linkShopee}" target="_blank" class="btn btn-shopee">Shopee</a>` : ''}
                    ${product.linkAmazon ? `<a href="${product.linkAmazon}" target="_blank" class="btn btn-amazon">Amazon</a>` : ''}
                    ${product.linkMercadoLivre ? `<a href="${product.linkMercadoLivre}" target="_blank" class="btn btn-ml">M. Livre</a>` : ''}
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
               product.codigo.toLowerCase().includes(searchTerm);
    });
    
    renderProducts(filtered);
}

// Inicializar
renderProducts(produtos);

// Event Listener para Busca
searchInput.addEventListener('input', handleSearch);

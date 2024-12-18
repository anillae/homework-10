let currentPage = 1;           // Текущая страница
const productsPerPage = 4;     // Количество продуктов на странице
let allProducts = [];          // Все загруженные товары
let filteredProducts = [];     // Отфильтрованные товары

// Отрисовка товаров
function renderProducts(data, append = false) {
    const container = document.querySelector(".bestseller_conteiner");

    if (!append) container.innerHTML = '';  // Очистка контейнера

    if (data.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }

    data.forEach(product => {
        const picture = document.createElement('picture');
        picture.classList.add("bag");
        picture.id = `product-${product.id}`;

        const link = document.createElement("a");
        link.href = "#";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = "bag";
        img.classList.add("cover");

        link.appendChild(img);

        const h4 = document.createElement("h4");
        h4.textContent = product.title;

        const p = document.createElement("p");
        p.textContent = product.description;

        const button = document.createElement('button');
        button.classList.add('delete_btn');
        button.textContent = "Delete Product";
        button.id = `delete-btn-${product.id}`;

        button.addEventListener('click', () => {
            deleteProduct(product.id);
        });

        picture.appendChild(link);
        picture.appendChild(h4);
        picture.appendChild(p);
        picture.appendChild(button);

        container.appendChild(picture);
    });
}

// Получение всех продуктов с API
async function fetchAllProducts() {
    try {
        const response = await fetch(`https://fakestoreapi.com/products`);
        if (!response.ok) throw new Error('Ошибка получения данных');

        allProducts = await response.json();  // Сохраняем все товары
        filteredProducts = [...allProducts];  // По умолчанию — все товары
        loadNextPage();
    } catch (error) {
        console.error('Ошибка в получении продуктов', error);
        alert('Не удалось загрузить товары!');
    }
}

// Добавление нового продукта
async function addNewProduct(event) {
    event.preventDefault();

    const nameProduct = document.querySelector('.name_product').value.trim();
    const priceProduct = parseFloat(document.querySelector('.price_product').value);
    const descriptionProduct = document.querySelector('.description_product').value.trim();
    const categoriesProduct = document.querySelector('.categories_product').value;

    if (!nameProduct || isNaN(priceProduct) || !descriptionProduct || categoriesProduct === 'categories') {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    const newProduct = {
        title: nameProduct,
        price: priceProduct,
        description: descriptionProduct,
        image: 'https://i.pravatar.cc',
        category: categoriesProduct,
    };

    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) throw new Error('Ошибка добавления продукта');

        const result = await response.json();
        console.log('Продукт добавлен:', result);
        alert('Продукт успешно добавлен!');
        getAllProducts();  // Обновление списка товаров

    } catch (error) {
        console.error('Ошибка в добавлении продукта', error);
        alert('Не удалось добавить продукт!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('.add_btn');
    addBtn.addEventListener('click', addNewProduct);
});


// Загрузка следующей страницы
function loadNextPage() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = currentPage * productsPerPage;
    const nextProducts = filteredProducts.slice(startIndex, endIndex);

    renderProducts(nextProducts, true);

    if (endIndex >= filteredProducts.length) {
        document.querySelector('.load_more').style.display = 'none';
    } else {
        document.querySelector('.load_more').style.display = 'block';
        currentPage++;  // Увеличиваем текущую страницу
    }
}

// Обработчик фильтрации
function filterProducts() {
    const filterValue = document.querySelector('.filter_product').value;

    if (filterValue === 'all') {
        filteredProducts = [...allProducts];  // Все товары
    } else {
        filteredProducts = allProducts.filter(product => product.category === filterValue);
    }

    currentPage = 1;  // Сбрасываем страницу
    renderProducts(filteredProducts.slice(0, productsPerPage));  // Показываем отфильтрованные товары

    // Показываем кнопку "Загрузить ещё", если товаров больше, чем на первой странице
    if (productsPerPage < filteredProducts.length) {
        document.querySelector('.load_more').style.display = 'block';
    } else {
        document.querySelector('.load_more').style.display = 'none';
    }
}

// Удаление продукта
async function deleteProduct(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error('Ошибка удаления продукта');

        console.log('Продукт удален');
        alert('Продукт успешно удален!');

        const productElement = document.querySelector(`#product-${productId}`);
        if (productElement) productElement.remove();
    } catch (error) {
        console.error('Ошибка в удалении продукта', error);
        alert('Не удалось удалить продукт!');
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', fetchAllProducts);
document.querySelector('.load_more').addEventListener('click', loadNextPage);
document.querySelector('.filter_product').addEventListener('change', filterProducts);

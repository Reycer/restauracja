// FUNKCJA POKAŻ/UKRYJ FORMULARZ
function showHide() {
    var x = document.getElementById("form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}



// ZDEFINIOWANIE KLASY PRODUKTU
class Product {
    constructor(photo, name, type, price) {
        this.photo = photo;
        this.name = name;
        this.type = type;
        this.price = price;
    }
}

// KLASA INTERFEJSU
class UI {

    // FUNKCJA DO WYŚWIETLANIA PRODUKTÓW W TABELI
    static displayProducts() {
        const StoredProducts = [{
                photo: "https://d1uz88p17r663j.cloudfront.net/resized/2020_07_09T14_20_47_image.ashx_zdjecie_1500_700.jpg_fileID_229522",
                name: "Placek po węgiersku",
                type: 'Obiad',
                price: 27
            },
            {
                photo: "Gulasz po http://i.wpimg.pl/1920x0/portal-abczdrowie.wpcdn.pl/imageCache/2018/11/26/18708295-m_ecee.jpg",
                name: "Jajecznica",
                type: "Śniadanie",
                price: 15
            },
        ];

        let products = Store.getProducts();
        //const products = StoredProducts;

        products.forEach((product) => UI.addProductToList(product));

        //console.log(products);
    }

    // FUNKCJA DO DODAWANIA PRODUKTÓW DO TABELI
    static addProductToList(product) {
        const list = document.querySelector('#product-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td><img src="${product.photo}" width = "300px;" height="200px;"</td>
            <td style="text-align: left; vertical-align: middle; font-size: 16px;">${product.name}</td>
            <td style="text-align: left; vertical-align: middle; font-size: 16px;">${product.type}</td>
            <td style="text-align: left; vertical-align: middle; font-size: 16px;">${product.price}</td>
            <td style="text-align: left; vertical-align: middle;"><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        //<td style="text-align: left; vertical-align: middle;"><a onClick="onEdit(this)" class="btn btn-success btn-sm edit"><i class="far fa-edit" style="pointer-events: none;"></i></a></td>

        list.appendChild(row);
    }

    // FUNKCJA DO CZYSZCZENIA PÓL FORMULARZA PO DODANIU PRODUKTU
    static clearFields() {
        document.querySelector('#photo').value = '';
        document.querySelector('#name').value = '';
        document.querySelector('#type').value = '';
        document.querySelector('#price').value = '';
    }

    // FUNKCJA DO USUWANIA PRODUKTÓW Z TABELI
    static deleteProduct(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // FUNKCJA DO POKAZYWANIA ALERTÓW
    static showAlerts(message, className) {
        // TWOROZENIE DIV ALERTU
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        // DODAWANIE INFORMACJI DO DIV
        div.appendChild(document.createTextNode(message));
        // DODAWANIE DIV DO DOM
        const container = document.querySelector('.container');
        const form = document.querySelector('#form');
        container.insertBefore(div, form);

        // ZNIKANIE ALERTU PO 3 SEKUNDACH
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }


}

// KLASA PRZECHOWYWANIA : LOCAL STORAGE
class Store {
    static getProducts() {
        let products;
        if (localStorage.getItem('products') === null) {
            products = [];
        } else {
            products = JSON.parse(localStorage.getItem('products'));
        }

        return products;
    }

    static saveProduct(product) {
        let products;
        products = Store.getProducts();
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }

    static removeProduct(price) {
        const products = Store.getProducts();

        products.forEach((product, index) => {
            if (product.price === price) {
                products.splice(index, 1);
            }
        });

        localStorage.setItem('products', JSON.stringify(products));
    }
}

// WYŚWIETL PRODUKTY
document.addEventListener('DOMContentLoaded', UI.displayProducts);

// EDYTOWANIE PRODUKTÓW // NIESTETY NIE SKOŃCZYŁEM I NIE DZIAŁA JAK NALEŻY

//function onEdit(td) {
//    selectedRow = td.parentElement.parentElement;
//    document.getElementById('photo').value = selectedRow.cells[0].innerHTML;
//   document.getElementById('name').value = selectedRow.cells[1].innerHTML;
//    document.getElementById('type').value = selectedRow.cells[2].innerHTML;
//    document.getElementById('price').value = selectedRow.cells[3].innerHTML;
//}




// DODAJ PRODUKT DO LISTY
document.querySelector('#product-form').addEventListener('submit', (e) => {

    // DODATKOWE ZABEZPIECZENIE PRZY URUCHOMIENIU PRZYCISKU SUBMIT
    e.preventDefault();

    // POBIERZ WARTOŚCI
    const photo = document.querySelector('#photo').value;
    const name = document.querySelector('#name').value;
    const type = document.querySelector('#type').value;
    const price = document.querySelector('#price').value;


    if (photo === '' || name === '' || price === '') {
        UI.showAlerts('Proszę wypełnić wszystkie pola', 'danger');
    } else {

        // UTWÓRZ OBIEKT KLASY PRODUCT
        const product = new Product(photo, name, type, price);


        // DODAJ PRODUKT DO LISTY
        UI.addProductToList(product);

        // ZAPISZ PRODUKT W LOCAL STORAGE
        Store.saveProduct(product);

        // POKAŻ KOMUNIKAT O SUKCESIE PRZY DODAWANIU PRODUKTU
        UI.showAlerts('Produkt dodany', 'success');

        // WYCZYŚĆ POLA FORMULARZA
        UI.clearFields();
    }
});

// USUŃ PRODUKT
document.querySelector('#product-list').addEventListener('click', (e) => {
    UI.deleteProduct(e.target);

    Store.removeProduct(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlerts('Produkt usunięty', 'success');



});
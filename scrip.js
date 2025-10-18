const carrito = document.getElementById('carrito');
const listaProductos = document.getElementById('lista-1');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
let articulosCarrito = [];

// === Listeners ===
cargarEventListeners();

function cargarEventListeners() {
    // Cuando agregas un producto presionando 'Agregar al carrito'
    listaProductos.addEventListener('click', agregarProducto);

    // Elimina productos del carrito
    carrito.addEventListener('click', eliminarProducto);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        // Reinicia el array
        articulosCarrito = [];
        limpiarHTML(); // Elimina todo el HTML
        sincronizarStorage(); // Actualiza localStorage a vacío
    });

    // Cargar productos de localStorage al iniciar la página
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });
}

// === Funciones ===

function agregarProducto(e) {
    // Previene el comportamiento por defecto del enlace '#'
    e.preventDefault(); 
    
    // Verifica si el elemento clickeado tiene la clase 'agregar-carrito'
    if (e.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
    }
}

function eliminarProducto(e) {
    // Verifica si el elemento clickeado tiene la clase 'borrar'
    if (e.target.classList.contains('borrar')) {
        const productoId = e.target.getAttribute('data-id');

        // Elimina del array de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHTML(); // Vuelve a iterar sobre el carrito y muestra su HTML
    }
}


// Lee el contenido del HTML al que le dimos click y extrae la información del producto
function leerDatosProducto(producto) {
    // Crear un objeto con el contenido del producto actual
    const infoProducto = {
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h3').textContent,
        precio: producto.querySelector('.precio').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        // Actualizamos la cantidad
        articulosCarrito = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto; // Retorna el objeto actualizado
            } else {
                return producto; // Retorna los objetos que no son duplicados
            }
        });
    } else {
        // Agregamos el producto al carrito
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML previo
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach(producto => {
        const { imagen, titulo, precio, cantidad, id } = producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar" data-id="${id}">X</a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Sincronizar con localStorage
    sincronizarStorage();
}

// Limpia el HTML del carrito
function limpiarHTML() {
    // Forma más rápida para limpiar el contenido
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Sincroniza el array del carrito con localStorage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}
// Selección de elementos principales
const btnAdd = document.getElementById("btnAdd");
const formContainer = document.getElementById("formulariodiv");//aqui aparecera el formulario dinamico
const catalogo = document.getElementById("catalogo");//aqui se mostraran los productos creados


// Mostrar el formulario al pulsar el botón
btnAdd.addEventListener("click", generarFormulario);


// Crear formulario dinámico
function generarFormulario() {

    formContainer.innerHTML = `
        <h3>Nuevo producto</h3>

        <form id="formProducto">

            <label>ID Producto:</label>
            <input type="text" id="idProd">
            <div id="errId" class="errorCampo"></div>

            <label>Nombre:</label>
            <input type="text" id="nombreProd">
            <div id="errNombre" class="errorCampo"></div>

            <label>Descripción:</label>
            <input type="text" id="descProd">
            <div id="errDesc" class="errorCampo"></div>

            <label>Precio:</label>
            <input type="number" id="precioProd" min="0" step="0.01">
            <div id="errPrecio" class="errorCampo"></div>

            <label>Imagen (archivo):</label>
            <input type="file" id="imagenProd" accept="image/*">
            <div id="errImagen" class="errorCampo"></div>
            <button type="submit">Crear</button>
        </form>`;

    formContainer.classList.remove("oculto");//borra lo oculto que es para css

    document.getElementById("formProducto")
        .addEventListener("submit", crearProducto);//llama la funcion crear producto cuando escucha el boton crear de linea 38
}//generar formulario

let num = 1;//es para controlar la imagen
// Validación y creación del producto
function crearProducto(e) {
    e.preventDefault();//esto evita que recargue la pagina para que no se borre nada

    // Lee campos del formulario dinamico
    const id = document.getElementById("idProd");
    const nombre = document.getElementById("nombreProd");
    const desc = document.getElementById("descProd");
    const precio = document.getElementById("precioProd");
    const imagen = document.getElementById("imagenProd"); 

    let valido = true;//booleano que controla los errores

    // Validad todos los datos
    if (id.value.trim() === "") {
        document.getElementById("errId").textContent = "El ID es obligatorio.";
        id.classList.add("error");//añade class para darle color con css
        valido = false;
    }
    const existe = Array.from(catalogo.querySelectorAll(".producto"))// Comprobar si el ID ya existe
                    .some(prod => prod.dataset.id === id.value);

    if (existe) {
        document.getElementById("errId").textContent = "Este ID ya existe.";
        id.classList.add("error");//llama a input.error de css
        valido = false;
    }
    if (nombre.value.trim() === "") {
        document.getElementById("errNombre").textContent = "El nombre es obligatorio.";
        nombre.classList.add("error");
        valido = false;
    }
    if (desc.value.trim() === "") {
        document.getElementById("errDesc").textContent = "La descripción es obligatoria.";
        desc.classList.add("error");
        valido = false;
    }
    if (precio.value === "" || precio.value <= 0) {
        document.getElementById("errPrecio").textContent = "Precio inválido.";
        precio.classList.add("error");
        valido = false;
    }
    if (imagen.value.trim() === "") {
        document.getElementById("errImagen").textContent = "Selecciona un archivo de imagen.";
        imagen.classList.add("error");
        valido = false;
    }
    if (!valido) return;  // Si falla, no sigue


    // crear tarjeta del producto
    const div = document.createElement("div");//crea un div vacio
    div.classList.add("producto");//asina la clase para aplicar css
    div.dataset.id = id.value;

    // Leer archivo seleccionado de la imagen
    const archivo = document.getElementById("imagenProd").files[0];
    if (archivo) {
    const imagenURL = URL.createObjectURL(archivo); // crea URL temporal
    div.innerHTML =
        "<img src='" + imagenURL + "' alt='" + nombre.value + "'>" +
        "<p><strong>" + nombre.value + "</strong></p>";
}



    // Evento de clic  Mostrar detalles
    div.querySelector("img").addEventListener("click", () => { //cuando escucha clic en la imagen
        mostrarDetalles(div, id.value, nombre.value, desc.value, precio.value); //llama a la funcion mostrar detalles pasandole todos los parametros
    });

    catalogo.appendChild(div); //inserta el producto al final del catalogo
    

    // OCULTAR FORMULARIO
    formContainer.classList.add("oculto");//vuelve a ocultar el formulario
    formContainer.innerHTML = ""; // y limpia los campos
}//crear producto


// Mostrar detalles del producto
function mostrarDetalles(contenedor, id, nombre, desc, precio) {

    const nuevo = document.createElement("div");
    nuevo.classList.add("detalles");

    nuevo.innerHTML =
        "<strong>ID:</strong> " + id + "<br>" +
        "<strong>Nombre:</strong> " + nombre + "<br>" +
        "<strong>Precio:</strong> " + precio + " €<br>" +
        "<strong>Descripción:</strong> " + desc;

    //ocultar detalles al hacer doble clic
    nuevo.addEventListener("dblclick", function () {
        nuevo.remove();  // elimina el cuadro de detalles
    });

    contenedor.appendChild(nuevo);
}//mostrar detalles


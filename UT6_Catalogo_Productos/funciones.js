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

// Validación y creación del producto
function crearProducto(e) {
    e.preventDefault();//esto evita que recargue la pagina para que no se borre nada

    // Lee campos del formulario dinamico
    const id = document.getElementById("idProd");
    const nombre = document.getElementById("nombreProd");
    const desc = document.getElementById("descProd");
    const precio = document.getElementById("precioProd");
    const imagen = document.getElementById("imagenProd");

    const btnCrear = e.target.querySelector("button");//capto el boton crear del formulario

    let valido = true;//booleano que controla los errores

    // Validad todos los datos
    if (id.value.trim() === "") {
        document.getElementById("errId").textContent = "El ID es obligatorio.";
        id.classList.add("error");//añade class para darle color con css
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

    const producto = {
        id: id.value,
        nombre: nombre.value,
        desc: desc.value,
        precio: precio.value
    };

    const archivo = imagen.files[0]; //
    btnCrear.disabled = true; //aqui cambio el estado del boton
    btnCrear.textContent = "Guardando...";// y le asigno el texto

    validarImagen(archivo)            // Primero valida la imagen
        .then(() => {
            return API.guardarProducto(producto);   //Devuelve la promesa de API
        })
        .then(msg => {
            console.log(msg);// Guardado correcto, mensaje del servidor
            crearTarjeta(producto, archivo);
            actualizarTotalProductos();
            cerrarFormulario();
        })
        .catch(err => {
            //Cualquier error (imagen inválida o ID duplicado)
            document.getElementById("errId").textContent = err;
            id.classList.add("error");
        })
        .finally(() => {
            // en cualquier caso restauramos el botón
            btnCrear.disabled = false;
            btnCrear.textContent = "Crear";
        });

}//crear producto

function crearTarjeta(producto, archivoImagen) {

    const div = document.createElement("div");// Crear el contenedor del producto
    div.classList.add("producto"); //añade la clase para dar estilos
    div.dataset.id = producto.id; //genera data-id en html, dataset permite añadir atributos personalizados
    const imagenURL = URL.createObjectURL(archivoImagen);// Crear url temporal de la imagen

    div.innerHTML = `<img src="${imagenURL}" alt="${producto.nombre}">
                    <p><strong>${producto.nombre}</strong></p>
                    <button class="btnEliminar">Eliminar</button>`;

    div.querySelector("img").addEventListener("click", () => {// Evento de clic: mostrar detalles
        mostrarDetalles(div, producto.id, producto.nombre, producto.desc, producto.precio);
    });

    div.querySelector(".btnEliminar").addEventListener("click", () => {// Evento para eliminar producto
        eliminarProducto(div, producto.id);
    });

    catalogo.appendChild(div);// Añadir tarjeta al catálogo
}

async function eliminarProducto(tarjeta, id) {
    tarjeta.style.opacity = "0.5";   //cambio de opacidad

    try {
        const msg = await API.borrarProducto(id);//borrarProducto devuelve una promesa poreso uso await, el código se detiene hasta que la api responda
        console.log(msg);  //si la api resuelva
        tarjeta.remove(); //elimina la tarjeta
        actualizarTotalProductos(); //actualiza el contador

    } catch (err) {

        alert(err);  // si la api respode con error
        tarjeta.style.opacity = "1"; // en caso de error la tarjeta vuelve a tener su opcidad normal
    }
}

// Validar imagen
function validarImagen(archivo) {

    return new Promise((valido, error) => {// de si la imagen carga bien  o falla

        const img = new Image();
        const url = URL.createObjectURL(archivo);// Convierto el archivo seleccionado en url, en realidad es la ruta del archivo

        img.onload = () => { // si todo esta bien, la promesa da ok
            valido("Imagen válida");
        };
        img.onerror = () => { //si la imagen falla al cargar entra en esta condición
            error("La imagen no es válida o está dañada");
        };
        img.src = url;// intenta cargar la imagen y pueden ocurrir dos cosas, onload o enerror
    });
}

function actualizarTotalProductos() {//actualiza el contador de productos
    let total = catalogo.querySelectorAll(".producto").length;
    document.getElementById("contadorProd").textContent = total;
}//actualizarTotalProductos

function cerrarFormulario() {
    formContainer.classList.add("oculto"); // oculta el formulario dinámico
    formContainer.innerHTML = "";          // vacía el contenido
}

// Mostrar detalles del producto
function mostrarDetalles(contenedor, id, nombre, desc, precio) {

    //primero elimina si ya existe
    const anterior = contenedor.querySelector(".detalles");
    if (anterior) anterior.remove();

    const nuevo = document.createElement("div");
    nuevo.classList.add("detalles");

    nuevo.innerHTML =
        "<strong>ID:</strong> " + id + "<br>" +
        "<strong>Nombre:</strong> " + nombre + "<br>" +
        "<strong>Precio:</strong> " + precio + " €<br>" +
        "<strong>Descripción:</strong> " + desc;

    nuevo.addEventListener("dblclick", function () {
        nuevo.remove();  // elimina el cuadro de detalles si haces dobleclick encima
    });

    contenedor.appendChild(nuevo);
}//mostrar detalles

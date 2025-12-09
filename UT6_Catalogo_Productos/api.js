//aqui creo la api falsa que simula ser un servidor
const API = (() => {

    const baseDatos = [];//es el array que simula base de datos

    return {
//guarda el producto, 2segundos
        guardarProducto(producto) {
            return new Promise((correcto, error) => {//creamos la promesa con sus parámetros de acceptacion o rechazo
                console.log("API: Recibido producto. Validando...");
                setTimeout(() => {
                    const existe = baseDatos.some(p => p.id === producto.id);//comprueba si existe el id en el array de base de datos, devuelve true o false
                    if (existe) { //si es true
                        error("Error: El ID ya existe en el servidor.");
                        return;//y termina la ejecución, no sigue
                    }
                    baseDatos.push(producto);//si no entra en if, agrega el producto
                    correcto("Producto guardado correctamente");
                }, 2000); // 2 segundos de retraso simulado
            });
        },


        // borrar producto(1.5 segundos)
        borrarProducto(id) {
            return new Promise((correcto, error) => {
                console.log("API: Solicitado borrado del producto", id);
                setTimeout(() => {                 
                    if (Math.random() < 0.10) {// Simular error aleatorio del 10%
                        error("Error del servidor: No se pudo borrar el producto.");
                        return;}
                    // Buscar producto
                    const num = baseDatos.findIndex(p => p.id === id);//busca el id del producto

                    if (num === -1) {//si no encuentra nada
                        error("Error: El producto no existe en el servidor.");
                        return;
                    }

                    // Borrar producto
                    baseDatos.splice(num, 1);
                    correcto("Producto eliminado");
                }, 1500); // retraso de 1.5 segundos
            });
        }

    };
})();

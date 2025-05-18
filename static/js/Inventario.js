window.addEventListener('DOMContentLoaded', function () {
    cargarProductos();
});

function cargarProductos() {
    Promise.all([
        fetch('/productos').then(res => res.json())
    ]).then(([productos]) => {
        const lista = document.getElementById('lista-productos');
        if (!lista) return;
        lista.innerHTML = '';
        // Aplicar estilos de grid al contenedor
        lista.style.display = 'grid';
        lista.style.gridTemplateColumns = 'repeat(4, 1fr)';
        lista.style.gap = '2em';
        lista.style.justifyItems = 'center';
        if (Array.isArray(productos) && productos.length > 0) {
            productos.forEach(prod => {
                const li = document.createElement('li');
                li.style.background = '#f6fcf7';
                li.style.color = '#222';
                li.style.borderRadius = '18px';
                li.style.padding = '1.5em 1.2em 1.2em 1.2em';
                li.style.marginBottom = '1.5em';
                li.style.boxShadow = '0 2px 12px #18284833';
                li.style.display = 'flex';
                li.style.flexDirection = 'column';
                li.style.alignItems = 'center';
                li.style.maxWidth = '320px';
                li.style.width = '100%';
                // Imagen de producto (por ahora, "Sin imagen")
                const img = document.createElement('div');
                img.style.width = '180px';
                img.style.height = '180px';
                img.style.background = '#bbb';
                img.style.borderRadius = '16px';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.style.fontSize = '1.2em';
                img.style.color = '#555';
                img.style.marginBottom = '1em';
                img.innerText = 'Sin imagen';
                li.appendChild(img);
                // Info del producto (sin descripción)
                const info = document.createElement('div');
                info.style.textAlign = 'center';
                info.innerHTML = `
                    <strong style="font-size:1.2em;color:#182848;">${prod.nombre}</strong><br>
                    <span style="color:#43aa8b;font-weight:bold;">Precio: $${Number(prod.precio).toLocaleString('es-CL')}</span>
                `;
                li.appendChild(info);
                // Botón Mostrar descripción
                const btnMostrar = document.createElement('button');
                btnMostrar.innerText = 'Mostrar más';
                btnMostrar.style.marginTop = '1.2em';
                btnMostrar.style.background = '#457b9d';
                btnMostrar.style.color = '#fff';
                btnMostrar.style.border = 'none';
                btnMostrar.style.borderRadius = '8px';
                btnMostrar.style.padding = '0.7em 1.5em';
                btnMostrar.style.fontWeight = 'bold';
                btnMostrar.style.fontSize = '1em';
                btnMostrar.style.cursor = 'pointer';
                btnMostrar.style.transition = 'background 0.2s';
                btnMostrar.onmouseover = function() { btnMostrar.style.background = '#274472'; };
                btnMostrar.onmouseout = function() { btnMostrar.style.background = '#457b9d'; };
                li.appendChild(btnMostrar);
                // Modal oculto
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.background = 'rgba(24,40,72,0.75)';
                modal.style.display = 'none';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '9999';
                modal.style.cursor = 'pointer';
                // Cerrar modal al hacer clic fuera del cuadro
                modal.onclick = function(e) {
                    if (e.target === modal) {
                        modal.style.display = 'none';
                        sucursal.style.display = 'none';
                        btnsRow.style.display = 'none';
                        textoMas.innerText = 'más';
                        desplegado = false;
                        inputCantidad.value = '1'; // Reinicia cantidad al cerrar modal
                    }
                };
                // Contenido del modal
                const modalCard = document.createElement('div');
                modalCard.style.background = '#f6fcf7';
                modalCard.style.borderRadius = '32px';
                modalCard.style.padding = '3.5em 2.5em 2.5em 2.5em';
                modalCard.style.boxShadow = '0 8px 48px #18284888';
                modalCard.style.display = 'flex';
                modalCard.style.flexDirection = 'column';
                modalCard.style.alignItems = 'center';
                modalCard.style.maxWidth = '700px';
                modalCard.style.width = '98vw';
                modalCard.style.cursor = 'default';
                // Imagen grande (más grande)
                const imgModal = document.createElement('div');
                imgModal.style.width = '420px';
                imgModal.style.height = '420px';
                imgModal.style.background = '#bbb';
                imgModal.style.borderRadius = '28px';
                imgModal.style.display = 'flex';
                imgModal.style.alignItems = 'center';
                imgModal.style.justifyContent = 'center';
                imgModal.style.fontSize = '2em';
                imgModal.style.color = '#555';
                imgModal.style.marginBottom = '1.5em';
                imgModal.innerText = 'Sin imagen';
                modalCard.appendChild(imgModal);
                // Nombre grande
                const nombreModal = document.createElement('div');
                nombreModal.innerText = prod.nombre;
                nombreModal.style.fontSize = '2.3em';
                nombreModal.style.fontWeight = 'bold';
                nombreModal.style.color = '#182848';
                nombreModal.style.marginBottom = '0.7em';
                nombreModal.style.textAlign = 'center';
                modalCard.appendChild(nombreModal);
                // Precio centrado
                const precioModal = document.createElement('div');
                precioModal.innerHTML = `<span style="color:#43aa8b;font-weight:bold;font-size:1.5em;">Precio: $${Number(prod.precio).toLocaleString('es-CL')}</span>`;
                precioModal.style.textAlign = 'center';
                precioModal.style.margin = '0 0 0.7em 0';
                modalCard.appendChild(precioModal);
                // Cantidad debajo del precio y arriba del botón Agregar
                const cantidadRow = document.createElement('div');
                cantidadRow.style.display = 'flex';
                cantidadRow.style.alignItems = 'center';
                cantidadRow.style.justifyContent = 'center';
                cantidadRow.style.gap = '0.7em';
                cantidadRow.style.marginBottom = '1.2em';
                const labelCantidad = document.createElement('label');
                labelCantidad.innerText = 'Cantidad:';
                labelCantidad.style.fontWeight = 'bold';
                labelCantidad.style.color = '#457b9d';
                labelCantidad.style.fontSize = '1.1em';
                const inputCantidad = document.createElement('input');
                inputCantidad.type = 'number';
                inputCantidad.min = '1';
                inputCantidad.value = '1';
                inputCantidad.style.width = '60px';
                inputCantidad.style.fontSize = '1.1em';
                inputCantidad.style.padding = '0.3em 0.5em';
                inputCantidad.style.borderRadius = '6px';
                inputCantidad.style.border = '1px solid #b0c4de';
                cantidadRow.appendChild(labelCantidad);
                cantidadRow.appendChild(inputCantidad);
                modalCard.appendChild(cantidadRow);
                // Botón Agregar debajo de cantidad
                const btnCarrito = document.createElement('button');
                btnCarrito.innerText = 'Agregar';
                btnCarrito.style.background = '#43aa8b';
                btnCarrito.style.color = '#fff';
                btnCarrito.style.border = 'none';
                btnCarrito.style.borderRadius = '8px';
                btnCarrito.style.padding = '0.7em 1.5em';
                btnCarrito.style.fontWeight = 'bold';
                btnCarrito.style.fontSize = '1.1em';
                btnCarrito.style.cursor = 'pointer';
                btnCarrito.style.transition = 'background 0.2s';
                btnCarrito.style.display = 'block';
                btnCarrito.style.margin = '0 auto 1.2em auto';
                btnCarrito.onmouseover = function() { btnCarrito.style.background = '#2d6a53'; };
                btnCarrito.onmouseout = function() { btnCarrito.style.background = '#43aa8b'; };
                modalCard.appendChild(btnCarrito);
                // Texto 'más' subrayado, no botón, y 'menos' para cerrar
                const masRow = document.createElement('div');
                masRow.style.display = 'flex';
                masRow.style.flexDirection = 'column';
                masRow.style.alignItems = 'center';
                masRow.style.marginBottom = '1.5em';
                const textoMas = document.createElement('span');
                textoMas.innerText = 'más';
                textoMas.style.fontSize = '1.1em';
                textoMas.style.color = '#457b9d';
                textoMas.style.fontWeight = 'bold';
                textoMas.style.textDecoration = 'underline';
                textoMas.style.cursor = 'pointer';
                textoMas.style.marginBottom = '0.7em';
                masRow.appendChild(textoMas);
                modalCard.appendChild(masRow);
                // Sucursal y producto (oculto hasta presionar 'más')
                const sucursal = document.createElement('div');
                sucursal.innerHTML = `<span style="color:#457b9d;font-weight:bold;">Sucursal:</span> <span style="color:#222;">(por implementar)</span>`;
                sucursal.style.margin = '0 0 1.2em 0';
                sucursal.style.fontSize = '1.1em';
                sucursal.style.textAlign = 'center';
                sucursal.style.display = 'none';
                modalCard.appendChild(sucursal);
                // Botones Editar y Borrar (ocultos hasta presionar 'más', cambiados de lado)
                const btnsRow = document.createElement('div');
                btnsRow.style.display = 'flex';
                btnsRow.style.justifyContent = 'center';
                btnsRow.style.gap = '1em';
                btnsRow.style.marginTop = '2em';
                btnsRow.style.display = 'none';
                const btnEditar = document.createElement('button');
                btnEditar.innerText = 'Editar';
                btnEditar.style.background = '#f4a261';
                btnEditar.style.color = '#fff';
                btnEditar.style.border = 'none';
                btnEditar.style.borderRadius = '8px';
                btnEditar.style.padding = '0.7em 1.5em';
                btnEditar.style.fontWeight = 'bold';
                btnEditar.style.fontSize = '1em';
                btnEditar.style.cursor = 'pointer';
                btnEditar.style.transition = 'background 0.2s';
                btnEditar.onmouseover = function() { btnEditar.style.background = '#b97b3e'; };
                btnEditar.onmouseout = function() { btnEditar.style.background = '#f4a261'; };
                const btnBorrar = document.createElement('button');
                btnBorrar.innerText = 'Borrar';
                btnBorrar.style.background = '#e63946';
                btnBorrar.style.color = '#fff';
                btnBorrar.style.border = 'none';
                btnBorrar.style.borderRadius = '8px';
                btnBorrar.style.padding = '0.7em 1.5em';
                btnBorrar.style.fontWeight = 'bold';
                btnBorrar.style.fontSize = '1em';
                btnBorrar.style.cursor = 'pointer';
                btnBorrar.style.transition = 'background 0.2s';
                btnBorrar.onmouseover = function() { btnBorrar.style.background = '#b2182b'; };
                btnBorrar.onmouseout = function() { btnBorrar.style.background = '#e63946'; };
                btnsRow.appendChild(btnEditar);
                btnsRow.appendChild(btnBorrar);
                modalCard.appendChild(btnsRow);
                // Estado del desplegable
                let desplegado = false;
                textoMas.onclick = function() {
                    if (!desplegado) {
                        sucursal.style.display = 'block';
                        btnsRow.style.display = 'flex';
                        textoMas.innerText = 'menos';
                        desplegado = true;
                    } else {
                        sucursal.style.display = 'none';
                        btnsRow.style.display = 'none';
                        textoMas.innerText = 'más';
                        desplegado = false;
                        inputCantidad.value = '1'; // Reinicia cantidad
                    }
                };
                modal.appendChild(modalCard);
                document.body.appendChild(modal);
                btnMostrar.onclick = function() { modal.style.display = 'flex'; };
                li.appendChild(btnMostrar);
                lista.appendChild(li);
            });
        }
    });
}
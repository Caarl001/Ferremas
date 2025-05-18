window.addEventListener('DOMContentLoaded', function () {
    cargarProductos();
    // Llenar selects de categoría y proveedor
    fetch('/categorias').then(res => res.json()).then(categorias => {
        const selectCat = document.getElementById('select-categoria');
        if (selectCat) {
            selectCat.innerHTML = '<option value="">Selecciona categoría</option>';
            categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.idCategoria;
                opt.textContent = cat.descripcion;
                selectCat.appendChild(opt);
            });
        }
    });
    fetch('/proveedores').then(res => res.json()).then(proveedores => {
        const selectProv = document.getElementById('select-proveedor');
        if (selectProv) {
            selectProv.innerHTML = '<option value="">Selecciona proveedor</option>';
            proveedores.forEach(prov => {
                const opt = document.createElement('option');
                opt.value = prov.idProveedor;
                opt.textContent = prov.nombre;
                selectProv.appendChild(opt);
            });
        }
    });
    // Lógica para el formulario de crear producto
    const form = document.getElementById('form-crear-producto');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = form.nombre.value.trim();
            const idCategoria = form['select-categoria'].value;
            const idProveedor = form['select-proveedor'].value;
            const precio = form.precio.value;
            const descripcion = form.descripcion.value.trim();
            const imagen = form.imagen.value; // Ahora es un select
            // cantidad, sucursales no funcionales
            const mensaje = document.getElementById('form-producto-mensaje');
            mensaje.style.display = 'none';
            // Validación básica
            if (!nombre || !idCategoria || !idProveedor || !precio || !descripcion) {
                mensaje.innerText = 'Completa todos los campos obligatorios.';
                mensaje.style.display = 'block';
                return;
            }
            // Enviar al backend (ahora incluye imagen)
            fetch('/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    idCategoria: Number(idCategoria),
                    idProveedor: Number(idProveedor),
                    precio: Number(precio),
                    descripcion,
                    imagen: imagen || null
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error && data.producto_existente) {
                    mensaje.innerHTML = `Este producto ya está creado.<br>¿Quieres cambiar algo de este producto? <button id='btn-editar-existente' style='margin-left:1em;background:#f4a261;color:#fff;border:none;border-radius:8px;padding:0.4em 1.2em;font-weight:bold;cursor:pointer;'>Editar</button>`;
                    mensaje.style.display = 'block';
                    mensaje.style.color = '#e63946';
                    setTimeout(() => {
                        mensaje.style.display = 'none';
                        mensaje.style.color = '#e63946';
                    }, 5000);
                    setTimeout(() => {
                        const btnEditarExistente = document.getElementById('btn-editar-existente');
                        if (btnEditarExistente) {
                            btnEditarExistente.onclick = function() {
                                abrirModalEdicionProducto(data.producto_existente);
                            };
                        }
                    }, 100);
                } else if (data.error) {
                    mensaje.innerText = data.error;
                    mensaje.style.display = 'block';
                    mensaje.style.color = '#e63946';
                } else {
                    mensaje.innerText = '¡Producto creado exitosamente!';
                    mensaje.style.color = '#43aa8b';
                    mensaje.style.display = 'block';
                    form.reset();
                    cargarProductos();
                    setTimeout(() => { mensaje.style.display = 'none'; mensaje.style.color = '#e63946'; }, 1800);
                }
            })
            .catch(() => {
                mensaje.innerText = 'Error al crear el producto.';
                mensaje.style.display = 'block';
            });
        });
    }
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
                li.style.cursor = 'pointer';
                // Efecto de zoom leve al pasar el mouse sobre la tarjeta
                li.style.transition = 'transform 0.18s cubic-bezier(.4,1.2,.6,1)';
                li.onmouseover = function() { li.style.transform = 'scale(1.04)'; };
                li.onmouseout = function() { li.style.transform = 'scale(1)'; };
                // Imagen de producto (ahora muestra imagen real si existe)
                let img;
                if (prod.imagen) {
                    img = document.createElement('img');
                    img.src = prod.imagen;
                    img.alt = prod.nombre;
                    img.style.width = '180px';
                    img.style.height = '180px';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '16px';
                    img.style.marginBottom = '1em';
                    img.onerror = function() { img.style.display = 'none'; };
                } else {
                    img = document.createElement('div');
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
                }
                li.appendChild(img);
                // Info del producto (sin descripción)
                const info = document.createElement('div');
                info.style.textAlign = 'center';
                info.innerHTML = `
                    <strong style="font-size:1.2em;color:#182848;">${prod.nombre}</strong><br>
                    <span style="color:#43aa8b;font-weight:bold;">Precio: $${Number(prod.precio).toLocaleString('es-CL')}</span>
                `;
                li.appendChild(info);
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
                // Hacer que al hacer clic en toda la tarjeta (li) se abra el modal
                li.onclick = function(e) {
                    // Evitar que se dispare por botones internos
                    if (e.target === li || e.target === img || e.target === info) {
                        modal.style.display = 'flex';
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
                // Imagen grande (más grande, muestra imagen real si existe)
                let imgModal;
                if (prod.imagen) {
                    imgModal = document.createElement('img');
                    imgModal.src = prod.imagen;
                    imgModal.alt = prod.nombre;
                    imgModal.style.width = '420px';
                    imgModal.style.height = '420px';
                    imgModal.style.objectFit = 'cover';
                    imgModal.style.borderRadius = '28px';
                    imgModal.style.marginBottom = '1.5em';
                    imgModal.onerror = function() { imgModal.style.display = 'none'; };
                    // Al hacer clic en la imagen grande, mostrar modal de imagen aún más grande
                    imgModal.style.cursor = 'zoom-in';
                    imgModal.onclick = function(e) {
                        e.stopPropagation();
                        // Modal de imagen gigante
                        const modalImg = document.createElement('div');
                        modalImg.style.position = 'fixed';
                        modalImg.style.top = '0';
                        modalImg.style.left = '0';
                        modalImg.style.width = '100vw';
                        modalImg.style.height = '100vh';
                        modalImg.style.background = 'rgba(24,40,72,0.92)';
                        modalImg.style.display = 'flex';
                        modalImg.style.alignItems = 'center';
                        modalImg.style.justifyContent = 'center';
                        modalImg.style.zIndex = '10001';
                        modalImg.style.cursor = 'zoom-out';
                        // Imagen aún más grande
                        const imgBig = document.createElement('img');
                        imgBig.src = prod.imagen;
                        imgBig.alt = prod.nombre;
                        imgBig.style.maxWidth = '90vw';
                        imgBig.style.maxHeight = '90vh';
                        imgBig.style.borderRadius = '32px';
                        imgBig.style.boxShadow = '0 8px 48px #182848cc';
                        imgBig.style.background = '#fff';
                        imgBig.style.objectFit = 'contain';
                        modalImg.appendChild(imgBig);
                        // Cerrar al hacer clic fuera o en la imagen
                        modalImg.onclick = function() {
                            document.body.removeChild(modalImg);
                        };
                        imgBig.onclick = function(ev) {
                            ev.stopPropagation();
                            document.body.removeChild(modalImg);
                        };
                        document.body.appendChild(modalImg);
                    };
                } else {
                    imgModal = document.createElement('div');
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
                }
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
                // Descripción debajo del nombre
                const descModal = document.createElement('div');
                descModal.innerText = prod.descripcion || '';
                descModal.style.fontSize = '1.15em';
                descModal.style.color = '#274472';
                descModal.style.marginBottom = '0.7em';
                descModal.style.textAlign = 'center';
                modalCard.appendChild(descModal);
                // Categoría debajo de la descripción
                const categoriaModal = document.createElement('div');
                categoriaModal.innerHTML = `<span style='color:#457b9d;font-weight:bold;'>Categoría:</span> <span style='color:#222;'>${prod.categoria || '(sin categoría)'}</span>`;
                categoriaModal.style.textAlign = 'center';
                categoriaModal.style.fontSize = '1.1em';
                categoriaModal.style.margin = '0 0 1em 0';
                modalCard.appendChild(categoriaModal);
                // Cantidad debajo de categoría
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
                // Precio debajo de cantidad
                const precioModal = document.createElement('div');
                precioModal.innerHTML = `<span style="color:#43aa8b;font-weight:bold;font-size:1.5em;">Precio: $${Number(prod.precio).toLocaleString('es-CL')}</span>`;
                precioModal.style.textAlign = 'center';
                precioModal.style.margin = '0 0 0.7em 0';
                modalCard.appendChild(precioModal);
                // Botón Agregar debajo de precio
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
                btnBorrar.onclick = function(e) {
                    e.preventDefault();
                    fetch(`/productos/${prod.idProducto}`, {
                        method: 'DELETE'
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.mensaje) {
                            modal.style.display = 'none';
                            cargarProductos();
                        }
                    })
                    .catch(() => {});
                };
                // Funcionalidad editar producto
                btnEditar.onclick = function(e) {
                    e.preventDefault();
                    // Crear modal de edición
                    const modalEdit = document.createElement('div');
                    modalEdit.style.position = 'fixed';
                    modalEdit.style.top = '0';
                    modalEdit.style.left = '0';
                    modalEdit.style.width = '100vw';
                    modalEdit.style.height = '100vh';
                    modalEdit.style.background = 'rgba(24,40,72,0.75)';
                    modalEdit.style.display = 'flex';
                    modalEdit.style.alignItems = 'center';
                    modalEdit.style.justifyContent = 'center';
                    modalEdit.style.zIndex = '10000';
                    // Formulario igual al de crear producto
                    const formEdit = document.createElement('form');
                    formEdit.style.background = '#f6fcf7';
                    formEdit.style.borderRadius = '22px';
                    formEdit.style.boxShadow = '0 2px 12px #18284833';
                    formEdit.style.padding = '2.5em 2em 2em 2em';
                    formEdit.style.maxWidth = '700px';
                    formEdit.style.width = '100%';
                    formEdit.style.display = 'flex';
                    formEdit.style.flexDirection = 'column';
                    formEdit.style.alignItems = 'center';
                    formEdit.style.gap = '1.2em';
                    formEdit.innerHTML = `
                        <h2 style="color:#182848;font-size:1.5em;font-weight:900;margin-bottom:0.5em;">Editar Producto</h2>
                        <div style="display:flex;flex-wrap:wrap;gap:1.2em;width:100%;justify-content:center;">
                          <input type="text" name="nombre" placeholder="Nombre" required style="flex:2 1 220px;min-width:180px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
                          <select id="edit-categoria" name="edit-categoria" required style="flex:1 1 180px;min-width:140px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;"></select>
                          <select id="edit-proveedor" name="edit-proveedor" required style="flex:1 1 180px;min-width:140px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;"></select>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:1.2em;width:100%;justify-content:center;">
                          <input type="number" name="precio" placeholder="Precio" min="0" required style="flex:1 1 120px;min-width:100px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
                          <input type="number" name="cantidad" placeholder="Cantidad (no funcional)" min="1" style="flex:1 1 100px;min-width:80px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
                          <select id="edit-imagen-producto" name="imagen" style="flex:2 1 220px;min-width:180px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
                            <option value="" disabled>Selecciona imagen (opcional)</option>
                            <option value="static/img/Herramienta01.webp">Herramienta01.webp</option>
                            <option value="static/img/Herramienta02.webp">Herramienta02.webp</option>
                            <option value="static/img/Herramienta03.webp">Herramienta03.webp</option>
                            <option value="static/img/Herramienta04.webp">Herramienta04.webp</option>
                            <option value="static/img/Herramienta05.webp">Herramienta05.webp</option>
                            <option value="static/img/Herramienta06.webp">Herramienta06.webp</option>
                            <option value="static/img/HerramientasVisual.webp">HerramientasVisual.webp</option>
                          </select>
                        </div>
                        <textarea name="descripcion" placeholder="Descripción" rows="2" required style="width:100%;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;resize:vertical;outline:none;"></textarea>
                        <div style="width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:0.5em;">
                          <label style="color:#457b9d;font-weight:bold;font-size:1.1em;">Sucursales donde estará disponible (no funcional):</label>
                          <div style="display:flex;gap:1em;flex-wrap:wrap;">
                            <label><input type="checkbox" name="sucursales" value="Sucursal 1" disabled> Sucursal 1</label>
                            <label><input type="checkbox" name="sucursales" value="Sucursal 2" disabled> Sucursal 2</label>
                            <label><input type="checkbox" name="sucursales" value="Sucursal 3" disabled> Sucursal 3</label>
                          </div>
                        </div>
                        <div id="edit-mensaje" style="margin-top:0.7em;font-size:1em;font-weight:bold;color:#e63946;display:none;"></div>
                        <div style="display:flex;gap:1em;margin-top:1em;">
                          <button type="submit" style="background:#43aa8b;color:#fff;border:none;border-radius:8px;padding:1em 2.5em;font-weight:bold;font-size:1.2em;cursor:pointer;transition:background 0.2s;">Guardar Cambios</button>
                          <button type="button" id="btn-cancelar-edit" style="background:#e63946;color:#fff;border:none;border-radius:8px;padding:1em 2.5em;font-weight:bold;font-size:1.2em;cursor:pointer;transition:background 0.2s;">Cancelar</button>
                        </div>
                    `;
                    // Llenar selects de categoría y proveedor
                    fetch('/categorias').then(res => res.json()).then(categorias => {
                        const selectCat = formEdit.querySelector('#edit-categoria');
                        if (selectCat) {
                            selectCat.innerHTML = '<option value="">Selecciona categoría</option>';
                            categorias.forEach(cat => {
                                const opt = document.createElement('option');
                                opt.value = cat.idCategoria;
                                opt.textContent = cat.descripcion;
                                if (cat.descripcion === prod.categoria) opt.selected = true;
                                selectCat.appendChild(opt);
                            });
                        }
                    });
                    fetch('/proveedores').then(res => res.json()).then(proveedores => {
                        const selectProv = formEdit.querySelector('#edit-proveedor');
                        if (selectProv) {
                            selectProv.innerHTML = '<option value="">Selecciona proveedor</option>';
                            proveedores.forEach(prov => {
                                const opt = document.createElement('option');
                                opt.value = prov.idProveedor;
                                opt.textContent = prov.nombre;
                                if (prov.nombre === prod.proveedor) opt.selected = true;
                                selectProv.appendChild(opt);
                            });
                        }
                    });
                    // Seleccionar la imagen actual si existe
                    const selectImg = formEdit.querySelector('#edit-imagen-producto');
                    if (selectImg && prod.imagen) {
                        selectImg.value = prod.imagen;
                    } else if (selectImg) {
                        selectImg.selectedIndex = 0;
                    }
                    // Rellenar valores actuales
                    formEdit.nombre.value = prod.nombre;
                    formEdit.precio.value = prod.precio;
                    formEdit.descripcion.value = prod.descripcion;
                    // Mostrar modal
                    modalEdit.appendChild(formEdit);
                    document.body.appendChild(modalEdit);
                    // Cancelar
                    formEdit.querySelector('#btn-cancelar-edit').onclick = function() {
                        document.body.removeChild(modalEdit);
                    };
                    // Guardar cambios
                    formEdit.onsubmit = function(ev) {
                        ev.preventDefault();
                        const nombre = formEdit.nombre.value.trim();
                        const idCategoria = formEdit['edit-categoria'].value;
                        const idProveedor = formEdit['edit-proveedor'].value;
                        const precio = formEdit.precio.value;
                        const descripcion = formEdit.descripcion.value.trim();
                        const imagen = formEdit.imagen.value.trim();
                        const mensaje = formEdit.querySelector('#edit-mensaje');
                        mensaje.style.display = 'none';
                        if (!nombre || !idCategoria || !idProveedor || !precio || !descripcion) {
                            mensaje.innerText = 'Completa todos los campos obligatorios.';
                            mensaje.style.display = 'block';
                            return;
                        }
                        fetch(`/productos/${prod.idProducto}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                nombre,
                                idCategoria: Number(idCategoria),
                                idProveedor: Number(idProveedor),
                                precio: Number(precio),
                                descripcion,
                                imagen: imagen || null
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.mensaje) {
                                document.body.removeChild(modalEdit);
                                modal.style.display = 'none';
                                cargarProductos();
                            } else {
                                mensaje.innerText = data.error || 'Error al editar el producto.';
                                mensaje.style.display = 'block';
                            }
                        })
                        .catch(() => {
                            mensaje.innerText = 'Error al editar el producto.';
                            mensaje.style.display = 'block';
                        });
                    };
                };
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
                lista.appendChild(li);
            });
        }
    });
}

function abrirModalEdicionProducto(prod) {
    // Copia la lógica del botón editar de las tarjetas, pero usando 'prod' como producto
    // Crear modal de edición
    const modalEdit = document.createElement('div');
    modalEdit.style.position = 'fixed';
    modalEdit.style.top = '0';
    modalEdit.style.left = '0';
    modalEdit.style.width = '100vw';
    modalEdit.style.height = '100vh';
    modalEdit.style.background = 'rgba(24,40,72,0.75)';
    modalEdit.style.display = 'flex';
    modalEdit.style.alignItems = 'center';
    modalEdit.style.justifyContent = 'center';
    modalEdit.style.zIndex = '10000';
    // Formulario igual al de crear producto
    const formEdit = document.createElement('form');
    formEdit.style.background = '#f6fcf7';
    formEdit.style.borderRadius = '22px';
    formEdit.style.boxShadow = '0 2px 12px #18284833';
    formEdit.style.padding = '2.5em 2em 2em 2em';
    formEdit.style.maxWidth = '700px';
    formEdit.style.width = '100%';
    formEdit.style.display = 'flex';
    formEdit.style.flexDirection = 'column';
    formEdit.style.alignItems = 'center';
    formEdit.style.gap = '1.2em';
    formEdit.innerHTML = `
        <h2 style="color:#182848;font-size:1.5em;font-weight:900;margin-bottom:0.5em;">Editar Producto</h2>
        <div style="display:flex;flex-wrap:wrap;gap:1.2em;width:100%;justify-content:center;">
          <input type="text" name="nombre" placeholder="Nombre" required style="flex:2 1 220px;min-width:180px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
          <select id="edit-categoria" name="edit-categoria" required style="flex:1 1 180px;min-width:140px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;"></select>
          <select id="edit-proveedor" name="edit-proveedor" required style="flex:1 1 180px;min-width:140px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;"></select>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:1.2em;width:100%;justify-content:center;">
          <input type="number" name="precio" placeholder="Precio" min="0" required style="flex:1 1 120px;min-width:100px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
          <input type="number" name="cantidad" placeholder="Cantidad (no funcional)" min="1" style="flex:1 1 100px;min-width:80px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
          <select id="edit-imagen-producto" name="imagen" style="flex:2 1 220px;min-width:180px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
            <option value="" disabled>Selecciona imagen (opcional)</option>
            <option value="static/img/Herramienta01.webp">Herramienta01.webp</option>
            <option value="static/img/Herramienta02.webp">Herramienta02.webp</option>
            <option value="static/img/Herramienta03.webp">Herramienta03.webp</option>
            <option value="static/img/Herramienta04.webp">Herramienta04.webp</option>
            <option value="static/img/Herramienta05.webp">Herramienta05.webp</option>
            <option value="static/img/Herramienta06.webp">Herramienta06.webp</option>
            <option value="static/img/HerramientasVisual.webp">HerramientasVisual.webp</option>
          </select>
        </div>
        <textarea name="descripcion" placeholder="Descripción" rows="2" required style="width:100%;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;resize:vertical;outline:none;"></textarea>
        <div style="width:100%;display:flex;flex-direction:column;align-items:flex-start;gap:0.5em;">
          <label style="color:#457b9d;font-weight:bold;font-size:1.1em;">Sucursales donde estará disponible (no funcional):</label>
          <div style="display:flex;gap:1em;flex-wrap:wrap;">
            <label><input type="checkbox" name="sucursales" value="Sucursal 1" disabled> Sucursal 1</label>
            <label><input type="checkbox" name="sucursales" value="Sucursal 2" disabled> Sucursal 2</label>
            <label><input type="checkbox" name="sucursales" value="Sucursal 3" disabled> Sucursal 3</label>
          </div>
        </div>
        <div id="edit-mensaje" style="margin-top:0.7em;font-size:1em;font-weight:bold;color:#e63946;display:none;"></div>
        <div style="display:flex;gap:1em;margin-top:1em;">
          <button type="submit" style="background:#43aa8b;color:#fff;border:none;border-radius:8px;padding:1em 2.5em;font-weight:bold;font-size:1.2em;cursor:pointer;transition:background 0.2s;">Guardar Cambios</button>
          <button type="button" id="btn-cancelar-edit" style="background:#e63946;color:#fff;border:none;border-radius:8px;padding:1em 2.5em;font-weight:bold;font-size:1.2em;cursor:pointer;transition:background 0.2s;">Cancelar</button>
        </div>
    `;
    // Llenar selects de categoría y proveedor
    fetch('/categorias').then(res => res.json()).then(categorias => {
        const selectCat = formEdit.querySelector('#edit-categoria');
        if (selectCat) {
            selectCat.innerHTML = '<option value="">Selecciona categoría</option>';
            categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.idCategoria;
                opt.textContent = cat.descripcion;
                if (cat.descripcion === prod.categoria) opt.selected = true;
                selectCat.appendChild(opt);
            });
        }
    });
    fetch('/proveedores').then(res => res.json()).then(proveedores => {
        const selectProv = formEdit.querySelector('#edit-proveedor');
        if (selectProv) {
            selectProv.innerHTML = '<option value="">Selecciona proveedor</option>';
            proveedores.forEach(prov => {
                const opt = document.createElement('option');
                opt.value = prov.idProveedor;
                opt.textContent = prov.nombre;
                if (prov.nombre === prod.proveedor) opt.selected = true;
                selectProv.appendChild(opt);
            });
        }
    });
    // Seleccionar la imagen actual si existe
    const selectImg = formEdit.querySelector('#edit-imagen-producto');
    if (selectImg && prod.imagen) {
        selectImg.value = prod.imagen;
    } else if (selectImg) {
        selectImg.selectedIndex = 0;
    }
    // Rellenar valores actuales
    formEdit.nombre.value = prod.nombre;
    formEdit.precio.value = prod.precio;
    formEdit.descripcion.value = prod.descripcion;
    // Mostrar modal
    modalEdit.appendChild(formEdit);
    document.body.appendChild(modalEdit);
    // Cancelar
    formEdit.querySelector('#btn-cancelar-edit').onclick = function() {
        document.body.removeChild(modalEdit);
    };
    // Guardar cambios
    formEdit.onsubmit = function(ev) {
        ev.preventDefault();
        const nombre = formEdit.nombre.value.trim();
        const idCategoria = formEdit['edit-categoria'].value;
        const idProveedor = formEdit['edit-proveedor'].value;
        const precio = formEdit.precio.value;
        const descripcion = formEdit.descripcion.value.trim();
        const imagen = formEdit.imagen.value.trim();
        const mensaje = formEdit.querySelector('#edit-mensaje');
        mensaje.style.display = 'none';
        if (!nombre || !idCategoria || !idProveedor || !precio || !descripcion) {
            mensaje.innerText = 'Completa todos los campos obligatorios.';
            mensaje.style.display = 'block';
            return;
        }
        fetch(`/productos/${prod.idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                idCategoria: Number(idCategoria),
                idProveedor: Number(idProveedor),
                precio: Number(precio),
                descripcion,
                imagen: imagen || null
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.mensaje) {
                document.body.removeChild(modalEdit);
                cargarProductos();
            } else {
                mensaje.innerText = data.error || 'Error al editar el producto.';
                mensaje.style.display = 'block';
            }
        })
        .catch(() => {
            mensaje.innerText = 'Error al editar el producto.';
            mensaje.style.display = 'block';
        });
    };
}
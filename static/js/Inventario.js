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
        // Al cargar el formulario, eliminar el bloque de sucursales no funcional si existe
        const oldSucursales = document.querySelector('label[for="sucursales"]');
        if (oldSucursales && oldSucursales.parentElement) {
            oldSucursales.parentElement.remove();
        }
        // --- OPTIMIZACIÓN Y MEJORA VISUAL DEL FORMULARIO DE AGREGAR PRODUCTO ---
        // 1. Input nombre largo y destacado
        const inputNombre = form.querySelector('input[name="nombre"]');
        if (inputNombre) {
            inputNombre.style.width = '100%';
            inputNombre.style.marginBottom = '1em';
            inputNombre.style.fontSize = '1.15em';
            inputNombre.style.padding = '1em 1.2em';
            inputNombre.style.borderRadius = '10px';
            inputNombre.style.border = '2px solid #457b9d';
            inputNombre.style.outline = 'none';
            inputNombre.style.background = '#eaf4fb';
            inputNombre.style.color = '#182848';
            inputNombre.style.fontWeight = 'bold';
            inputNombre.placeholder = 'Nombre del producto';
            inputNombre.style.boxShadow = '0 2px 8px #457b9d11';
        }
        // 2. Fila horizontal: Precio, Categoría, Proveedor, Imagen
        let fila = form.querySelector('#fila-datos-producto');
        if (!fila) {
            fila = document.createElement('div');
            fila.id = 'fila-datos-producto';
            fila.style.display = 'flex';
            fila.style.gap = '1em';
            fila.style.width = '100%';
            fila.style.marginBottom = '1em';
            fila.style.flexWrap = 'wrap';
            // Precio
            const inputPrecio = form.querySelector('input[name="precio"]');
            if (inputPrecio) {
                inputPrecio.style.width = '90px';
                inputPrecio.style.fontSize = '1.13em';
                inputPrecio.style.padding = '0.9em 1.2em';
                inputPrecio.style.borderRadius = '10px';
                inputPrecio.style.border = '2px solid #43aa8b';
                inputPrecio.style.background = '#eaf4fb';
                inputPrecio.style.color = '#182848';
                inputPrecio.style.outline = 'none';
                inputPrecio.placeholder = 'Precio';
                inputPrecio.style.fontWeight = 'bold';
                inputPrecio.style.boxShadow = '0 2px 8px #43aa8b11';
                fila.appendChild(inputPrecio);
            }
            // Categoría
            const selectCat = form.querySelector('#select-categoria');
            if (selectCat) {
                selectCat.style.width = '170px';
                selectCat.style.fontSize = '1.13em';
                selectCat.style.padding = '0.9em 1.2em';
                selectCat.style.borderRadius = '10px';
                selectCat.style.border = '2px solid #457b9d';
                selectCat.style.background = '#eaf4fb';
                selectCat.style.color = '#182848';
                selectCat.style.outline = 'none';
                selectCat.style.fontWeight = 'bold';
                selectCat.style.marginLeft = '0.2em';
                selectCat.style.boxShadow = '0 2px 8px #457b9d11';
                fila.appendChild(selectCat);
            }
            // Proveedor
            const selectProv = form.querySelector('#select-proveedor');
            if (selectProv) {
                selectProv.style.width = '170px';
                selectProv.style.fontSize = '1.13em';
                selectProv.style.padding = '0.9em 1.2em';
                selectProv.style.borderRadius = '10px';
                selectProv.style.border = '2px solid #457b9d';
                selectProv.style.background = '#eaf4fb';
                selectProv.style.color = '#182848';
                selectProv.style.outline = 'none';
                selectProv.style.fontWeight = 'bold';
                selectProv.style.marginLeft = '0.2em';
                selectProv.style.boxShadow = '0 2px 8px #457b9d11';
                fila.appendChild(selectProv);
            }
            // Imagen
            const selectImg = form.querySelector('select[name="imagen"]');
            if (selectImg) {
                selectImg.style.width = '170px';
                selectImg.style.fontSize = '1.13em';
                selectImg.style.padding = '0.9em 1.2em';
                selectImg.style.borderRadius = '10px';
                selectImg.style.border = '2px solid #457b9d';
                selectImg.style.background = '#eaf4fb';
                selectImg.style.color = '#182848';
                selectImg.style.outline = 'none';
                selectImg.style.fontWeight = 'bold';
                selectImg.style.marginLeft = '0.2em';
                selectImg.style.boxShadow = '0 2px 8px #457b9d11';
                fila.appendChild(selectImg);
            }
            // Insertar la fila después del input nombre
            if (inputNombre && inputNombre.parentNode) {
                inputNombre.parentNode.insertBefore(fila, inputNombre.nextSibling);
            }
        }
        // 3. Descripción estilizada
        const textarea = form.querySelector('textarea[name="descripcion"]');
        if (textarea) {
            textarea.style.width = '100%';
            textarea.style.padding = '1em 1.2em';
            textarea.style.borderRadius = '10px';
            textarea.style.border = '2px solid #457b9d';
            textarea.style.fontSize = '1.13em';
            textarea.style.background = '#eaf4fb';
            textarea.style.color = '#182848';
            textarea.style.margin = '0.7em 0 0.7em 0';
            textarea.style.outline = 'none';
            textarea.style.fontWeight = 'bold';
            textarea.style.boxShadow = '0 2px 8px #457b9d11';
        }
        // 4. Rediseño de stock por sucursal
        fetch('/sucursales').then(res => res.json()).then(sucursales => {
            let contenedorSucursales = document.getElementById('contenedor-sucursales-stock');
            if (!contenedorSucursales) {
                contenedorSucursales = document.createElement('div');
                contenedorSucursales.id = 'contenedor-sucursales-stock';
                // Insertar antes del botón submit
                const btnSubmit = form.querySelector('button[type="submit"]');
                form.insertBefore(contenedorSucursales, btnSubmit);
            }
            contenedorSucursales.style.marginLeft = '0'; // Sin margen izquierdo
            contenedorSucursales.style.paddingLeft = '0'; // Sin padding izquierdo
            contenedorSucursales.style.width = '100%'; // Ancho completo
            contenedorSucursales.innerHTML = '';
            const label = document.createElement('div');
            label.innerHTML = '<span style="color:#457b9d;font-weight:bold;font-size:1.18em;letter-spacing:0.5px;">Stock por sucursal</span>';
            label.style.marginBottom = '0.5em';
            contenedorSucursales.appendChild(label);
            if (Array.isArray(sucursales) && sucursales.length > 0) {
                const listaSucursales = document.createElement('div');
                listaSucursales.style.display = 'flex';
                listaSucursales.style.flexDirection = 'column';
                listaSucursales.style.gap = '0.5em';
                listaSucursales.style.background = '#eaf4fb';
                listaSucursales.style.borderRadius = '12px';
                listaSucursales.style.boxShadow = '0 1px 6px #457b9d22';
                listaSucursales.style.padding = '1em 1.2em';
                listaSucursales.style.marginBottom = '0.5em';
                listaSucursales.style.alignItems = 'flex-start'; // Alinea a la izquierda
                listaSucursales.style.width = '100%';
                listaSucursales.style.marginLeft = '0'; // Sin margen izquierdo
                listaSucursales.style.paddingLeft = '0'; // Sin padding izquierdo
                listaSucursales.style.width = '100%'; // Ancho completo
                sucursales.forEach(suc => {
                    const row = document.createElement('div');
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                    row.style.gap = '1.2em';
                    row.style.padding = '0.4em 0.2em';
                    row.style.borderRadius = '8px';
                    row.style.transition = 'background 0.18s';
                    row.style.width = '100%'; // Ocupa todo el ancho
                    row.onmouseenter = () => { row.style.background = '#d0e6f7'; };
                    row.onmouseleave = () => { row.style.background = 'none'; };
                    // Nombre sucursal
                    const labelSuc = document.createElement('span');
                    labelSuc.innerText = suc.nombre;
                    labelSuc.style.minWidth = '120px';
                    labelSuc.style.fontWeight = 'bold';
                    labelSuc.style.color = '#182848';
                    // Input stock
                    const inputStock = document.createElement('input');
                    inputStock.type = 'number';
                    inputStock.name = 'stock_sucursal_' + suc.idSucursal;
                    inputStock.placeholder = 'Stock';
                    inputStock.min = '1';
                    inputStock.required = false;
                    inputStock.style.width = '70px';
                    inputStock.style.padding = '0.4em 0.7em';
                    inputStock.style.borderRadius = '10px';
                    inputStock.style.border = '2px solid #457b9d';
                    inputStock.style.fontSize = '1em';
                    inputStock.style.background = '#fff';
                    inputStock.style.transition = 'box-shadow 0.18s';
                    inputStock.style.marginLeft = '0.5em';
                    inputStock.style.fontWeight = 'bold';
                    inputStock.style.color = '#457b9d';
                    inputStock.style.textAlign = 'center';
                    inputStock.disabled = true;
                    inputStock.oninput = function() {
                        if (inputStock.value.length > 4) inputStock.value = inputStock.value.slice(0,4);
                    };
                    // Checkbox para seleccionar sucursal
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'sucursal_stock';
                    checkbox.value = suc.idSucursal;
                    checkbox.style.accentColor = '#457b9d';
                    checkbox.onchange = function() {
                        inputStock.disabled = !checkbox.checked;
                        inputStock.required = checkbox.checked;
                        if (!checkbox.checked) inputStock.value = '';
                        row.style.background = checkbox.checked ? '#bde0fe' : 'none';
                    };
                    row.appendChild(checkbox);
                    row.appendChild(labelSuc);
                    row.appendChild(inputStock);
                    listaSucursales.appendChild(row);
                });
                contenedorSucursales.appendChild(listaSucursales);
            } else {
                const noSuc = document.createElement('div');
                noSuc.innerText = 'No hay sucursales registradas.';
                noSuc.style.color = '#888';
                contenedorSucursales.appendChild(noSuc);
            }
        });
        // Agregar textarea de descripción si no existe
        if (!form.querySelector('textarea[name="descripcion"]')) {
            const descDiv = document.createElement('div');
            descDiv.style.width = '100%';
            descDiv.style.margin = '0.5em 0 0.5em 0';
            const textarea = document.createElement('textarea');
            textarea.name = 'descripcion';
            textarea.placeholder = 'Descripción';
            textarea.required = true;
            textarea.rows = 2;
            textarea.style.width = '100%';
            textarea.style.padding = '0.9em 1.2em';
            textarea.style.borderRadius = '8px';
            textarea.style.border = '1px solid #b0c4de';
            textarea.style.fontSize = '1.1em';
            textarea.style.resize = 'vertical';
            textarea.style.outline = 'none';
            descDiv.appendChild(textarea);
            // Insertar después del input de precio
            const precioInput = form.querySelector('input[name="precio"]');
            if (precioInput && precioInput.parentNode) {
                precioInput.parentNode.insertBefore(descDiv, precioInput.nextSibling);
            } else {
                form.insertBefore(descDiv, form.firstChild);
            }
        }
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = form.nombre.value.trim();
            const idCategoria = form['select-categoria'].value;
            const idProveedor = form['select-proveedor'].value;
            const precio = form.precio.value;
            const descripcion = form.descripcion.value.trim();
            const imagen = form.imagen.value; // Ahora es un select
            const mensaje = document.getElementById('form-producto-mensaje');
            mensaje.style.display = 'none';
            // Validación básica
            if (!nombre || !idCategoria || !idProveedor || !precio || !descripcion) {
                mensaje.innerText = 'Completa todos los campos obligatorios.';
                mensaje.style.display = 'block';
                return;
            }
            // Obtener stock por sucursal
            const sucursalesStock = [];
            const contenedor = document.getElementById('contenedor-sucursales-stock');
            let errorStock = false;
            if (contenedor) {
                contenedor.querySelectorAll('input[type="checkbox"][name="sucursal_stock"]').forEach(checkbox => {
                    if (checkbox.checked) {
                        const idSucursal = Number(checkbox.value);
                        const inputStock = contenedor.querySelector('input[name="stock_sucursal_' + idSucursal + '"]');
                        const cantidad = inputStock && inputStock.value ? Number(inputStock.value) : 0;
                        if (!cantidad || cantidad < 1) {
                            errorStock = true;
                        }
                        sucursalesStock.push({ idSucursal, cantidad });
                    }
                });
            }
            if (sucursalesStock.length === 0) {
                mensaje.innerText = 'Selecciona al menos una sucursal y define la cantidad.';
                mensaje.style.display = 'block';
                return;
            }
            if (errorStock) {
                mensaje.innerText = 'Debes ingresar una cantidad válida (mayor a 0) para cada sucursal seleccionada.';
                mensaje.style.display = 'block';
                return;
            }
            // Enviar al backend (ahora incluye stock por sucursal)
            fetch('/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    idCategoria: Number(idCategoria),
                    idProveedor: Number(idProveedor),
                    precio: Number(precio),
                    descripcion,
                    imagen: imagen || null,
                    sucursalesStock // Nuevo campo para backend
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
    const lista = document.getElementById('lista-productos');
    if (!lista) return;
    lista.innerHTML = '';
    Promise.all([
        fetch('/productos').then(res => res.json()),
        fetch('/inventario_stock').then(res => res.json())
    ]).then(([productos, inventarioStock]) => {
        if (!lista) return;
        lista.innerHTML = '';
        // Mapear productos con su stock por sucursal
        const productosConStock = productos.map(prod => {
            // Buscar todos los registros de inventario para este producto
            const stockSucursales = inventarioStock
                .filter(inv => inv.idProducto === prod.idProducto)
                .map(inv => ({ nombre: inv.sucursal, cantidad: inv.cantidad })); // CAMBIO: usar 'sucursal'
            return { ...prod, sucursalesStock: stockSucursales };
        });
        // Aplicar estilos de grid al contenedor
        lista.style.display = 'grid';
        lista.style.gridTemplateColumns = 'repeat(4, 1fr)';
        lista.style.gap = '2em';
        lista.style.justifyItems = 'center';
        if (Array.isArray(productosConStock) && productosConStock.length > 0) {
            productosConStock.forEach(prod => {
                const li = document.createElement('li');
                li.style.background = 'rgba(60, 60, 70, 0.32)'; // Plomo claro 
                li.style.color = '#fff';
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
                li.style.transition = 'transform 0.18s cubic-bezier(.4,1.5,.5,1)';
                li.onmouseenter = () => { li.style.transform = 'scale(1.045)'; };
                li.onmouseleave = () => { li.style.transform = 'none'; };
                // Imagen
                const img = document.createElement('img');
                img.src = prod.imagen || 'static/img/Herramienta01.webp';
                img.alt = prod.nombre;
                img.style.width = '100%';
                img.style.maxWidth = '280px'; // Más grande
                img.style.height = '210px';   // Más alto
                img.style.objectFit = 'cover';
                img.style.borderRadius = '16px'; // Menos curvo
                img.style.background = 'none';
                img.style.padding = '0';
                li.appendChild(img);
                // Nombre
                const nombre = document.createElement('h3');
                nombre.innerText = prod.nombre;
                nombre.style.fontWeight = 'bold';
                nombre.style.fontSize = '1.2em';
                nombre.style.margin = '0.7em 0 0.5em 0'; // Más separación arriba
                li.appendChild(nombre);
                // Precio
                const precio = document.createElement('div');
                precio.innerHTML = `<span style='color:#43aa8b;font-weight:bold;font-size:1.35em;'>$${prod.precio}</span>`;
                precio.style.marginBottom = '0.8em';
                li.appendChild(precio);
                // Al hacer click en la tarjeta, mostrar modal grande
                li.onclick = function() {
                    mostrarModalProducto(prod);
                };
                lista.appendChild(li);
            });
        } else {
            // Si no hay productos
            const vacio = document.createElement('div');
            vacio.innerText = 'No hay productos registrados.';
            vacio.style.color = '#888';
            vacio.style.fontSize = '1.2em';
            vacio.style.gridColumn = '1/-1';
            vacio.style.textAlign = 'center';
            vacio.style.margin = '2em 0';
            lista.appendChild(vacio);
        }
    }).catch(err => {
        if (lista) {
            lista.innerHTML = '';
            const errorDiv = document.createElement('div');
            errorDiv.innerText = 'Error al cargar los productos. Intenta más tarde.';
            errorDiv.style.color = '#e63946';
            errorDiv.style.fontSize = '1.2em';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.margin = '2em 0';
            lista.appendChild(errorDiv);
        }
    });
}

function abrirModalEdicionProducto(prod, mostrarStockPorSucursal) {
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
          <select id="edit-imagen-producto" name="imagen" style="flex:2 1 220px;min-width:180px;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;outline:none;">
            <option value="" disabled>Selecciona imagen (opcional)</option>
            <option value="static/img/Herramienta01.webp">Herramienta01.webp</option>
            <option value="static/img/Herramienta02.webp">Herramienta02.webp</option>
            <option value="static/img/Herramienta03.webp">Herramienta03.webp</option>
            <option value="static/img/Herramienta04.webp">Herramienta04.webp</option>
            <option value="static/img/Herramienta05.webp">Herramienta05.webp</option>
            <option value="static/img/Herramienta06.webp">Herramienta06.webp</option>
            <option value="static/img/HerramientasAgregar01.webp">HerramientasAgregar01.webp</option>
            <option value="static/img/HerramientasAgregar02.webp">HerramientasAgregar02.webp</option>
            <option value="static/img/HerramientasAgregar03.webp">HerramientasAgregar03.webp</option>
            <option value="static/img/HerramientasVisual.webp">HerramientasVisual.webp</option>
          </select>
        </div>
        <textarea name="descripcion" placeholder="Descripción" rows="2" required style="width:100%;padding:0.9em 1.2em;border-radius:8px;border:1px solid #b0c4de;font-size:1.1em;resize:vertical;outline:none;"></textarea>
        <div id="edit-mensaje" style="margin-top:0.7em;font-size:1em;font-weight:bold;color:#e63946;display:none;"></div>
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
    // Bloque de stock por sucursal (solo si mostrarStockPorSucursal)
    if (mostrarStockPorSucursal) {
        const contenedorSucursales = document.createElement('div');
        contenedorSucursales.id = 'edit-contenedor-sucursales-stock';
        contenedorSucursales.style.marginLeft = '0';
        contenedorSucursales.style.paddingLeft = '0';
        contenedorSucursales.style.width = '100%';
        const label = document.createElement('div');
        label.innerHTML = '<span style="color:#457b9d;font-weight:bold;font-size:1.18em;letter-spacing:0.5px;">Stock por sucursal</span>';
        label.style.marginBottom = '0.5em';
        contenedorSucursales.appendChild(label);
        fetch('/sucursales').then(res => res.json()).then(sucursales => {
            if (Array.isArray(sucursales) && sucursales.length > 0) {
                const listaSucursales = document.createElement('div');
                listaSucursales.style.display = 'flex';
                listaSucursales.style.flexDirection = 'column';
                listaSucursales.style.gap = '0.5em';
                listaSucursales.style.background = '#eaf4fb';
                listaSucursales.style.borderRadius = '12px';
                listaSucursales.style.boxShadow = '0 1px 6px #457b9d22';
                listaSucursales.style.padding = '1em 1.2em';
                listaSucursales.style.marginBottom = '0.5em';
                listaSucursales.style.alignItems = 'flex-start';
                listaSucursales.style.width = '100%';
                listaSucursales.style.marginLeft = '0';
                listaSucursales.style.paddingLeft = '0';
                listaSucursales.style.width = '100%';
                sucursales.forEach(suc => {
                    const row = document.createElement('div');
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                    row.style.gap = '1.2em';
                    row.style.padding = '0.4em 0.2em';
                    row.style.borderRadius = '8px';
                    row.style.transition = 'background 0.18s';
                    row.style.width = '100%';
                    row.onmouseenter = () => { row.style.background = '#d0e6f7'; };
                    row.onmouseleave = () => { row.style.background = 'none'; };
                    // Nombre sucursal
                    const labelSuc = document.createElement('span');
                    labelSuc.innerText = suc.nombre;
                    labelSuc.style.minWidth = '120px';
                    labelSuc.style.fontWeight = 'bold';
                    labelSuc.style.color = '#182848';
                    // Input stock
                    const inputStock = document.createElement('input');
                    inputStock.type = 'number';
                    inputStock.name = 'edit_stock_sucursal_' + suc.idSucursal;
                    inputStock.placeholder = 'Stock';
                    inputStock.min = '1';
                    inputStock.required = false;
                    inputStock.style.width = '70px';
                    inputStock.style.padding = '0.4em 0.7em';
                    inputStock.style.borderRadius = '10px';
                    inputStock.style.border = '2px solid #457b9d';
                    inputStock.style.fontSize = '1em';
                    inputStock.style.background = '#fff';
                    inputStock.style.transition = 'box-shadow 0.18s';
                    inputStock.style.marginLeft = '0.5em';
                    inputStock.style.fontWeight = 'bold';
                    inputStock.style.color = '#457b9d';
                    inputStock.style.textAlign = 'center';
                    inputStock.disabled = true;
                    inputStock.oninput = function() {
                        if (inputStock.value.length > 4) inputStock.value = inputStock.value.slice(0,4);
                    };
                    // Checkbox para seleccionar sucursal
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'edit_sucursal_stock';
                    checkbox.value = suc.idSucursal;
                    checkbox.style.accentColor = '#457b9d';
                    // Si el producto ya tiene stock en esta sucursal, marcar y mostrar cantidad
                    let cantidadExistente = 0;
                    if (prod.sucursalesStock && Array.isArray(prod.sucursalesStock)) {
                        const stockSuc = prod.sucursalesStock.find(s => s.nombre === suc.nombre || s.nombreSucursal === suc.nombre);
                        if (stockSuc) {
                            cantidadExistente = stockSuc.cantidad;
                        }
                    }
                    if (cantidadExistente > 0) {
                        checkbox.checked = true;
                        inputStock.disabled = false;
                        inputStock.required = true;
                        inputStock.value = cantidadExistente;
                        row.style.background = '#bde0fe';
                    }
                    checkbox.onchange = function() {
                        inputStock.disabled = !checkbox.checked;
                        inputStock.required = checkbox.checked;
                        if (!checkbox.checked) inputStock.value = '';
                        row.style.background = checkbox.checked ? '#bde0fe' : 'none';
                    };
                    row.appendChild(checkbox);
                    row.appendChild(labelSuc);
                    row.appendChild(inputStock);
                    listaSucursales.appendChild(row);
                });
                contenedorSucursales.appendChild(listaSucursales);
            } else {
                const noSuc = document.createElement('div');
                noSuc.innerText = 'No hay sucursales registradas.';
                noSuc.style.color = '#888';
                contenedorSucursales.appendChild(noSuc);
            }
        });
        formEdit.appendChild(contenedorSucursales);
    }
    // Botones guardar/cancelar
    const contBotones = document.createElement('div');
    contBotones.style.display = 'flex';
    contBotones.style.gap = '1em';
    contBotones.style.marginTop = '1em';
    const btnGuardar = document.createElement('button');
    btnGuardar.type = 'submit';
    btnGuardar.innerText = 'Guardar Cambios';
    btnGuardar.style.background = '#43aa8b';
    btnGuardar.style.color = '#fff';
    btnGuardar.style.border = 'none';
    btnGuardar.style.borderRadius = '8px';
    btnGuardar.style.padding = '1em 2.5em';
    btnGuardar.style.fontWeight = 'bold';
    btnGuardar.style.fontSize = '1.2em';
    btnGuardar.style.cursor = 'pointer';
    btnGuardar.style.transition = 'background 0.2s';
    const btnCancelar = document.createElement('button');
    btnCancelar.type = 'button';
    btnCancelar.id = 'btn-cancelar-edit';
    btnCancelar.innerText = 'Cancelar';
    btnCancelar.style.background = '#e63946';
    btnCancelar.style.color = '#fff';
    btnCancelar.style.border = 'none';
    btnCancelar.style.borderRadius = '8px';
    btnCancelar.style.padding = '1em 2.5em';
    btnCancelar.style.fontWeight = 'bold';
    btnCancelar.style.fontSize = '1.2em';
    btnCancelar.style.cursor = 'pointer';
    btnCancelar.style.transition = 'background 0.2s';
    contBotones.appendChild(btnGuardar);
    contBotones.appendChild(btnCancelar);
    formEdit.appendChild(contBotones);
    // Mostrar modal
    modalEdit.appendChild(formEdit);
    document.body.appendChild(modalEdit);
    // Cancelar
    btnCancelar.onclick = function() {
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
        // Obtener stock por sucursal si corresponde
        let sucursalesStock = undefined;
        if (mostrarStockPorSucursal) {
            sucursalesStock = [];
            const contenedor = formEdit.querySelector('#edit-contenedor-sucursales-stock');
            let errorStock = false;
            if (contenedor) {
                contenedor.querySelectorAll('input[type="checkbox"][name="edit_sucursal_stock"]').forEach(checkbox => {
                    if (checkbox.checked) {
                        const idSucursal = Number(checkbox.value);
                        const inputStock = contenedor.querySelector('input[name="edit_stock_sucursal_' + idSucursal + '"]');
                        const cantidad = inputStock && inputStock.value ? Number(inputStock.value) : 0;
                        if (!cantidad || cantidad < 1) {
                            errorStock = true;
                        }
                        sucursalesStock.push({ idSucursal, cantidad });
                    }
                });
            }
            if (sucursalesStock.length === 0) {
                mensaje.innerText = 'Selecciona al menos una sucursal y define la cantidad.';
                mensaje.style.display = 'block';
                return;
            }
            if (errorStock) {
                mensaje.innerText = 'Debes ingresar una cantidad válida (mayor a 0) para cada sucursal seleccionada.';
                mensaje.style.display = 'block';
                return;
            }
        }
       
        const body = {
            nombre,
            idCategoria: Number(idCategoria),
            idProveedor: Number(idProveedor),
            precio: Number(precio),
            descripcion,
            imagen: imagen || null
        };
        if (sucursalesStock !== undefined) {
            body.sucursalesStock = sucursalesStock;
        }
        fetch(`/productos/${prod.idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
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

function mostrarModalProducto(prod) {
    // Modal de producto grande
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(24,40,72,0.85)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    // Contenido
    const card = document.createElement('div');
    card.style.background = '#fff'; // Fondo blanco
    card.style.borderRadius = '22px';
    card.style.boxShadow = '0 2px 24px #18284855';
    card.style.padding = '2.5em 2em 2em 2em';
    card.style.maxWidth = '900px';
    card.style.width = '90vw';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.gap = '1.2em';
    // Imagen grande
    const img = document.createElement('img');
    img.src = prod.imagen || 'static/img/Herramienta01.webp';
    img.alt = prod.nombre;
    img.style.width = '100%';
    img.style.maxWidth = '420px';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '20px';
    img.style.background = 'none';
    img.style.padding = '0';
    img.style.marginBottom = '0.5em'; // Más cerca del nombre
    img.style.cursor = 'zoom-in';
    img.onclick = function(e) {
        e.stopPropagation();
        const lightbox = document.createElement('div');
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100vw';
        lightbox.style.height = '100vh';
        lightbox.style.background = 'rgba(24,40,72,0.95)';
        lightbox.style.display = 'flex';
        lightbox.style.alignItems = 'center';
        lightbox.style.justifyContent = 'center';
        lightbox.style.zIndex = '20000';
        const imgFull = document.createElement('img');
        imgFull.src = img.src;
        imgFull.alt = img.alt;
        imgFull.style.maxWidth = '90vw';
        imgFull.style.maxHeight = '90vh';
        imgFull.style.borderRadius = '20px';
        imgFull.style.background = 'none';
        imgFull.style.boxShadow = '0 2px 32px #18284899';
        imgFull.style.objectFit = 'contain';
        imgFull.style.cursor = 'zoom-out';
        lightbox.appendChild(imgFull);
        lightbox.onclick = function() {
            document.body.removeChild(lightbox);
        };
        document.body.appendChild(lightbox);
    };
    card.appendChild(img);
    // Nombre del producto
    const nombre = document.createElement('h2');
    nombre.innerText = prod.nombre;
    nombre.style.fontWeight = 'bold';
    nombre.style.fontSize = '2.1em'; // Más grande
    nombre.style.margin = '0.05em 0 0.08em 0'; // Más cerca de la imagen y categoría
    card.appendChild(nombre);
    // Categoría
    const cat = document.createElement('div');
    cat.innerHTML = `<span style='color:#457b9d;font-weight:bold;'>Categoría:</span> <span style='color:#222;font-weight:500;'>${prod.categoria || ''}</span>`;
    cat.style.fontSize = '1.15em';
    cat.style.margin = '0.01em 0 0.08em 0'; // Más cerca del nombre y descripción
    card.appendChild(cat);
    // Descripción
    const desc = document.createElement('div');
    desc.innerText = prod.descripcion || '';
    desc.style.fontSize = '1.13em';
    desc.style.color = '#444';
    desc.style.margin = '0.01em 0 0.18em 0'; // Más cerca de la categoría
    card.appendChild(desc);
    // Input para cantidad a agregar
    const cantidadDiv = document.createElement('div');
    cantidadDiv.style.display = 'flex';
    cantidadDiv.style.alignItems = 'center';
    cantidadDiv.style.gap = '0.7em';
    cantidadDiv.style.margin = '0.1em 0 0.2em 0';
    const labelCantidad = document.createElement('label');
    labelCantidad.innerText = 'Cantidad:'; // Cambiado el texto
    labelCantidad.style.fontWeight = 'bold';
    labelCantidad.style.color = '#457b9d';
    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.min = '1';
    inputCantidad.value = '1';
    inputCantidad.style.width = '70px';
    inputCantidad.style.padding = '0.4em 0.7em';
    inputCantidad.style.borderRadius = '7px';
    inputCantidad.style.border = '1px solid #b0c4de';
    inputCantidad.style.fontSize = '1em';
    cantidadDiv.appendChild(labelCantidad);
    cantidadDiv.appendChild(inputCantidad);
    card.appendChild(cantidadDiv);
    // Precio 
    const precioDiv = document.createElement('div');
    precioDiv.innerHTML = `<span style='color:#43aa8b;font-weight:bold;font-size:1.25em;'>$${prod.precio}</span>`; // Más pequeño
    precioDiv.style.margin = '0.1em 0 0.3em 0';
    card.appendChild(precioDiv);
    // Stock en sucursales 
    const stockContainer = document.createElement('div');
    stockContainer.style.width = '100%';
    stockContainer.style.margin = '0.2em 0 0.7em 0';
    stockContainer.style.display = 'flex';
    stockContainer.style.flexDirection = 'column';
    stockContainer.style.alignItems = 'center';
    // Título stock
    const stockTitle = document.createElement('div');
    stockTitle.innerText = 'Stock';
    stockTitle.style.color = '#457b9d';
    stockTitle.style.fontWeight = 'bold';
    stockTitle.style.fontSize = '1.13em';
    stockTitle.style.marginBottom = '0.2em';
    stockContainer.appendChild(stockTitle);
    // Lista de sucursales con stock y selección
    let sucursalSeleccionada = null;
    const sucursalesDiv = document.createElement('div');
    sucursalesDiv.style.width = '100%';
    sucursalesDiv.style.background = '#eaf4fb';
    sucursalesDiv.style.borderRadius = '10px';
    sucursalesDiv.style.boxShadow = '0 1px 6px #457b9d22';
    sucursalesDiv.style.padding = '0.7em 1em';
    sucursalesDiv.style.marginTop = '0.2em';
    if (prod.sucursalesStock && Array.isArray(prod.sucursalesStock) && prod.sucursalesStock.length > 0) {
        // FILTRAR sucursales con stock > 0
        const sucursalesConStock = prod.sucursalesStock.filter(suc => suc.cantidad > 0);
        if (sucursalesConStock.length > 0) {
            sucursalesConStock.forEach((suc, idx) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.padding = '0.2em 0.3em';
                row.style.fontSize = '1.08em';
                row.style.cursor = 'pointer';
                row.style.borderRadius = '7px';
                row.onmouseenter = () => { if (sucursalSeleccionada !== idx) row.style.background = '#18284822'; };
                row.onmouseleave = () => { if (sucursalSeleccionada !== idx) row.style.background = 'none'; };
                row.onclick = () => {
                    Array.from(sucursalesDiv.children).forEach((el, i) => {
                        el.style.background = (i === idx) ? '#182848' : 'none';
                        el.style.color = (i === idx) ? '#fff' : '#222';
                    });
                    sucursalSeleccionada = idx;
                };
                row.innerHTML = `<span style='font-weight:500;'>${suc.nombre || suc.nombreSucursal || 'Sucursal'}</span> <span style='color:#43aa8b;font-weight:bold;'>${suc.cantidad}</span>`;
                sucursalesDiv.appendChild(row);
            });
        } else {
            // Si todas las sucursales tienen stock 0, mostrar mensaje de sin stock
            const noSuc = document.createElement('div');
            noSuc.innerText = 'Sin stock en sucursales.';
            noSuc.style.color = '#888';
            sucursalesDiv.appendChild(noSuc);
        }
    } else {
        const noSuc = document.createElement('div');
        noSuc.innerText = 'Sin stock en sucursales.';
        noSuc.style.color = '#888';
        sucursalesDiv.appendChild(noSuc);
    }
    stockContainer.appendChild(sucursalesDiv);
    card.appendChild(stockContainer);
    // Botón agregar producto (ahora solo dice "Agregar")
    const btnAgregar = document.createElement('button');
    btnAgregar.innerText = 'Agregar';
    btnAgregar.style.background = '#43aa8b';
    btnAgregar.style.color = '#fff';
    btnAgregar.style.border = 'none';
    btnAgregar.style.borderRadius = '8px';
    btnAgregar.style.padding = '0.8em 2em';
    btnAgregar.style.fontWeight = 'bold';
    btnAgregar.style.fontSize = '1.1em';
    btnAgregar.style.cursor = 'pointer';
    btnAgregar.style.height = '48px';
    btnAgregar.style.minWidth = '120px';
    // Botón editar (igual que agregar)
    const btnEditar = document.createElement('button');
    btnEditar.innerText = 'Editar';
    btnEditar.style.background = '#f4a261'; // Naranja
    btnEditar.style.color = '#fff';
    btnEditar.style.border = 'none';
    btnEditar.style.borderRadius = '8px';
    btnEditar.style.padding = '0.8em 2em';
    btnEditar.style.fontWeight = 'bold';
    btnEditar.style.fontSize = '1.1em';
    btnEditar.style.cursor = 'pointer';
    btnEditar.style.height = '48px';
    btnEditar.style.minWidth = '120px';
    btnEditar.onclick = function() {
        document.body.removeChild(modal);
        abrirModalEdicionProducto(prod, true); // true para indicar edición con stock por sucursal
    };
    // Botón borrar
    const btnBorrar = document.createElement('button');
    btnBorrar.innerText = 'Borrar';
    btnBorrar.style.background = '#e63946';
    btnBorrar.style.color = '#fff';
    btnBorrar.style.border = 'none';
    btnBorrar.style.borderRadius = '8px';
    btnBorrar.style.padding = '0.8em 2em';
    btnBorrar.style.fontWeight = 'bold';
    btnBorrar.style.fontSize = '1.1em';
    btnBorrar.style.cursor = 'pointer';
    btnBorrar.style.height = '48px';
    btnBorrar.style.minWidth = '120px';
    btnBorrar.onclick = function() {
        if (confirm('¿Estás seguro de que deseas borrar este producto?')) {
            fetch(`/productos/${prod.idProducto}`, {
                method: 'DELETE',
            })
            .then(res => res.json())
            .then(data => {
                if (data.mensaje) {
                    alert('Producto borrado correctamente.');
                    document.body.removeChild(modal);
                    cargarProductos();
                } else {
                    alert(data.error || 'Error al borrar el producto.');
                }
            })
            .catch(() => {
                alert('Error al borrar el producto.');
            });
        }
    };
    // Contenedor de botones
    const contBotones = document.createElement('div');
    contBotones.style.display = 'flex';
    contBotones.style.flexDirection = 'row';
    contBotones.style.alignItems = 'center';
    contBotones.style.justifyContent = 'center';
    contBotones.style.gap = '1.5em';
    contBotones.style.width = '100%';
    contBotones.style.margin = '1.2em 0 0.5em 0';
    contBotones.appendChild(btnAgregar);
    contBotones.appendChild(btnEditar);
    contBotones.appendChild(btnBorrar);
    card.appendChild(contBotones);

    // --- Lógica para agregar y descontar stock ---
    btnAgregar.onclick = function(e) {
        e.preventDefault();
        // Buscar sucursal seleccionada
        let sucursalSeleccionada = null;
        let stockDisponible = null;
        let nombreSucursal = null;
        let sucursalIdx = null;
        if (prod.sucursalesStock && Array.isArray(prod.sucursalesStock)) {
            // Buscar la fila seleccionada (background #182848)
            const filas = sucursalesDiv.children;
            for (let i = 0; i < filas.length; i++) {
                if (filas[i].style.background === 'rgb(24, 40, 72)') {
                    sucursalSeleccionada = prod.sucursalesStock[i];
                    stockDisponible = sucursalSeleccionada.cantidad;
                    nombreSucursal = sucursalSeleccionada.nombre || sucursalSeleccionada.nombreSucursal;
                    sucursalIdx = i;
                    break;
                }
            }
        }
        const cantidad = Number(inputCantidad.value);
        // Validaciones
        if (!sucursalSeleccionada) {
            alert('Selecciona una sucursal del stock.');
            return;
        }
        if (!cantidad || cantidad < 1) {
            alert('Ingresa una cantidad válida.');
            return;
        }
        if (cantidad > stockDisponible) {
            alert('La cantidad supera el stock disponible en la sucursal seleccionada.');
            return;
        }
        // Descontar stock en backend
        fetch('/descontar_stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idProducto: prod.idProducto,
                nombreSucursal: nombreSucursal,
                cantidad: cantidad
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Actualizar el stock en el frontend sin recargar toda la página
                prod.sucursalesStock[sucursalIdx].cantidad -= cantidad;
                // Actualiza el DOM de la fila seleccionada
                if (prod.sucursalesStock[sucursalIdx].cantidad > 0) {
                    // Actualizar el número en la fila de la sucursal
                    const fila = sucursalesDiv.children[sucursalIdx];
                    if (fila) {
                        // Busca el span del stock (último hijo)
                        const spans = fila.querySelectorAll('span');
                        if (spans.length > 1) {
                            spans[1].textContent = prod.sucursalesStock[sucursalIdx].cantidad;
                        }
                    }
                } else {
                    // Si el stock llega a 0, eliminar la fila de la sucursal
                    prod.sucursalesStock.splice(sucursalIdx, 1);
                    sucursalesDiv.removeChild(sucursalesDiv.children[sucursalIdx]);
                }
                // Si ya no hay stock en ninguna sucursal, mostrar mensaje
                if (!prod.sucursalesStock.length) {
                    sucursalesDiv.innerHTML = '';
                    const noSuc = document.createElement('div');
                    noSuc.innerText = 'Sin stock en sucursales.';
                    noSuc.style.color = '#888';
                    sucursalesDiv.appendChild(noSuc);
                    btnAgregar.disabled = true;
                    btnAgregar.style.opacity = '0.5';
                    btnAgregar.style.cursor = 'not-allowed';
                }
                alert('Stock descontado correctamente.');
                // Si quieres cerrar el modal y recargar productos, descomenta:
                // document.body.removeChild(modal);
                // cargarProductos();
            } else {
                alert(data.error || 'Error al descontar el stock.');
            }
        })
        .catch(() => {
            alert('Error al descontar el stock.');
        });
    };

    modal.appendChild(card);
    document.body.appendChild(modal);
}
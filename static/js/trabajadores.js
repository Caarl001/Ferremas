window.addEventListener('DOMContentLoaded', function() {
  cargarSucursalesYTrabajadores();
});

function cargarSucursalesYTrabajadores() {
  // Obtener sucursales y trabajadores en paralelo
  Promise.all([
    fetch('/sucursales').then(res => res.json()),
    fetch('/trabajadores').then(res => res.json())
  ]).then(([sucursales, trabajadores]) => {
    const lista = document.getElementById('lista-trabajadores');
    if (!lista) return;
    lista.innerHTML = '';
    if (Array.isArray(sucursales) && sucursales.length > 0) {
      sucursales.forEach(suc => {
        // Crear el contenedor de la sucursal
        const li = document.createElement('li');
        li.style.marginBottom = '2em';
        li.style.background = 'rgba(15,22,40,0.92)'; // Color igual a "Nuestro Equipo"
        li.style.color = '#fff';
        li.style.borderRadius = '14px';
        li.style.padding = '1.2em 1.5em';
        li.style.boxShadow = '0 2px 12px #18284833';
        // Título de la sucursal
        const titulo = document.createElement('div');
        titulo.innerHTML = `<strong style='color:#fff;font-size:1.2em;'>${suc.nombre}</strong> <span style='color:#b0c4de;font-size:0.98em;'>(Tel: ${suc.telefono})</span><br><span style='color:#b0c4de;font-size:0.98em;'>${suc.direccion}</span>`;
        li.appendChild(titulo);
        // Botón desplegable
        const btn = document.createElement('button');
        btn.textContent = 'Ver trabajadores';
        btn.style.margin = '1em 0 0.5em 0';
        btn.style.background = '#457b9d';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '7px';
        btn.style.padding = '0.5em 1.3em';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '1em';
        btn.style.boxShadow = '0 2px 8px #0002';
        // Contenedor de trabajadores (oculto por defecto)
        const contTrab = document.createElement('ul');
        contTrab.style.display = 'none';
        contTrab.style.listStyle = 'none';
        contTrab.style.padding = '0';
        contTrab.style.margin = '1em 0 0 0';
        // Filtrar trabajadores de la sucursal
        const trabajadoresSucursal = trabajadores.filter(t => t.idSucursal == suc.idSucursal);
        if (trabajadoresSucursal.length > 0) {
          trabajadoresSucursal.forEach(trab => {
            const tli = document.createElement('li');
            tli.style.display = 'flex';
            tli.style.alignItems = 'center';
            tli.style.justifyContent = 'space-between';
            tli.style.gap = '1.2em';
            tli.style.marginBottom = '1em';
            tli.style.background = '#457b9d'; // Celeste igual al botón
            tli.style.color = '#fff';
            tli.style.borderRadius = '8px';
            tli.style.padding = '0.7em 1.2em';
            // Info del trabajador
            const info = document.createElement('div');
            info.style.display = 'flex';
            info.style.flexDirection = 'column';
            info.style.gap = '0.2em';
            info.innerHTML = `
              <span style='font-weight:bold;color:#fff;font-size:1.1em;'>${trab.nombre} ${trab.apellido}</span>
              <span style='color:#b0c4de;font-size:1em;font-weight:400;'>${trab.cargo}</span>
              <span style='color:#b0c4de;'>Fecha: ${trab.fecha_contratacion ? formatearFechaEsp(trab.fecha_contratacion) : '-'}</span>
              <span style='color:#43aa8b;'>Sueldo: $${trab.sueldo ? Number(trab.sueldo).toLocaleString('es-CL') : '-'}</span>
            `;
            tli.appendChild(info);
            // Contenedor de botones
            const btns = document.createElement('div');
            btns.style.display = 'flex';
            btns.style.gap = '0.5em';
            // Botón editar
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.style.background = '#f4a261';
            btnEditar.style.color = 'white';
            btnEditar.style.border = 'none';
            btnEditar.style.borderRadius = '6px';
            btnEditar.style.padding = '0.4em 1.1em';
            btnEditar.style.cursor = 'pointer';
            btnEditar.style.fontWeight = 'bold';
            btnEditar.onclick = function() {
              // Crear modal visual para edición de trabajador (igual que agregar)
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
              const inner = document.createElement('div');
              inner.style.background = '#fff';
              inner.style.borderRadius = '22px';
              inner.style.boxShadow = '0 2px 24px #18284855';
              inner.style.padding = '2.5em 2em 2em 2em';
              inner.style.display = 'flex';
              inner.style.flexDirection = 'column';
              inner.style.alignItems = 'center';
              inner.style.gap = '1.2em';
              inner.style.minWidth = '420px';
              inner.style.maxWidth = '600px';
              inner.innerHTML = `<h3 style='color:#182848;font-size:1.5em;font-weight:900;margin-bottom:0.5em;'>Editar trabajador</h3>`;
              // Formulario ordenado en filas
              const form = document.createElement('form');
              form.style.display = 'flex';
              form.style.flexDirection = 'column';
              form.style.gap = '1.2em';
              form.style.width = '100%';
              // Fila 1: Nombre y Apellido
              const fila1 = document.createElement('div');
              fila1.style.display = 'flex';
              fila1.style.gap = '1.2em';
              fila1.style.width = '100%';
              const inputNombre = document.createElement('input');
              inputNombre.type = 'text';
              inputNombre.placeholder = 'Nombre';
              inputNombre.required = true;
              inputNombre.value = trab.nombre;
              inputNombre.style.flex = '1 1 50%';
              inputNombre.style.background = '#fff';
              inputNombre.style.color = '#182848';
              inputNombre.style.border = '1.5px solid #b0c4de';
              inputNombre.style.borderRadius = '8px';
              inputNombre.style.padding = '0.9em 1.2em';
              inputNombre.style.fontSize = '1.1em';
              const inputApellido = document.createElement('input');
              inputApellido.type = 'text';
              inputApellido.placeholder = 'Apellido';
              inputApellido.required = true;
              inputApellido.value = trab.apellido;
              inputApellido.style.flex = '1 1 50%';
              inputApellido.style.background = '#fff';
              inputApellido.style.color = '#182848';
              inputApellido.style.border = '1.5px solid #b0c4de';
              inputApellido.style.borderRadius = '8px';
              inputApellido.style.padding = '0.9em 1.2em';
              inputApellido.style.fontSize = '1.1em';
              fila1.appendChild(inputNombre);
              fila1.appendChild(inputApellido);
              // Fila 2: Cargo y Fecha
              const fila2 = document.createElement('div');
              fila2.style.display = 'flex';
              fila2.style.gap = '1.2em';
              fila2.style.width = '100%';
              const inputCargo = document.createElement('input');
              inputCargo.type = 'text';
              inputCargo.placeholder = 'Cargo';
              inputCargo.required = true;
              inputCargo.value = trab.cargo;
              inputCargo.style.flex = '1 1 60%';
              inputCargo.style.background = '#fff';
              inputCargo.style.color = '#182848';
              inputCargo.style.border = '1.5px solid #b0c4de';
              inputCargo.style.borderRadius = '8px';
              inputCargo.style.padding = '0.9em 1.2em';
              inputCargo.style.fontSize = '1.1em';
              const inputFecha = document.createElement('input');
              inputFecha.type = 'date';
              inputFecha.required = true;
              // Usar la fecha tal cual viene del backend (YYYY-MM-DD)
              inputFecha.value = trab.fecha_contratacion ? trab.fecha_contratacion.slice(0,10) : (() => {
                const hoy = new Date();
                const yyyy = hoy.getFullYear();
                const mm = String(hoy.getMonth() + 1).padStart(2, '0');
                const dd = String(hoy.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
              })();
              inputFecha.style.flex = '1 1 40%';
              inputFecha.style.background = '#fff';
              inputFecha.style.color = '#182848';
              inputFecha.style.border = '1.5px solid #b0c4de';
              inputFecha.style.borderRadius = '8px';
              inputFecha.style.padding = '0.9em 1.2em';
              inputFecha.style.fontSize = '1.1em';
              fila2.appendChild(inputCargo);
              fila2.appendChild(inputFecha);
              // Fila 3: Sueldo y Sucursal
              const fila3 = document.createElement('div');
              fila3.style.display = 'flex';
              fila3.style.gap = '1.2em';
              fila3.style.width = '100%';
              const inputSueldo = document.createElement('input');
              inputSueldo.type = 'number';
              inputSueldo.placeholder = 'Sueldo';
              inputSueldo.required = true;
              inputSueldo.min = '0';
              inputSueldo.value = trab.sueldo || '';
              inputSueldo.style.flex = '1 1 60%';
              inputSueldo.style.background = '#fff';
              inputSueldo.style.color = '#182848';
              inputSueldo.style.border = '1.5px solid #b0c4de';
              inputSueldo.style.borderRadius = '8px';
              inputSueldo.style.padding = '0.9em 1.2em';
              inputSueldo.style.fontSize = '1.1em';
              const selectSucursal = document.createElement('select');
              selectSucursal.required = true;
              selectSucursal.style.flex = '1 1 40%';
              selectSucursal.style.background = '#fff';
              selectSucursal.style.color = '#182848';
              selectSucursal.style.border = '1.5px solid #b0c4de';
              selectSucursal.style.borderRadius = '8px';
              selectSucursal.style.padding = '0.9em 1.2em';
              selectSucursal.style.fontSize = '1.1em';
              selectSucursal.style.maxWidth = '220px'; // Limita el ancho máximo
              selectSucursal.style.minWidth = '120px'; // Ancho mínimo para responsividad
              selectSucursal.style.overflow = 'hidden';
              // Opciones de sucursal
              fetch('/sucursales').then(res => res.json()).then(sucursales => {
                selectSucursal.innerHTML = '';
                sucursales.forEach(sucOpt => {
                  const opt = document.createElement('option');
                  opt.value = sucOpt.idSucursal;
                  opt.textContent = sucOpt.nombre;
                  if (trab.idSucursal == sucOpt.idSucursal) opt.selected = true;
                  selectSucursal.appendChild(opt);
                });
              });
              fila3.appendChild(inputSueldo);
              fila3.appendChild(selectSucursal);
              // Mensaje de error
              const mensaje = document.createElement('div');
              mensaje.style.color = '#e63946';
              mensaje.style.fontWeight = 'bold';
              mensaje.style.display = 'none';
              // Botones
              const contBotones = document.createElement('div');
              contBotones.style.display = 'flex';
              contBotones.style.gap = '1em';
              contBotones.style.marginTop = '1em';
              contBotones.style.justifyContent = 'center';
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
              // Agregar filas y botones al formulario
              form.appendChild(fila1);
              form.appendChild(fila2);
              form.appendChild(fila3);
              form.appendChild(mensaje);
              form.appendChild(contBotones);
              inner.appendChild(form);
              modal.appendChild(inner);
              document.body.appendChild(modal);
              // Cancelar
              btnCancelar.onclick = function() {
                document.body.removeChild(modal);
              };
              // Guardar cambios
              form.onsubmit = function(ev) {
                ev.preventDefault();
                mensaje.style.display = 'none';
                if (!inputNombre.value.trim() || !inputApellido.value.trim() || !inputCargo.value.trim() || !inputFecha.value || !inputSueldo.value || !selectSucursal.value) {
                  mensaje.innerText = 'Completa todos los campos.';
                  mensaje.style.display = 'block';
                  return;
                }
                btnGuardar.disabled = true;
                btnGuardar.textContent = 'Guardando...';
                fetch(`/trabajadores/${trab.idTrabajador}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    nombre: inputNombre.value.trim(),
                    apellido: inputApellido.value.trim(),
                    cargo: inputCargo.value.trim(),
                    fecha_contratacion: inputFecha.value,
                    sueldo: Number(inputSueldo.value),
                    idSucursal: Number(selectSucursal.value)
                  })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.mensaje) {
                    document.body.removeChild(modal);
                    cargarSucursalesYTrabajadores();
                  } else {
                    mensaje.innerText = data.error || 'Error al editar el trabajador.';
                    mensaje.style.display = 'block';
                    btnGuardar.disabled = false;
                    btnGuardar.textContent = 'Guardar Cambios';
                  }
                })
                .catch(() => {
                  mensaje.innerText = 'Error al editar el trabajador.';
                  mensaje.style.display = 'block';
                  btnGuardar.disabled = false;
                  btnGuardar.textContent = 'Guardar Cambios';
                });
              };
            };
            // Botón borrar
            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.style.background = '#e63946';
            btnBorrar.style.color = 'white';
            btnBorrar.style.border = 'none';
            btnBorrar.style.borderRadius = '6px';
            btnBorrar.style.padding = '0.4em 1.1em';
            btnBorrar.style.cursor = 'pointer';
            btnBorrar.style.fontWeight = 'bold';
            btnBorrar.onclick = function() {
              if (confirm('¿Seguro que deseas borrar este trabajador?')) {
                btnBorrar.disabled = true;
                btnBorrar.textContent = 'Borrando...';
                fetch(`/trabajadores/${trab.idTrabajador}`, { method: 'DELETE' })
                  .then(res => res.json())
                  .then(() => cargarSucursalesYTrabajadores());
              }
            };
            btns.appendChild(btnEditar);
            btns.appendChild(btnBorrar);
            tli.appendChild(btns);
            contTrab.appendChild(tli);
          });
        } else {
          const tli = document.createElement('li');
          tli.textContent = 'No hay trabajadores en esta sucursal.';
          tli.style.color = '#888';
          contTrab.appendChild(tli);
        }
        // Mostrar/ocultar trabajadores
        btn.onclick = function() {
          contTrab.style.display = contTrab.style.display === 'none' ? 'block' : 'none';
          btn.textContent = contTrab.style.display === 'none' ? 'Ver trabajadores' : 'Ocultar trabajadores';
        };
        li.appendChild(btn);
        li.appendChild(contTrab);

        // Contenedor de botones de acción para la sucursal (ahora DENTRO del desplegable)
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'row';
        btnContainer.style.justifyContent = 'flex-end';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.gap = '0.7em';
        btnContainer.style.width = '100%';
        btnContainer.style.margin = '1.1em 0 0.5em 0';

        // Botón agregar trabajador
        const btnAgregar = document.createElement('button');
        btnAgregar.textContent = 'Agregar';
        btnAgregar.style.background = '#43aa8b';
        btnAgregar.style.color = 'white';
        btnAgregar.style.border = 'none';
        btnAgregar.style.borderRadius = '7px';
        btnAgregar.style.padding = '0.5em 1.3em';
        btnAgregar.style.cursor = 'pointer';
        btnAgregar.style.fontWeight = 'bold';
        btnAgregar.style.fontSize = '1em';
        btnAgregar.style.boxShadow = '0 2px 8px #0002';
        btnAgregar.style.minWidth = '100px';
        btnAgregar.onclick = function() {
          // Modal visual para agregar trabajador
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
          const inner = document.createElement('div');
          inner.style.background = '#fff';
          inner.style.borderRadius = '22px';
          inner.style.boxShadow = '0 2px 24px #18284855';
          inner.style.padding = '2.5em 2em 2em 2em';
          inner.style.display = 'flex';
          inner.style.flexDirection = 'column';
          inner.style.alignItems = 'center';
          inner.style.gap = '1.2em';
          inner.style.minWidth = '420px'; // Más ancho
          inner.style.maxWidth = '600px';
          inner.innerHTML = `<h3 style='color:#182848;font-size:1.5em;font-weight:900;margin-bottom:0.5em;'>Agregar trabajador</h3>`;
          // Formulario ordenado
          const form = document.createElement('form');
          form.style.display = 'flex';
          form.style.flexDirection = 'column';
          form.style.gap = '1.2em';
          form.style.width = '100%';
          // Fila 1: Nombre y Apellido
          const fila1 = document.createElement('div');
          fila1.style.display = 'flex';
          fila1.style.gap = '1.2em';
          fila1.style.width = '100%';
          const inputNombre = document.createElement('input');
          inputNombre.type = 'text';
          inputNombre.placeholder = 'Nombre';
          inputNombre.required = true;
          inputNombre.style.flex = '1 1 50%';
          inputNombre.style.background = '#fff';
          inputNombre.style.color = '#182848';
          inputNombre.style.border = '1.5px solid #b0c4de';
          inputNombre.style.borderRadius = '8px';
          inputNombre.style.padding = '0.9em 1.2em';
          inputNombre.style.fontSize = '1.1em';
          const inputApellido = document.createElement('input');
          inputApellido.type = 'text';
          inputApellido.placeholder = 'Apellido';
          inputApellido.required = true;
          inputApellido.style.flex = '1 1 50%';
          inputApellido.style.background = '#fff';
          inputApellido.style.color = '#182848';
          inputApellido.style.border = '1.5px solid #b0c4de';
          inputApellido.style.borderRadius = '8px';
          inputApellido.style.padding = '0.9em 1.2em';
          inputApellido.style.fontSize = '1.1em';
          fila1.appendChild(inputNombre);
          fila1.appendChild(inputApellido);
          // Fila 2: Cargo y Fecha
          const fila2 = document.createElement('div');
          fila2.style.display = 'flex';
          fila2.style.gap = '1.2em';
          fila2.style.width = '100%';
          const inputCargo = document.createElement('input');
          inputCargo.type = 'text';
          inputCargo.placeholder = 'Cargo';
          inputCargo.required = true;
          inputCargo.style.flex = '1 1 60%';
          inputCargo.style.background = '#fff';
          inputCargo.style.color = '#182848';
          inputCargo.style.border = '1.5px solid #b0c4de';
          inputCargo.style.borderRadius = '8px';
          inputCargo.style.padding = '0.9em 1.2em';
          inputCargo.style.fontSize = '1.1em';
          const inputFecha = document.createElement('input');
          inputFecha.type = 'date';
          // Obtener fecha local en formato YYYY-MM-DD
          const hoy = new Date();
          const yyyy = hoy.getFullYear();
          const mm = String(hoy.getMonth() + 1).padStart(2, '0');
          const dd = String(hoy.getDate()).padStart(2, '0');
          inputFecha.value = `${yyyy}-${mm}-${dd}`;
          inputFecha.required = true;
          inputFecha.style.flex = '1 1 40%';
          inputFecha.style.background = '#fff';
          inputFecha.style.color = '#182848';
          inputFecha.style.border = '1.5px solid #b0c4de';
          inputFecha.style.borderRadius = '8px';
          inputFecha.style.padding = '0.9em 1.2em';
          inputFecha.style.fontSize = '1.1em';
          fila2.appendChild(inputCargo);
          fila2.appendChild(inputFecha);
          // Fila 3: Sueldo
          const fila3 = document.createElement('div');
          fila3.style.display = 'flex';
          fila3.style.gap = '1.2em';
          fila3.style.width = '100%';
          const inputSueldo = document.createElement('input');
          inputSueldo.type = 'number';
          inputSueldo.placeholder = 'Sueldo';
          inputSueldo.required = true;
          inputSueldo.min = '0';
          inputSueldo.style.flex = '1 1 100%';
          inputSueldo.style.background = '#fff';
          inputSueldo.style.color = '#182848';
          inputSueldo.style.border = '1.5px solid #b0c4de';
          inputSueldo.style.borderRadius = '8px';
          inputSueldo.style.padding = '0.9em 1.2em';
          inputSueldo.style.fontSize = '1.1em';
          fila3.appendChild(inputSueldo);
          // Botones
          const contBotones = document.createElement('div');
          contBotones.style.display = 'flex';
          contBotones.style.gap = '1em';
          contBotones.style.marginTop = '1em';
          contBotones.style.justifyContent = 'center';
          const btnGuardar = document.createElement('button');
          btnGuardar.type = 'submit';
          btnGuardar.textContent = 'Agregar';
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
          btnCancelar.textContent = 'Cancelar';
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
          // Mensaje de error
          const mensaje = document.createElement('div');
          mensaje.style.color = '#e63946';
          mensaje.style.fontWeight = 'bold';
          mensaje.style.display = 'none';
          // Agregar filas y botones al formulario
          form.appendChild(fila1);
          form.appendChild(fila2);
          form.appendChild(fila3);
          form.appendChild(mensaje);
          form.appendChild(contBotones);
          inner.appendChild(form);
          modal.appendChild(inner);
          document.body.appendChild(modal);
          // Cancelar
          btnCancelar.onclick = function() {
            document.body.removeChild(modal);
          };
          // Guardar
          form.onsubmit = function(ev) {
            ev.preventDefault();
            mensaje.style.display = 'none';
            if (!inputNombre.value.trim() || !inputApellido.value.trim() || !inputCargo.value.trim() || !inputFecha.value || !inputSueldo.value) {
              mensaje.innerText = 'Completa todos los campos.';
              mensaje.style.display = 'block';
              return;
            }
            btnGuardar.disabled = true;
            btnGuardar.textContent = 'Agregando...';
            fetch('/trabajadores', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nombre: inputNombre.value,
                apellido: inputApellido.value,
                cargo: inputCargo.value,
                fecha_contratacion: inputFecha.value,
                sueldo: parseFloat(inputSueldo.value),
                idSucursal: suc.idSucursal
              })
            })
            .then(res => res.json())
            .then(data => {
              if (data.mensaje) {
                document.body.removeChild(modal);
                cargarSucursalesYTrabajadores();
              } else {
                mensaje.innerText = data.error || 'Error al agregar el trabajador.';
                mensaje.style.display = 'block';
                btnGuardar.disabled = false;
                btnGuardar.textContent = 'Agregar';
              }
            })
            .catch(() => {
              mensaje.innerText = 'Error al agregar el trabajador.';
              mensaje.style.display = 'block';
              btnGuardar.disabled = false;
              btnGuardar.textContent = 'Agregar';
            });
          };
        };
        // Botón refrescar
        const btnRefrescar = document.createElement('button');
        btnRefrescar.textContent = 'Refrescar';
        btnRefrescar.style.background = '#457b9d';
        btnRefrescar.style.color = 'white';
        btnRefrescar.style.border = 'none';
        btnRefrescar.style.borderRadius = '7px';
        btnRefrescar.style.padding = '0.5em 1.3em';
        btnRefrescar.style.cursor = 'pointer';
        btnRefrescar.style.fontWeight = 'bold';
        btnRefrescar.style.fontSize = '1em';
        btnRefrescar.style.boxShadow = '0 2px 8px #0002';
        btnRefrescar.style.minWidth = '100px';
        btnRefrescar.onclick = function() {
          btnRefrescar.disabled = true;
          btnRefrescar.textContent = 'Actualizando...';
          setTimeout(() => cargarSucursalesYTrabajadores(), 400);
        };
        // Agregar solo los botones Agregar y Refrescar
        btnContainer.appendChild(btnAgregar);
        btnContainer.appendChild(btnRefrescar);
        contTrab.appendChild(btnContainer);
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = '<li>No hay sucursales registradas.</li>';
    }
  }).catch(() => {
    const lista = document.getElementById('lista-trabajadores');
    if (lista) lista.innerHTML = '<li>Error al cargar sucursales o trabajadores.</li>';
  });
}

// Función para formatear fecha a español (DD/MM/YYYY)
function formatearFechaEsp(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d)) return fecha;
  return d.toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
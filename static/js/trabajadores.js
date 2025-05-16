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
              // Crear modal visual para edición
              const modal = document.createElement('div');
              modal.style.position = 'fixed';
              modal.style.top = '0';
              modal.style.left = '0';
              modal.style.width = '100vw';
              modal.style.height = '100vh';
              modal.style.background = 'rgba(0,0,0,0.5)';
              modal.style.display = 'flex';
              modal.style.alignItems = 'center';
              modal.style.justifyContent = 'center';
              modal.style.zIndex = '9999';
              const inner = document.createElement('div');
              inner.style.background = '#182848'; // Azul oscuro
              inner.style.padding = '2em 2em 1.5em 2em';
              inner.style.borderRadius = '14px';
              inner.style.display = 'flex';
              inner.style.flexDirection = 'column';
              inner.style.gap = '1em';
              inner.style.minWidth = '320px';
              inner.style.boxShadow = '0 2px 12px #18284833';
              inner.innerHTML = `<h3 style='color:#fff;margin-bottom:0.5em;'>Editar trabajador</h3>`;
              // Campos
              const inputNombre = document.createElement('input');
              inputNombre.type = 'text';
              inputNombre.value = trab.nombre;
              inputNombre.placeholder = 'Nombre';
              inputNombre.style.marginBottom = '0.5em';
              inputNombre.style.background = '#fff';
              inputNombre.style.color = '#182848';
              inputNombre.style.border = 'none';
              inputNombre.style.borderRadius = '6px';
              inputNombre.style.padding = '0.7em 1em';
              inputNombre.style.fontSize = '1em';
              const inputApellido = document.createElement('input');
              inputApellido.type = 'text';
              inputApellido.value = trab.apellido;
              inputApellido.placeholder = 'Apellido';
              inputApellido.style.marginBottom = '0.5em';
              inputApellido.style.background = '#fff';
              inputApellido.style.color = '#182848';
              inputApellido.style.border = 'none';
              inputApellido.style.borderRadius = '6px';
              inputApellido.style.padding = '0.7em 1em';
              inputApellido.style.fontSize = '1em';
              const inputCargo = document.createElement('input');
              inputCargo.type = 'text';
              inputCargo.value = trab.cargo;
              inputCargo.placeholder = 'Cargo';
              inputCargo.style.marginBottom = '0.5em';
              inputCargo.style.background = '#fff';
              inputCargo.style.color = '#182848';
              inputCargo.style.border = 'none';
              inputCargo.style.borderRadius = '6px';
              inputCargo.style.padding = '0.7em 1em';
              inputCargo.style.fontSize = '1em';
              const inputFecha = document.createElement('input');
              inputFecha.type = 'date';
              inputFecha.value = trab.fecha_contratacion ? trab.fecha_contratacion.substring(0,10) : '';
              inputFecha.style.marginBottom = '0.5em';
              inputFecha.style.background = '#fff';
              inputFecha.style.color = '#182848';
              inputFecha.style.border = 'none';
              inputFecha.style.borderRadius = '6px';
              inputFecha.style.padding = '0.7em 1em';
              inputFecha.style.fontSize = '1em';
              const inputSueldo = document.createElement('input');
              inputSueldo.type = 'number';
              inputSueldo.value = trab.sueldo;
              inputSueldo.placeholder = 'Sueldo';
              inputSueldo.style.marginBottom = '0.5em';
              inputSueldo.style.background = '#fff';
              inputSueldo.style.color = '#182848';
              inputSueldo.style.border = 'none';
              inputSueldo.style.borderRadius = '6px';
              inputSueldo.style.padding = '0.7em 1em';
              inputSueldo.style.fontSize = '1em';
              // Botón guardar
              const btnGuardar = document.createElement('button');
              btnGuardar.textContent = 'Guardar';
              btnGuardar.style.background = '#43aa8b';
              btnGuardar.style.color = 'white';
              btnGuardar.style.border = 'none';
              btnGuardar.style.borderRadius = '6px';
              btnGuardar.style.padding = '0.5em 1.3em';
              btnGuardar.style.cursor = 'pointer';
              btnGuardar.style.fontWeight = 'bold';
              btnGuardar.onclick = function() {
                if (inputNombre.value && inputApellido.value && inputCargo.value && inputFecha.value && inputSueldo.value) {
                  btnGuardar.disabled = true;
                  btnGuardar.textContent = 'Editando...';
                  fetch(`/trabajadores/${trab.idTrabajador}`, {
                    method: 'PUT',
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
                  .then(() => {
                    document.body.removeChild(modal);
                    cargarSucursalesYTrabajadores();
                  });
                }
              };
              // Botón cancelar
              const btnCancelar = document.createElement('button');
              btnCancelar.textContent = 'Cancelar';
              btnCancelar.style.background = '#e63946';
              btnCancelar.style.color = 'white';
              btnCancelar.style.border = 'none';
              btnCancelar.style.borderRadius = '6px';
              btnCancelar.style.padding = '0.5em 1.3em';
              btnCancelar.style.cursor = 'pointer';
              btnCancelar.style.fontWeight = 'bold';
              btnCancelar.onclick = function() {
                document.body.removeChild(modal);
              };
              inner.appendChild(inputNombre);
              inner.appendChild(inputApellido);
              inner.appendChild(inputCargo);
              inner.appendChild(inputFecha);
              inner.appendChild(inputSueldo);
              inner.appendChild(btnGuardar);
              inner.appendChild(btnCancelar);
              modal.appendChild(inner);
              document.body.appendChild(modal);
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
          modal.style.background = 'rgba(0,0,0,0.5)';
          modal.style.display = 'flex';
          modal.style.alignItems = 'center';
          modal.style.justifyContent = 'center';
          modal.style.zIndex = '9999';
          const inner = document.createElement('div');
          inner.style.background = '#182848'; // Azul oscuro
          inner.style.padding = '2em 2em 1.5em 2em';
          inner.style.borderRadius = '14px';
          inner.style.display = 'flex';
          inner.style.flexDirection = 'column';
          inner.style.gap = '1em';
          inner.style.minWidth = '320px';
          inner.style.boxShadow = '0 2px 12px #18284833';
          inner.innerHTML = `<h3 style='color:#fff;margin-bottom:0.5em;'>Agregar trabajador</h3>`;
          // Campos
          const inputNombre = document.createElement('input');
          inputNombre.type = 'text';
          inputNombre.placeholder = 'Nombre';
          inputNombre.style.marginBottom = '0.5em';
          inputNombre.style.background = '#fff';
          inputNombre.style.color = '#182848';
          inputNombre.style.border = 'none';
          inputNombre.style.borderRadius = '6px';
          inputNombre.style.padding = '0.7em 1em';
          inputNombre.style.fontSize = '1em';
          const inputApellido = document.createElement('input');
          inputApellido.type = 'text';
          inputApellido.placeholder = 'Apellido';
          inputApellido.style.marginBottom = '0.5em';
          inputApellido.style.background = '#fff';
          inputApellido.style.color = '#182848';
          inputApellido.style.border = 'none';
          inputApellido.style.borderRadius = '6px';
          inputApellido.style.padding = '0.7em 1em';
          inputApellido.style.fontSize = '1em';
          const inputCargo = document.createElement('input');
          inputCargo.type = 'text';
          inputCargo.placeholder = 'Cargo';
          inputCargo.style.marginBottom = '0.5em';
          inputCargo.style.background = '#fff';
          inputCargo.style.color = '#182848';
          inputCargo.style.border = 'none';
          inputCargo.style.borderRadius = '6px';
          inputCargo.style.padding = '0.7em 1em';
          inputCargo.style.fontSize = '1em';
          const inputFecha = document.createElement('input');
          inputFecha.type = 'date';
          inputFecha.value = new Date().toISOString().slice(0,10);
          inputFecha.style.marginBottom = '0.5em';
          inputFecha.style.background = '#fff';
          inputFecha.style.color = '#182848';
          inputFecha.style.border = 'none';
          inputFecha.style.borderRadius = '6px';
          inputFecha.style.padding = '0.7em 1em';
          inputFecha.style.fontSize = '1em';
          const inputSueldo = document.createElement('input');
          inputSueldo.type = 'number';
          inputSueldo.placeholder = 'Sueldo';
          inputSueldo.style.marginBottom = '0.5em';
          inputSueldo.style.background = '#fff';
          inputSueldo.style.color = '#182848';
          inputSueldo.style.border = 'none';
          inputSueldo.style.borderRadius = '6px';
          inputSueldo.style.padding = '0.7em 1em';
          inputSueldo.style.fontSize = '1em';
          // Botón guardar
          const btnGuardar = document.createElement('button');
          btnGuardar.textContent = 'Agregar';
          btnGuardar.style.background = '#43aa8b';
          btnGuardar.style.color = 'white';
          btnGuardar.style.border = 'none';
          btnGuardar.style.borderRadius = '6px';
          btnGuardar.style.padding = '0.5em 1.3em';
          btnGuardar.style.cursor = 'pointer';
          btnGuardar.style.fontWeight = 'bold';
          btnGuardar.onclick = function() {
            if (inputNombre.value && inputApellido.value && inputCargo.value && inputFecha.value && inputSueldo.value) {
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
              .then(() => {
                document.body.removeChild(modal);
                cargarSucursalesYTrabajadores();
              });
            }
          };
          // Botón cancelar
          const btnCancelar = document.createElement('button');
          btnCancelar.textContent = 'Cancelar';
          btnCancelar.style.background = '#e63946';
          btnCancelar.style.color = 'white';
          btnCancelar.style.border = 'none';
          btnCancelar.style.borderRadius = '6px';
          btnCancelar.style.padding = '0.5em 1.3em';
          btnCancelar.style.cursor = 'pointer';
          btnCancelar.style.fontWeight = 'bold';
          btnCancelar.onclick = function() {
            document.body.removeChild(modal);
          };
          inner.appendChild(inputNombre);
          inner.appendChild(inputApellido);
          inner.appendChild(inputCargo);
          inner.appendChild(inputFecha);
          inner.appendChild(inputSueldo);
          inner.appendChild(btnGuardar);
          inner.appendChild(btnCancelar);
          modal.appendChild(inner);
          document.body.appendChild(modal);
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
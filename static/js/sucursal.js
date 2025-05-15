// Espera a que el DOM esté listo

window.addEventListener('DOMContentLoaded', function() {
  cargarSucursales();
    
  // Manejar el formulario para agregar sucursal
  const form = document.getElementById('form-agregar-sucursal');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const direccion = document.getElementById('direccion').value;
      const telefono = document.getElementById('telefono').value;
      fetch('/sucursales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, direccion, telefono })
      })
      .then(res => res.json())
      .then(() => {
        form.reset();
        cargarSucursales();
      });
    });
  }
});

function cargarSucursales() {
  fetch('/sucursales')
    .then(response => response.json())
    .then(data => {
      const lista = document.getElementById('lista-sucursales');
      lista.innerHTML = '';
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(idSucursal => {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>Nombre:</strong> <span style="color:#2d6a4f">${idSucursal.nombre}</span><br>
            <strong>Dirección:</strong> <span style="color:#457b9d">${idSucursal.direccion}</span><br>
            <strong>Teléfono:</strong> <span style="color:#e76f51">${idSucursal.telefono}</span>
          `;
          // Botón borrar
          const btnBorrar = document.createElement('button');
          btnBorrar.textContent = 'Borrar';
          btnBorrar.style.marginLeft = '1em';
          btnBorrar.style.background = '#e63946';
          btnBorrar.style.color = 'white';
          btnBorrar.style.border = 'none';
          btnBorrar.style.borderRadius = '5px';
          btnBorrar.style.padding = '0.3em 0.8em';
          btnBorrar.style.cursor = 'pointer';
          btnBorrar.onclick = function() {
            if (confirm('¿Seguro que quieres borrar esta sucursal?')) {
              fetch(`/sucursales/${sucursal.id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(() => cargarSucursales());
            }
          };
          // Botón refrescar
          const btnRefrescar = document.createElement('button');
          btnRefrescar.textContent = 'Refrescar';
          btnRefrescar.style.marginLeft = '0.5em';
          btnRefrescar.style.background = '#457b9d';
          btnRefrescar.style.color = 'white';
          btnRefrescar.style.border = 'none';
          btnRefrescar.style.borderRadius = '5px';
          btnRefrescar.style.padding = '0.3em 0.8em';
          btnRefrescar.style.cursor = 'pointer';
          btnRefrescar.onclick = function() {
            cargarSucursales();
          };
          // Botón editar
          const btnEditar = document.createElement('button');
          btnEditar.textContent = 'Editar';
          btnEditar.style.marginLeft = '0.5em';
          btnEditar.style.background = '#f4a261';
          btnEditar.style.color = 'white';
          btnEditar.style.border = 'none';
          btnEditar.style.borderRadius = '5px';
          btnEditar.style.padding = '0.3em 0.8em';
          btnEditar.style.cursor = 'pointer';
          btnEditar.onclick = function() {
            const nuevoNombre = prompt('Nuevo nombre:', sucursal.nombre);
            const nuevaDireccion = prompt('Nueva dirección:', sucursal.direccion);
            const nuevoTelefono = prompt('Nuevo teléfono:', sucursal.telefono);
            if (nuevoNombre && nuevaDireccion && nuevoTelefono) {
              fetch(`/sucursales/${sucursal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevoNombre, direccion: nuevaDireccion, telefono: nuevoTelefono })
              })
              .then(res => res.json())
              .then(() => cargarSucursales());
            }
          };
          li.appendChild(btnBorrar);
          li.appendChild(btnRefrescar);
          li.appendChild(btnEditar);
          li.style.marginBottom = '1.5em';
          li.style.background = '#f1faee';
          li.style.padding = '1em';
          li.style.borderRadius = '8px';
          lista.appendChild(li);
        });
      } else {
        lista.innerHTML = '<li>No hay sucursales registradas.</li>';
      }
    })
    .catch(err => {
      document.getElementById('lista-sucursales').innerHTML = '<li>Error al cargar sucursales.</li>';
    });
}

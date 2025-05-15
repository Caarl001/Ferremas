
  // Espera a que el DOM esté listo
  window.addEventListener('DOMContentLoaded', function() {
    fetch('/sucursales')
      .then(response => response.json())
      .then(data => {
        const lista = document.getElementById('lista-sucursales');
        lista.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(sucursal => {
            const li = document.createElement('li');
            li.textContent = `${sucursal.nombre} - ${sucursal.direccion} - ${sucursal.telefono}`;
            lista.appendChild(li);
          });
        } else {
          lista.innerHTML = '<li>No hay sucursales registradas.</li>';
        }
      })
      .catch(err => {
        document.getElementById('lista-sucursales').innerHTML = '<li>Error al cargar sucursales.</li>';
      });
  });

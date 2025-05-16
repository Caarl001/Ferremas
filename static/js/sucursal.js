// Espera a que el DOM esté listo

window.addEventListener('DOMContentLoaded', function() {
  cargarSucursales();
  
  // Manejar el formulario para agregar sucursal SOLO con nombre, dirección y teléfono
  const form = document.getElementById('form-agregar-sucursal');
  window.imagenesProyecto = [
    'static/img/sucursal01.webp',
    'static/img/sucursal02.webp',
    'static/img/sucursal03.webp',
    'static/img/sucursal04.webp',
    'static/img/sucursal05.webp',
    'static/img/sucursal06.webp',
    'static/img/sucursal07.webp',
    'static/img/sucursal08.webp',
    'static/img/sucursal09.webp',
    'static/img/sucursal10.webp',
  ];
  if (form) {
    // Si ya existe un select de imagen, no lo agregues de nuevo
    if (!document.getElementById('imagen')) {
      // Reorganizar inputs: nombre y direccion en una fila, telefono y select imagen en otra, boton agregar al lado
      const divInputs = form.querySelector('div');
      // Crear contenedor para la fila 1 (nombre y direccion)
      const fila1 = document.createElement('div');
      fila1.style.display = 'flex';
      fila1.style.gap = '1em';
      fila1.style.width = '100%';
      fila1.style.marginBottom = '1em';
      // Mover nombre y direccion
      const inputNombre = document.getElementById('nombre');
      const inputDireccion = document.getElementById('direccion');
      fila1.appendChild(inputNombre);
      fila1.appendChild(inputDireccion);
      divInputs.parentNode.insertBefore(fila1, divInputs);
      // Crear contenedor para la fila 2 (telefono, select imagen, boton agregar)
      const fila2 = document.createElement('div');
      fila2.style.display = 'flex';
      fila2.style.gap = '1em';
      fila2.style.width = '100%';
      // Mover telefono
      const inputTelefono = document.getElementById('telefono');
      fila2.appendChild(inputTelefono);
      // Select imagen
      const select = document.createElement('select');
      select.id = 'imagen';
      select.name = 'imagen';
      select.required = false;
      select.style.width = '180px';
      select.style.height = '2.7em';
      select.style.padding = '0.6em 1em';
      select.style.borderRadius = '8px';
      select.style.border = '1px solid #bdbdbd';
      select.style.fontSize = '1.1em';
      select.style.marginBottom = '0';
      const optionDefault = document.createElement('option');
      optionDefault.value = '';
      optionDefault.textContent = 'Selecciona imagen';
      optionDefault.disabled = true;
      optionDefault.selected = true;
      select.appendChild(optionDefault);
      (window.imagenesProyecto || []).forEach(img => {
        const opt = document.createElement('option');
        opt.value = img;
        opt.textContent = img.replace('static/img/', '');
        select.appendChild(opt);
      });
      fila2.appendChild(select);
      // Botón agregar
      const btnAgregar = form.querySelector('button[type="submit"]');
      btnAgregar.style.marginTop = '0';
      btnAgregar.style.height = '2.7em';
      btnAgregar.style.alignSelf = 'center';
      fila2.appendChild(btnAgregar);
      divInputs.parentNode.insertBefore(fila2, divInputs);
      // Eliminar el div original de inputs
      divInputs.remove();
    }
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const direccion = document.getElementById('direccion').value;
      const telefono = document.getElementById('telefono').value;
      const imagen = document.getElementById('imagen') ? document.getElementById('imagen').value : '';
      fetch('/sucursales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, direccion, telefono, imagen })
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
      lista.style.display = 'flex';
      lista.style.flexWrap = 'wrap';
      lista.style.justifyContent = 'center';
      lista.style.gap = '2.5em';
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(idSucursal => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.flexDirection = 'column';
          li.style.alignItems = 'center';
          li.style.width = '440px'; // Más ancho para que quepan 3 por fila
          li.style.margin = '0';
          // Imagen de la sucursal (MUCHO más grande, sin borde, con sombra mínima)
          let img;
          if (idSucursal.imagen) {
            img = document.createElement('img');
            img.src = idSucursal.imagen;
            img.alt = 'Imagen sucursal';
            img.style.width = '100%';
            img.style.maxWidth = '100%';
            img.style.height = '380px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '22px';
            img.style.display = 'block';
            img.style.margin = '0 auto 1.2em auto';
            img.style.cursor = 'pointer';
            img.style.border = 'none';
            img.style.boxShadow = '0 6px 32px 0 rgba(24,40,72,0.18)';
            img.style.background = 'transparent';
            img.onclick = function() {
              // Mostrar imagen en grande en un modal simple
              const modal = document.createElement('div');
              modal.style.position = 'fixed';
              modal.style.top = '0';
              modal.style.left = '0';
              modal.style.width = '100vw';
              modal.style.height = '100vh';
              modal.style.background = 'rgba(0,0,0,0.8)';
              modal.style.display = 'flex';
              modal.style.alignItems = 'center';
              modal.style.justifyContent = 'center';
              modal.style.zIndex = '9999';
              const imgGrande = document.createElement('img');
              imgGrande.src = img.src;
              imgGrande.style.maxWidth = '90vw';
              imgGrande.style.maxHeight = '90vh';
              imgGrande.style.borderRadius = '18px';
              imgGrande.style.boxShadow = '0 4px 32px #000a';
              imgGrande.style.border = '5px solid #fff';
              modal.appendChild(imgGrande);
              modal.onclick = function() { document.body.removeChild(modal); };
              document.body.appendChild(modal);
            };
          } else {
            img = document.createElement('div');
            img.textContent = 'Sin imagen';
            img.style.width = '100%';
            img.style.height = '380px';
            img.style.background = 'rgba(120,130,150,0.13)';
            img.style.color = '#fff';
            img.style.display = 'flex';
            img.style.alignItems = 'center';
            img.style.justifyContent = 'center';
            img.style.fontWeight = 'bold';
            img.style.fontSize = '1.3em';
            img.style.borderRadius = '22px';
            img.style.margin = '0 auto 1.2em auto';
            img.style.border = 'none';
            img.style.boxShadow = '0 6px 32px 0 rgba(24,40,72,0.18)';
          }
          li.appendChild(img);

          // Contenedor horizontal para datos y botones
          const filaInfo = document.createElement('div');
          filaInfo.style.display = 'flex';
          filaInfo.style.flexDirection = 'row';
          filaInfo.style.justifyContent = 'space-between';
          filaInfo.style.alignItems = 'flex-start';
          filaInfo.style.width = '100%';
          filaInfo.style.gap = '1.5em';

          // Datos de la sucursal (texto blanco, alineado a la izquierda, con etiquetas)
          const datosDiv = document.createElement('div');
          datosDiv.innerHTML = `
            <span style=\"color:#b0c4de;font-size:1.1em;\">Nombre:</span> <strong style=\"color:#fff;font-size:1.25em;\">${idSucursal.nombre}</strong><br>
            <span style=\"color:#b0c4de;font-size:1.1em;\">Dirección:</span> <span style=\"color:#e0e0e0;\">${idSucursal.direccion}</span><br>
            <span style=\"color:#b0c4de;font-size:1.1em;\">Teléfono:</span> <span style=\"color:#b0c4de;\">${idSucursal.telefono}</span>
          `;
          datosDiv.style.textAlign = 'left';
          datosDiv.style.margin = '1.2em 0 0.5em 0';
          datosDiv.style.width = '100%';
          li.appendChild(datosDiv);

          // Contenedor de botones (alineado a la derecha, debajo del teléfono)
          const btnContainer = document.createElement('div');
          btnContainer.style.display = 'flex';
          btnContainer.style.flexDirection = 'row';
          btnContainer.style.justifyContent = 'flex-end';
          btnContainer.style.alignItems = 'center';
          btnContainer.style.gap = '0.7em';
          btnContainer.style.width = '100%';
          btnContainer.style.margin = '1.1em 0 0.5em 0';

          // Botón editar
          const btnEditar = document.createElement('button');
          btnEditar.textContent = 'Editar';
          btnEditar.style.background = '#f4a261';
          btnEditar.style.color = 'white';
          btnEditar.style.border = 'none';
          btnEditar.style.borderRadius = '7px';
          btnEditar.style.padding = '0.5em 1.3em';
          btnEditar.style.cursor = 'pointer';
          btnEditar.style.fontWeight = 'bold';
          btnEditar.style.fontSize = '1em';
          btnEditar.style.boxShadow = '0 2px 8px #0002';
          btnEditar.style.minWidth = '100px';
          btnEditar.onclick = function() {
            const nuevoNombre = prompt('Nuevo nombre:', idSucursal.nombre);
            const nuevaDireccion = prompt('Nueva dirección:', idSucursal.direccion);
            const nuevoTelefono = prompt('Nuevo teléfono:', idSucursal.telefono);
            // Selector visual para imagen
            let nuevaImagen = idSucursal.imagen || '';
            let selectorImagen = document.createElement('select');
            selectorImagen.style.margin = '1em 0';
            selectorImagen.style.fontSize = '1em';
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'No cambiar imagen';
            selectorImagen.appendChild(optionDefault);
            (window.imagenesProyecto || []).forEach(img => {
              const opt = document.createElement('option');
              opt.value = img;
              opt.textContent = img.replace('static/img/', '');
              if (img === idSucursal.imagen) opt.selected = true;
              selectorImagen.appendChild(opt);
            });
            // Mostrar prompt visual para imagen
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.7)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';
            const inner = document.createElement('div');
            inner.style.background = '#fff';
            inner.style.padding = '2em';
            inner.style.borderRadius = '12px';
            inner.style.display = 'flex';
            inner.style.flexDirection = 'column';
            inner.style.alignItems = 'center';
            inner.innerHTML = `<h3 style='margin-bottom:1em'>Editar imagen de sucursal</h3>`;
            inner.appendChild(selectorImagen);
            const btnOk = document.createElement('button');
            btnOk.textContent = 'Guardar cambios';
            btnOk.style.margin = '1em 0 0 0';
            btnOk.style.background = '#1976D2';
            btnOk.style.color = 'white';
            btnOk.style.border = 'none';
            btnOk.style.borderRadius = '6px';
            btnOk.style.padding = '0.6em 1.5em';
            btnOk.style.fontSize = '1em';
            btnOk.style.cursor = 'pointer';
            btnOk.onclick = function() {
              nuevaImagen = selectorImagen.value || idSucursal.imagen;
              document.body.removeChild(modal);
              if (nuevoNombre && nuevaDireccion && nuevoTelefono) {
                btnEditar.disabled = true;
                btnEditar.textContent = 'Editando...';
                fetch(`/sucursales/${idSucursal.idSucursal}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nombre: nuevoNombre, direccion: nuevaDireccion, telefono: nuevoTelefono, imagen: nuevaImagen })
                })
                .then(res => res.json())
                .then(resp => {
                  li.style.transition = 'background 0.3s';
                  li.style.background = '#ffe066';
                  setTimeout(() => cargarSucursales(), 400);
                });
              }
            };
            inner.appendChild(btnOk);
            const btnCancel = document.createElement('button');
            btnCancel.textContent = 'Cancelar';
            btnCancel.style.margin = '0.5em 0 0 0';
            btnCancel.style.background = '#e63946';
            btnCancel.style.color = 'white';
            btnCancel.style.border = 'none';
            btnCancel.style.borderRadius = '6px';
            btnCancel.style.padding = '0.6em 1.5em';
            btnCancel.style.fontSize = '1em';
            btnCancel.style.cursor = 'pointer';
            btnCancel.onclick = function() {
              document.body.removeChild(modal);
            };
            inner.appendChild(btnCancel);
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
            li.style.transition = 'background 0.3s';
            li.style.background = '#bde0fe';
            setTimeout(() => {
              cargarSucursales();
            }, 400);
          };

          // Botón borrar
          const btnBorrar = document.createElement('button');
          btnBorrar.textContent = 'Borrar';
          btnBorrar.style.background = '#e63946';
          btnBorrar.style.color = 'white';
          btnBorrar.style.border = 'none';
          btnBorrar.style.borderRadius = '7px';
          btnBorrar.style.padding = '0.5em 1.3em';
          btnBorrar.style.cursor = 'pointer';
          btnBorrar.style.fontWeight = 'bold';
          btnBorrar.style.fontSize = '1em';
          btnBorrar.style.boxShadow = '0 2px 8px #0002';
          btnBorrar.style.minWidth = '100px';
          btnBorrar.onclick = function() {
            btnBorrar.disabled = true;
            btnBorrar.textContent = 'Borrando...';
            fetch(`/sucursales/${idSucursal.idSucursal}`, { method: 'DELETE' })
              .then(res => res.json())
              .then(() => {
                li.style.transition = 'opacity 0.4s';
                li.style.opacity = 0;
                setTimeout(() => cargarSucursales(), 400);
              });
          };

          // Agregar botones al contenedor
          btnContainer.appendChild(btnEditar);
          btnContainer.appendChild(btnRefrescar);
          btnContainer.appendChild(btnBorrar);

          // Agregar datos y botones a la fila
          filaInfo.appendChild(datosDiv);
          filaInfo.appendChild(btnContainer);
          li.appendChild(filaInfo);

          // Mejora visual de la tarjeta
          li.style.marginBottom = '0';
          li.style.background = 'rgba(24,40,72,0.92)'; // azul oscuro translúcido
          li.style.padding = '2.2em 2.2em 2em 2.2em';
          li.style.borderRadius = '22px';
          li.style.boxShadow = '0 4px 24px #18284822, 0 1.5px 8px #1976d233';
          li.style.maxWidth = '700px';
          li.style.width = '100%';
          li.style.marginLeft = 'auto';
          li.style.marginRight = 'auto';
          li.style.border = 'none';
          li.style.transition = 'box-shadow 0.2s, transform 0.2s';
          li.onmouseenter = function() {
            li.style.boxShadow = '0 12px 48px #1976d244, 0 4px 18px #18284833';
            li.style.transform = 'translateY(-4px) scale(1.025)';
          };
          li.onmouseleave = function() {
            li.style.boxShadow = '0 4px 24px #18284822, 0 1.5px 8px #1976d233';
            li.style.transform = 'none';
          };
          // Línea separadora minimalista
          const divider = document.createElement('hr');
          divider.style.width = '100%';
          divider.style.border = 'none';
          divider.style.height = '1.5px';
          divider.style.background = 'rgba(120,130,150,0.25)'; // plomo translúcido
          divider.style.margin = '2.5em 0 2.5em 0';
          li.appendChild(divider);

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

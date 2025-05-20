window.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.getElementById('carrusel-productos');
    if (!contenedor) return;
    fetch('/productos')
        .then(res => res.json())
        .then(productos => {
            if (!Array.isArray(productos) || productos.length === 0) {
                contenedor.innerHTML = '<p style="color:#fff;">No hay productos para mostrar.</p>';
                return;
            }
            // Solo los primeros 8 productos (puedes cambiar a destacados si tienes ese campo)
            productos = productos.slice(0, 8);
            let inicio = 0;
            const mostrar = 4;
            
            contenedor.innerHTML = `
                <div id="carrusel-lista" style="display:flex;gap:2em;overflow:hidden;justify-content:center;align-items:stretch;width:100%;min-height:320px;"></div>
            `;
            const lista = document.getElementById('carrusel-lista');
            function render() {
                lista.innerHTML = '';
                for (let i = 0; i < mostrar; i++) {
                    const idx = (inicio + i) % productos.length;
                    const prod = productos[idx];
                    const card = document.createElement('div');
                    card.style.background = '#f6fcf7';
                    card.style.color = '#222';
                    card.style.borderRadius = '18px';
                    card.style.padding = '0';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.alignItems = 'center';
                    card.style.width = '320px';
                    card.style.minHeight = '320px';
                    card.style.boxShadow = '0 2px 18px #18284833';
                    card.style.overflow = 'hidden';
                    card.onclick = function() {
                        window.location.href = '/inventario';
                    };
                    // Imagen GRANDE, que abarque bien
                    if (prod.imagen) {
                        const img = document.createElement('img');
                        img.src = prod.imagen;
                        img.alt = prod.nombre;
                        img.style.width = '100%';
                        img.style.height = '260px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '18px 18px 0 0';
                        img.style.display = 'block';
                        card.appendChild(img);
                    }
                    // Nombre
                    const nombre = document.createElement('div');
                    nombre.innerText = prod.nombre;
                    nombre.style.fontWeight = 'bold';
                    nombre.style.fontSize = '1.3em';
                    nombre.style.margin = '1em 0 0.7em 0';
                    nombre.style.textAlign = 'center';
                    card.appendChild(nombre);
                    lista.appendChild(card);
                }
            }
            render();
            // Auto-mover cada 15 segundos
            setInterval(() => {
                inicio = (inicio + 1) % productos.length;
                render();
            }, 8000);
        });
});

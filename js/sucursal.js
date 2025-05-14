function obtenerDatos(nombreTabla) {
    fetch(`http://127.0.0.1:3000/api/${nombreTabla}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Datos recibidos:", data);
        // Aquí podrías renderizar los datos en tu HTML
    })
    .catch(error => console.error("Error en la solicitud:", error));
}

// Llamada de ejemplo:
obtenerDatos("sucursales");
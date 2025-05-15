from flask import Flask, jsonify, render_template, request

import mysql.connector
import json
import os
import sys
from db import obtener_conexion  # Se asume que db.py define la función obtener_conexion
 

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from api.herramientas_manuales import herramientas_manual_bp
from routes.apiSucursales import sucursales_bp

# Probar conexión inicial para asegurar que MySQL está accesible

obtener_conexion()

app = Flask(__name__)

app.register_blueprint(sucursales_bp)

# Define la ruta de la carpeta donde se encuentran archivos JSON (modifícala según tu estructura)
ruta_carpeta = "json_data"  # Ejemplo: la carpeta "json_data" en el directorio raíz del proyecto

@app.route("/api/<nombre_tabla>", methods=["GET", "POST", "PUT", "DELETE"])

def obtener_datos_tabla(nombre_tabla):
    conexion = None
    try:
        # Obtener conexión a la base de datos
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Obtener todas las tablas de la base de datos
        cursor.execute("SHOW TABLES")
        tablas_validas = [tabla[0] for tabla in cursor.fetchall()]
        
        # Si 'nombre_tabla' se encuentra entre las tablas de la BD, ejecutar la consulta
        if nombre_tabla in tablas_validas:
            cursor.execute(f"SELECT * FROM {nombre_tabla}")
            datos = cursor.fetchall()
            return jsonify(datos)
        
        # Si no se encontró como tabla, se verifica si existe la carpeta indicada para buscar archivos JSON
        elif os.path.isdir(ruta_carpeta):
            todos_los_datos = []
            for archivo_nombre in os.listdir(ruta_carpeta):
                if archivo_nombre.endswith(".json"):
                    ruta_json = os.path.join(ruta_carpeta, archivo_nombre)
                    with open(ruta_json, "r", encoding="utf-8") as archivo:
                        datos_json = json.load(archivo)
                        todos_los_datos.extend(datos_json)
            return jsonify(todos_los_datos)
        
        # Si no es tabla y tampoco existe la carpeta, se retorna error
        else:
            return jsonify({"error": "Categoría no encontrada"}), 404

    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al consultar la tabla {nombre_tabla}: {err}"}), 500

    finally:
        if conexion:
            conexion.close()

# Otras rutas
@app.route("/")
@app.route("/index")
def vista_index():
    return render_template("index.html")

@app.route('/confirmacion')
def vista_confirmacion():
    return render_template('confirmacion.html')

@app.route('/nosotros')
def vista_nosotros():
    return render_template('nosotros.html')

@app.route('/pago')
def vista_pago():
    return render_template('pago.html')

@app.route('/sucursal')
def vista_sucursales():
    return render_template('sucursal.html')

@app.route('/login')
def vista_login():
    return render_template('login.html')

@app.route("/inventario")
def vista_inventario():
    return render_template("inventario.html")

if __name__ == "__main__":
    app.run(debug=True, port=3000)




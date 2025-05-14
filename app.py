from flask import Flask, jsonify, render_template, request
import mysql.connector
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from api.herramientas_manuales import herramientas_manual_bp

app = Flask(__name__)
app.register_blueprint(herramientas_manual_bp)

# Conexión a la base de datos MySQL (Asegúrate de que `ferreterribd` existe)
try:
    db = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="",
        database="ferreteriadb"
    )
    print("✅ Conexión a MySQL exitosa")
except mysql.connector.Error as err:
    print(f"❌ Error de conexión a MySQL: {err}")

# Endpoint para obtener productos desde la base de datos
@app.route("/api/<nombre_tabla>", methods=["GET"])
def obtener_datos_tabla(nombre_tabla):
    cursor = db.cursor()
    
    try:
        # Obtener todas las tablas de la base de datos
        cursor.execute("SHOW TABLES")
        tablas_validas = [tabla[0] for tabla in cursor.fetchall()]
        
        if nombre_tabla not in tablas_validas:
            return jsonify({"error": f"La tabla '{nombre_tabla}' no existe"}), 404
        
        # Ejecutar consulta sobre la tabla elegida
        cursor.execute(f"SELECT * FROM {nombre_tabla}")
        datos = cursor.fetchall()
        return jsonify(datos)
    
    except mysql.connector.Error as err:
        return jsonify({"error": f"Error al consultar la tabla {nombre_tabla}: {err}"}), 500


# Página principal e index
@app.route("/")
@app.route("/index")
def vista_index():
    return render_template("index.html")

# Otras páginas
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
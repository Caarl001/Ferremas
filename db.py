import mysql.connector

def obtener_conexion():
    try:
        conexion = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="root",
            password="",
            database="FerreteriaDB"
        )
        print("✅ La conexión a MySQL está funcionando correctamente")

        return conexion
    except mysql.connector.Error as err:
        print(f"❌ Error  No se pudo conectar a la base de datos MySQL: {err}")
        return None
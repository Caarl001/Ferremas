import os 

from flask import Blueprint, jsonify, request_started
from db import obtener_conexion
from datetime import date

productos_bp = Blueprint('productos_bp', __name__)

# UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static', 'img')
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# GET
@productos_bp.route('/productos', methods=['GET'])
def get_productos():
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('SELECT * FROM productos')
        productos = cursor.fetchall()
        return jsonify(productos)
    except Exception as e:
        import traceback
        print('ERROR EN API TRABAJADORES:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()
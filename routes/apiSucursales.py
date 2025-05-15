from flask import Blueprint, jsonify, request
from db import obtener_conexion
import os
from werkzeug.utils import secure_filename

sucursales_bp = Blueprint('sucursales_bp', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static', 'img')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#GET
@sucursales_bp.route('/sucursales', methods=['GET'])
def get_sucursales():
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('SELECT * FROM sucursales')
        sucursales = cursor.fetchall()
        return jsonify(sucursales)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

#POST
@sucursales_bp.route('/sucursales', methods=['POST'])
def crear_sucursal():
    if request.content_type and request.content_type.startswith('multipart/form-data'):
        nombre = request.form.get('nombre')
        direccion = request.form.get('direccion')
        telefono = request.form.get('telefono')
        imagen_file = request.files.get('imagen')
        imagen_url = ''
        if imagen_file and allowed_file(imagen_file.filename):
            filename = secure_filename(imagen_file.filename)
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            imagen_file.save(save_path)
            imagen_url = f'/static/img/{filename}'
    else:
        datos = request.get_json()
        nombre = datos.get('nombre')
        direccion = datos.get('direccion')
        telefono = datos.get('telefono')
        imagen_url = datos.get('imagen', '')
    if not nombre or not direccion or not telefono:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('INSERT INTO sucursales (nombre, direccion, telefono, imagen) VALUES (%s, %s, %s, %s)', (nombre, direccion, telefono, imagen_url))
        conexion.commit()
        return jsonify({'mensaje': 'Sucursal creada correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

#PUT
@sucursales_bp.route('/sucursales/<idSucursal>', methods=['PUT'])
def actualizar_sucursal(idSucursal):
    datos = request.get_json()
    nombre = datos.get('nombre')
    direccion = datos.get('direccion')
    telefono = datos.get('telefono')
    imagen = datos.get('imagen', None)
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        if imagen is not None:
            cursor.execute('UPDATE sucursales SET nombre=%s, direccion=%s, telefono=%s, imagen=%s WHERE idSucursal=%s', (nombre, direccion, telefono, imagen, idSucursal))
        else:
            cursor.execute('UPDATE sucursales SET nombre=%s, direccion=%s, telefono=%s WHERE idSucursal=%s', (nombre, direccion, telefono, idSucursal))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Sucursal no encontrada'}), 404
        return jsonify({'mensaje': 'Sucursal actualizada correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

#DELETE
@sucursales_bp.route('/sucursales/<idSucursal>', methods=['DELETE'])
def eliminar_sucursal(idSucursal):
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('DELETE FROM sucursales WHERE idSucursal=%s', (idSucursal,))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Sucursal no encontrada'}), 404
        return jsonify({'mensaje': 'Sucursal eliminada correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

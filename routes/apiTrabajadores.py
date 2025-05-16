from flask import Blueprint, jsonify, request
from db import obtener_conexion
import os
from datetime import date

trabajadores_bp = Blueprint('trabajadores_bp', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static', 'img')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# GET: Obtener todos los trabajadores (con nombre de sucursal)
@trabajadores_bp.route('/trabajadores', methods=['GET'])
def get_trabajadores():
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('''SELECT t.*, s.nombre as sucursal_nombre FROM trabajadores t LEFT JOIN sucursales s ON t.idSucursal = s.idSucursal''')
        trabajadores = cursor.fetchall()
        return jsonify(trabajadores)
    except Exception as e:
        import traceback
        print('ERROR EN API TRABAJADORES:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# POST: Crear trabajador
@trabajadores_bp.route('/trabajadores', methods=['POST'])
def crear_trabajador():
    datos = request.get_json()
    nombre = datos.get('nombre')
    apellido = datos.get('apellido')
    cargo = datos.get('cargo')
    fecha_contratacion = datos.get('fecha_contratacion')
    sueldo = datos.get('sueldo')
    idSucursal = datos.get('idSucursal')
    # Validar todos los campos obligatorios
    if not nombre or not apellido or not cargo or not fecha_contratacion or sueldo is None or not idSucursal:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    # Forzar tipos correctos para idSucursal y sueldo
    try:
        idSucursal = int(idSucursal)
    except Exception:
        return jsonify({'error': 'idSucursal debe ser un número entero'}), 400
    try:
        sueldo = float(sueldo)
    except Exception:
        sueldo = 0
    # Validar formato fecha (YYYY-MM-DD)
    try:
        if fecha_contratacion:
            fecha_contratacion = str(fecha_contratacion)[:10]
        else:
            fecha_contratacion = str(date.today())
    except Exception:
        fecha_contratacion = str(date.today())
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('INSERT INTO trabajadores (nombre, apellido, cargo, fecha_contratacion, sueldo, idSucursal) VALUES (%s, %s, %s, %s, %s, %s)', (nombre, apellido, cargo, fecha_contratacion, sueldo, idSucursal))
        conexion.commit()
        return jsonify({'mensaje': 'Trabajador creado correctamente'}), 201
    except Exception as e:
        import traceback
        print('ERROR EN API TRABAJADORES:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# PUT: Actualizar trabajador
@trabajadores_bp.route('/trabajadores/<idTrabajador>', methods=['PUT'])
def actualizar_trabajador(idTrabajador):
    datos = request.get_json()
    nombre = datos.get('nombre')
    apellido = datos.get('apellido')
    cargo = datos.get('cargo')
    fecha_contratacion = datos.get('fecha_contratacion')
    sueldo = datos.get('sueldo')
    idSucursal = datos.get('idSucursal')
    # Validar todos los campos obligatorios
    if not nombre or not apellido or not cargo or not fecha_contratacion or sueldo is None or not idSucursal:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    try:
        idSucursal = int(idSucursal)
    except Exception:
        return jsonify({'error': 'idSucursal debe ser un número entero'}), 400
    try:
        sueldo = float(sueldo)
    except Exception:
        sueldo = 0
    try:
        if fecha_contratacion:
            fecha_contratacion = str(fecha_contratacion)[:10]
        else:
            fecha_contratacion = str(date.today())
    except Exception:
        fecha_contratacion = str(date.today())
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('''UPDATE trabajadores SET nombre=%s, apellido=%s, cargo=%s, fecha_contratacion=%s, sueldo=%s, idSucursal=%s WHERE idTrabajador=%s''',
                       (nombre, apellido, cargo, fecha_contratacion, sueldo, idSucursal, idTrabajador))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Trabajador no encontrado'}), 404
        return jsonify({'mensaje': 'Trabajador actualizado correctamente'})
    except Exception as e:
        import traceback
        print('ERROR EN API TRABAJADORES:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# DELETE: Eliminar trabajador
@trabajadores_bp.route('/trabajadores/<idTrabajador>', methods=['DELETE'])
def eliminar_trabajador(idTrabajador):
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('DELETE FROM trabajadores WHERE idTrabajador=%s', (idTrabajador,))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Trabajador no encontrado'}), 404
        return jsonify({'mensaje': 'Trabajador eliminado correctamente'})
    except Exception as e:
        import traceback
        print('ERROR EN API TRABAJADORES:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

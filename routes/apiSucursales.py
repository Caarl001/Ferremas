from flask import Blueprint, jsonify, request
from db import obtener_conexion

sucursales_bp = Blueprint('sucursales_bp', __name__)

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
    datos = request.get_json()
    nombre = datos.get('nombre')
    direccion = datos.get('direccion')
    telefono = datos.get('telefono')
    if not nombre or not direccion or not telefono:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('INSERT INTO sucursales (nombre, direccion, telefono) VALUES (%s, %s, %s)', (nombre, direccion, telefono))
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
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor()
        cursor.execute('UPDATE sucursales SET nombre=%s, direccion=%s, telefono=%s WHERE id=%s', (nombre, direccion, telefono, idSucursal))
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
        cursor.execute('DELETE FROM sucursales WHERE id=%s', (idSucursal,))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Sucursal no encontrada'}), 404
        return jsonify({'mensaje': 'Sucursal eliminada correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

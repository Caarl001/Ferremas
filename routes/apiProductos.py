import os 

from flask import Blueprint, jsonify, request_started, request
from db import obtener_conexion
from datetime import date

productos_bp = Blueprint('productos_bp', __name__)

# UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'static', 'img')
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# GET
@productos_bp.route('/categorias', methods=['GET'])
def get_categorias():
    """Devuelve todas las categorías de productos."""
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('SELECT idCategoria, descripcion FROM CategoriasProductos')
        categorias = cursor.fetchall()
        return jsonify(categorias)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

@productos_bp.route('/proveedores', methods=['GET'])
def get_proveedores():
    """Devuelve todos los proveedores."""
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('SELECT idProveedor, nombre FROM Proveedores')
        proveedores = cursor.fetchall()
        return jsonify(proveedores)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

@productos_bp.route('/productos', methods=['GET'])
def get_productos():
    conexion = obtener_conexion()
    if not conexion:
        return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('''SELECT p.*, c.descripcion as categoria, pr.nombre as proveedor
                          FROM productos p
                          LEFT JOIN CategoriasProductos c ON p.idCategoria = c.idCategoria
                          LEFT JOIN Proveedores pr ON p.idProveedor = pr.idProveedor''')
        productos = cursor.fetchall()
        return jsonify(productos)
    except Exception as e:
        import traceback
        print('ERROR EN API PRODUCTOS:', traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

@productos_bp.route('/inventario_stock', methods=['GET'])
def inventario_stock():
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute('''
            SELECT i.idInventario, i.idSucursal, i.idProducto, i.cantidad, s.nombre as sucursal
            FROM Inventario i
            JOIN Sucursales s ON i.idSucursal = s.idSucursal
        ''')
        stock = cursor.fetchall()
        return jsonify(stock)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# POST: Crear un nuevo producto
@productos_bp.route('/productos', methods=['POST'])
def crear_producto():
    """
    Crea un nuevo producto en la base de datos.
    Si ya existe un producto con el mismo nombre (ignorando mayúsculas/minúsculas), devuelve un mensaje de advertencia y los datos del producto existente.
    Además, registra el stock inicial por sucursal en la tabla Inventario si se recibe el campo sucursalesStock.
    """
    data = request.get_json()
    nombre = data.get('nombre')
    descripcion = data.get('descripcion')
    precio = data.get('precio')
    idProveedor = data.get('idProveedor')
    idCategoria = data.get('idCategoria')
    imagen = data.get('imagen')
    sucursalesStock = data.get('sucursalesStock', [])
    if not nombre or not descripcion or not precio or not idProveedor or not idCategoria:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor(dictionary=True)
        # Buscar si ya existe un producto con ese nombre (case-insensitive)
        cursor.execute('SELECT * FROM productos WHERE LOWER(nombre) = LOWER(%s)', (nombre,))
        existente = cursor.fetchone()
        if existente:
            return jsonify({'error': 'Ya existe un producto con ese nombre.', 'producto_existente': existente}), 409
        # Si no existe, crear el producto
        cursor = conexion.cursor()
        cursor.execute('INSERT INTO productos (nombre, descripcion, precio, idProveedor, idCategoria, imagen) VALUES (%s, %s, %s, %s, %s, %s)',
                       (nombre, descripcion, precio, idProveedor, idCategoria, imagen))
        conexion.commit()
        # Obtener el idProducto recién creado
        cursor.execute('SELECT LAST_INSERT_ID() as idProducto')
        idProducto = cursor.fetchone()[0]
        # Insertar stock por sucursal en Inventario
        if sucursalesStock and isinstance(sucursalesStock, list):
            for stock in sucursalesStock:
                idSucursal = stock.get('idSucursal')
                cantidad = stock.get('cantidad')
                if idSucursal and cantidad and cantidad > 0:
                    cursor.execute('INSERT INTO Inventario (idSucursal, idProducto, cantidad) VALUES (%s, %s, %s)',
                                   (idSucursal, idProducto, cantidad))
            conexion.commit()
        return jsonify({'mensaje': 'Producto creado correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# POST: Descontar stock de un producto en una sucursal
@productos_bp.route('/descontar_stock', methods=['POST'])
def descontar_stock():
    """
    Descuenta stock de un producto en una sucursal específica.
    Recibe: idProducto, nombreSucursal, cantidad
    """
    data = request.get_json()
    idProducto = data.get('idProducto')
    nombreSucursal = data.get('nombreSucursal')
    cantidad = data.get('cantidad')
    if not idProducto or not nombreSucursal or not cantidad:
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor(dictionary=True)
        # Buscar idSucursal por nombre
        cursor.execute('SELECT idSucursal FROM Sucursales WHERE nombre = %s', (nombreSucursal,))
        sucursal = cursor.fetchone()
        if not sucursal:
            return jsonify({'error': 'Sucursal no encontrada'}), 404
        idSucursal = sucursal['idSucursal']
        # Buscar stock actual
        cursor.execute('SELECT cantidad FROM Inventario WHERE idProducto = %s AND idSucursal = %s', (idProducto, idSucursal))
        inventario = cursor.fetchone()
        if not inventario:
            return jsonify({'error': 'No hay stock registrado para este producto en la sucursal seleccionada.'}), 404
        stock_actual = inventario['cantidad']
        if cantidad > stock_actual:
            return jsonify({'error': 'No hay suficiente stock en la sucursal seleccionada.'}), 400
        # Descontar stock
        nuevo_stock = stock_actual - cantidad
        cursor.execute('UPDATE Inventario SET cantidad = %s WHERE idProducto = %s AND idSucursal = %s', (nuevo_stock, idProducto, idSucursal))
        conexion.commit()
        return jsonify({'success': True, 'nuevo_stock': nuevo_stock})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# PUT: Actualizar un producto existente
@productos_bp.route('/productos/<int:idProducto>', methods=['PUT'])
def actualizar_producto(idProducto):
    """
    Actualiza un producto existente por su idProducto.
    Espera un JSON con los campos a actualizar: nombre, descripcion, precio, idProveedor, idCategoria, imagen (opcional).
    Si se recibe sucursalesStock (array no vacío), actualiza el stock por sucursal.
    Si no se recibe sucursalesStock, conserva el stock anterior.
    """
    data = request.get_json()
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor()
        cursor.execute('UPDATE productos SET nombre=%s, descripcion=%s, precio=%s, idProveedor=%s, idCategoria=%s, imagen=%s WHERE idProducto=%s',
                       (data.get('nombre'), data.get('descripcion'), data.get('precio'), data.get('idProveedor'), data.get('idCategoria'), data.get('imagen'), idProducto))
        # --- SOLO actualizar stock si se recibe un array válido y no vacío ---
        sucursalesStock = data.get('sucursalesStock')
        if sucursalesStock and isinstance(sucursalesStock, list) and len(sucursalesStock) > 0:
            cursor.execute('DELETE FROM Inventario WHERE idProducto = %s', (idProducto,))
            for stock in sucursalesStock:
                idSucursal = stock.get('idSucursal')
                cantidad = stock.get('cantidad')
                if idSucursal and cantidad and cantidad > 0:
                    cursor.execute('INSERT INTO Inventario (idSucursal, idProducto, cantidad) VALUES (%s, %s, %s)',
                                   (idSucursal, idProducto, cantidad))
        conexion.commit()
        return jsonify({'mensaje': 'Producto actualizado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()

# DELETE: Eliminar un producto
@productos_bp.route('/productos/<int:idProducto>', methods=['DELETE'])
def eliminar_producto(idProducto):
    """
    Elimina un producto por su idProducto.
    """
    conexion = obtener_conexion()
    try:
        cursor = conexion.cursor()
        # Eliminar primero el inventario relacionado
        cursor.execute('DELETE FROM Inventario WHERE idProducto=%s', (idProducto,))
        # Luego eliminar el producto
        cursor.execute('DELETE FROM productos WHERE idProducto=%s', (idProducto,))
        conexion.commit()
        return jsonify({'mensaje': 'Producto eliminado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conexion.close()
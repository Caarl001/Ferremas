# from flask import Blueprint, jsonify, request
# from db import obtener_conexion

# sucursales_bp = Blueprint("sucursales", __name__)

# # 🔹 Obtener todas las sucursales
# @sucursales_bp.route("/sucursales", methods=["GET"])
# def obtener_sucursales():
#     conexion = obtener_conexion()
#     cursor = conexion.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM Sucursales")
#     sucursales = cursor.fetchall()
#     conexion.close()
#     return jsonify(sucursales)

# # 🔹 Agregar una nueva sucursal
# @sucursales_bp.route("/sucursales", methods=["POST"])
# def agregar_sucursal():
#     datos = request.get_json()
#     conexion = obtener_conexion()
#     cursor = conexion.cursor()

#     nombre = datos.get("nombre")
#     direccion = datos.get("direccion")
#     telefono = datos.get("telefono")

#     cursor.execute("INSERT INTO Sucursales (nombre, direccion, telefono) VALUES (%s, %s, %s)", (nombre, direccion, telefono))
#     conexion.commit()
#     conexion.close()

#     return jsonify({"mensaje": "Sucursal agregada correctamente"}), 201

# # 🔹 Actualizar una sucursal
# @sucursales_bp.route("/sucursales/<int:idSucursal>", methods=["PUT"])
# def actualizar_sucursal(idSucursal):
#     datos = request.get_json()
#     conexion = obtener_conexion()
#     cursor = conexion.cursor()

#     nombre = datos.get("nombre")
#     direccion = datos.get("direccion")
#     telefono = datos.get("telefono")

#     cursor.execute("UPDATE Sucursales SET nombre=%s, direccion=%s, telefono=%s WHERE idSucursal=%s", (nombre, direccion, telefono, idSucursal))
#     conexion.commit()
#     conexion.close()

#     return jsonify({"mensaje": "Sucursal actualizada correctamente"}), 200

# # 🔹 Eliminar una sucursal
# @sucursales_bp.route("/sucursales/<int:idSucursal>", methods=["DELETE"])
# def eliminar_sucursal(idSucursal):
#     conexion = obtener_conexion()
#     cursor = conexion.cursor()

#     cursor.execute("DELETE FROM Sucursales WHERE idSucursal=%s", (idSucursal,))
#     conexion.commit()
#     conexion.close()

#     return jsonify({"mensaje": "Sucursal eliminada correctamente"}), 200
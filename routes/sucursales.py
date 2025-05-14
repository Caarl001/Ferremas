# from flask import Blueprint, jsonify, request
# import mysql.connector
# from db import obtener_conexion  # Se asume que db.py define la función obtener_conexion

# sucursales_bp = Blueprint("sucursales", __name__)

# # ------------------------------------------------------------------------------
# # GET: Obtener todas las sucursales
# # ------------------------------------------------------------------------------
# @sucursales_bp.route("/sucursales", methods=["GET"])
# def obtener_sucursales():
#     conexion = obtener_conexion()
#     if not conexion:
#         return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

#     try:
#         cursor = conexion.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM Sucursales")
#         sucursales = cursor.fetchall()
#         return jsonify(sucursales), 200
#     except mysql.connector.Error as err:
#         return jsonify({"error": f"Error al obtener sucursales: {err}"}), 500
#     finally:
#         conexion.close()

# # ------------------------------------------------------------------------------
# # POST: Agregar una nueva sucursal
# # ------------------------------------------------------------------------------
# @sucursales_bp.route("/sucursales", methods=["POST"])
# def agregar_sucursal():
#     try:
#         datos = request.get_json(force=True)
#     except Exception as e:
#         return jsonify({"error": f"Error interpretando JSON: {e}"}), 400

#     if not datos:
#         return jsonify({"error": "No se enviaron datos JSON válidos"}), 415

#     # Validar que existan los campos requeridos
#     nombre = datos.get("nombre")
#     direccion = datos.get("direccion")
#     telefono = datos.get("telefono")
#     if not (nombre and direccion and telefono):
#         return jsonify({"error": "Faltan datos obligatorios (nombre, dirección, teléfono)"}), 400

#     conexion = obtener_conexion()
#     if not conexion:
#         return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

#     try:
#         cursor = conexion.cursor()
#         cursor.execute(
#             "INSERT INTO Sucursales (nombre, direccion, telefono) VALUES (%s, %s, %s)",
#             (nombre, direccion, telefono)
#         )
#         conexion.commit()
#         return jsonify({"mensaje": "Sucursal agregada correctamente"}), 201
#     except mysql.connector.Error as err:
#         return jsonify({"error": f"Error al agregar la sucursal: {err}"}), 500
#     finally:
#         conexion.close()

# # ------------------------------------------------------------------------------
# # PUT: Actualizar una sucursal existente
# # ------------------------------------------------------------------------------
# @sucursales_bp.route("/sucursales/<int:idSucursal>", methods=["PUT"])
# def actualizar_sucursal(idSucursal):
#     try:
#         datos = request.get_json(force=True)
#     except Exception as e:
#         return jsonify({"error": f"Error interpretando JSON: {e}"}), 400

#     if not datos:
#         return jsonify({"error": "No se enviaron datos JSON válidos"}), 415

#     # Para actualizar, permitiremos cambiar nombre, dirección y/o teléfono.
#     nombre = datos.get("nombre")
#     direccion = datos.get("direccion")
#     telefono = datos.get("telefono")
#     if not (nombre or direccion or telefono):
#         return jsonify({"error": "Se debe proporcionar al menos un dato para actualizar"}), 400

#     conexion = obtener_conexion()
#     if not conexion:
#         return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

#     try:
#         cursor = conexion.cursor()
#         set_parts = []
#         valores = []
#         if nombre:
#             set_parts.append("nombre=%s")
#             valores.append(nombre)
#         if direccion:
#             set_parts.append("direccion=%s")
#             valores.append(direccion)
#         if telefono:
#             set_parts.append("telefono=%s")
#             valores.append(telefono)
#         consulta = f"UPDATE Sucursales SET {', '.join(set_parts)} WHERE idSucursal=%s"
#         valores.append(idSucursal)
#         cursor.execute(consulta, tuple(valores))
#         conexion.commit()

#         if cursor.rowcount == 0:
#             return jsonify({"error": "No se encontró la sucursal especificada"}), 404
#         return jsonify({"mensaje": "Sucursal actualizada correctamente"}), 200
#     except mysql.connector.Error as err:
#         return jsonify({"error": f"Error al actualizar la sucursal: {err}"}), 500
#     finally:
#         conexion.close()

# # ------------------------------------------------------------------------------
# # DELETE: Eliminar una sucursal
# # ------------------------------------------------------------------------------
# @sucursales_bp.route("/sucursales/<int:idSucursal>", methods=["DELETE"])
# def eliminar_sucursal(idSucursal):
#     conexion = obtener_conexion()
#     if not conexion:
#         return jsonify({"error": "No se pudo conectar a la base de datos"}), 500

#     try:
#         cursor = conexion.cursor()
#         cursor.execute("DELETE FROM Sucursales WHERE idSucursal=%s", (idSucursal,))
#         conexion.commit()
#         if cursor.rowcount == 0:
#             return jsonify({"error": "No se encontró la sucursal especificada"}), 404
#         return jsonify({"mensaje": "Sucursal eliminada correctamente"}), 200
#     except mysql.connector.Error as err:
#         return jsonify({"error": f"Error al eliminar la sucursal: {err}"}), 500
#     finally:
#         conexion.close()
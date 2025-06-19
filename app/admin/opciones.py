from pymongo import MongoClient


# Para conexión local (ejemplo):
clientLocal = MongoClient('mongodb://localhost:27017/')

# Nota: Asegúrate de reemplazar <usuario>, <contraseña>, <cluster-url> y <nombre-base-datos>
client = MongoClient('mongodb+srv://leryuslegys@gmail.com:Leryus_2109@<cluster-url>/paraguas?retryWrites=true&w=majority')

# Acceder a una base de datos específica
db = client['nombre_de_tu_base_de_datos']

# Acceder a una colección específica
collection = db['nombre_de_tu_coleccion']

# Insertar un solo documento
documento = {"nombre": "Ejemplo", "valor": 123}
resultado = collection.insert_one(documento)
print(f"Insertado con ID: {resultado.inserted_id}")

# Insertar varios documentos
documentos = [{"nombre": "Ejemplo1", "valor": 456}, {"nombre": "Ejemplo2", "valor": 789}]
resultado = collection.insert_many(documentos)
print(f"Insertados con IDs: {resultado.inserted_ids}")

# Consultar todos los documentos
for documento in collection.find():
    print(documento)

# Consultar documentos que cumplen una condición
for documento in collection.find({"valor": {"$gt": 500}}):
    print(documento)

# Actualizar un documento
filtro = {"nombre": "Ejemplo1"}
nuevo_valor = {"$set": {"valor": 1000}}
resultado = collection.update_one(filtro, nuevo_valor)
print(f"Documentos actualizados: {resultado.modified_count}")


# Eliminar un documento
filtro = {"nombre": "Ejemplo2"}
resultado = collection.delete_one(filtro)
print(f"Documentos eliminados: {resultado.deleted_count}")

# Es recomendable cerrar la conexión a la base de datos cuando ya no la necesites
client.close()

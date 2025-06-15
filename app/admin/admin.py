from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import ConnectionFailure, ConfigurationError

uri = "mongodb+srv://leryuslegys:Leryus_2109@cluster0.rbb8srm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# crea un nuevo cliente para conectarse a la base de datos MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))
# panda un ping de coneccion con la base de datos
db = client['Paraguas']
    # Conexión al cliente
try:
    client.admin.command('ping')# This command checks the connection to the MongoDB server
    print("Pinged your deployment. You successfully connected to MongoDB!")# This message confirms that the connection was successful
except (ConnectionFailure, ConfigurationError) as error:
    print(f"Ocurrió un error de conexión o configuración: {error}")




def editar_activo(filtro, activo_inactivo):
    """
    Actualiza la actividad/inactividad de cualquier usuario.

    Args:
        filtro (dict): Filtro para encontrar el usuario a actualizar.
        activo_inactivo (dict): Diccionario con el estado activo/inactivo a establecer.

    Returns:
        None
    """ 
    coleccion = db['usuario']  # Accede a la colección 'usuario'
    # Actualiza el primer documento que coincida con el filtro
    resultado = coleccion.update_one(
        filtro, 
        {'$set': activo_inactivo}

    )
    if resultado.modified_count > 0:
        print("Documento actualizado correctamente.")
    else:
        print("No se encontró ningún documento o los datos ya estan actualizados.")

# uso:
editar_activo( 
    {'nombre_usuario': 'Jloyo'},
    {'activo': True}
)


def crear_usuario(datos):
    """
    Inserta un nuevo usuario en la base de datos.

    Args:
        datos (dict): Diccionario con los datos obligatorios del nuevo documento.

    Returns:
        None
    """
    campos_obligatorios = ['nombre', 'apellido', 'lugar_de_trabajo', 'mail', 'contraseña', 'nombre_usuario', 'rol', 'activo']
    for campo in campos_obligatorios:
        if campo not in datos or datos[campo] in [None, '', []]:
            print(f"El campo '{campo}' es obligatorio.")
            return
    coleccion = db['usuario']  # Accede a la colección 'usuario'
    # Inserta un nuevo documento en la colección
    resultado = coleccion.insert_one(datos)
    print(f"Documento creado con _id: {resultado.inserted_id}")

# Ejemplo de uso:
crear_usuario(
    {
        'nombre': 'Fernando',
        'apellido': 'Moya',
        'lugar_de_trabajo': 'Desarrollo',
        'mail': 'elmailmasbonito@ejemplo.com',
        'contraseña': 'AlgunaContraseñaSegura',
        'nombre_usuario': 'Fmoya',
        'rol': 'admin',
        'activo': True
    }
)

def editar_pass(filtro, new_pass):
    """
    Edita la contraseña de cualquier usuario.

    Args:
        filtro (dict): Filtro para encontrar el usuario a editar.
        new_pass (dict): Diccionario con la nueva contraseña a establecer.

    Returns:
        None
    """
    coleccion = db['usuario']  # Accede a la colección 'usuario'
    # Actualiza el primer documento que coincida con el filtro
    resultado = coleccion.update_one(
        filtro, 
        {'$set': new_pass}  # Cambia 'contraseña' por 'new_pass' para actualizar la contraseña

    )
    if resultado.modified_count > 0:
        print("Documento actualizado correctamente.")
    else:
        print("No se encontró ningún documento o los datos ya estan actualizados.")

# uso:
editar_pass( 
    {'nombre_usuario': 'Fmoya'},
    {'contraseña': 'algoseguro123'}
)
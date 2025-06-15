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
    {'nombre_usuario': 'Jloyo'},# Cambia 'nombre_usuario' por el filtro que desees usar
    {'activo': False}# Cambia 'activo' por el nuevo estado que deseas establecer (True para activo, False para inactivo)
)


def crear_usuario(datos):
    """
    Inserta un nuevo usuario o actualiza uno existente en la base de datos según el campo 'nombre_usuario'.

    Args:
        datos (dict): Diccionario con los datos obligatorios del usuario.

    Returns:
        None
    """
    campos_obligatorios = ['nombre', 'apellido', 'lugar_de_trabajo', 'mail', 'contraseña', 'nombre_usuario', 'rol', 'activo']
    for campo in campos_obligatorios:
        if campo not in datos or datos[campo] in [None, '', []]:
            print(f"El campo '{campo}' es obligatorio.")
            return

    coleccion = db['usuario']  # Accede a la colección 'usuario'

    # Verifica si ya existe un usuario con ese nombre_usuario
    usuario_existente = coleccion.find_one({'nombre_usuario': datos['nombre_usuario']})

    if usuario_existente:
        # Si existe, actualiza el documento con los nuevos datos
        resultado = coleccion.update_one(
            {'nombre_usuario': datos['nombre_usuario']},
            {'$set': datos}
        )
        print(f"El usuario indicado ya existia, por eso han sido modificados sus datos. Cantidad de datos modificados: {resultado.modified_count}")
    else:
        # Si no existe, inserta un nuevo documento
        resultado = coleccion.insert_one(datos)
        print(f"Usuario creado exitosamente con _id: {resultado.inserted_id}")
# Ejemplo de uso:
crear_usuario(
    {# Datos obligatorios para crear un nuevo usuario
        'nombre': 'Fernando',
        'apellido': 'Moya',
        'lugar_de_trabajo': 'Producción',
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
        print("Contraseña actualizada correctamente.")
    else:
        print("La contraseña no pudo ser actualizada.")

# uso:
editar_pass( 
    {'nombre_usuario': 'Fmoya'},
    {'contraseña': 'algoseguro123'}
)

def editar_rol(filtro, new_rol):
    """
    Edita el rol de cualquier usuario.

    Args:
        filtro (dict): Filtro para encontrar el usuario a editar.
        new_rol (dict): Diccionario con el nuevo rol a establecer.


    Returns:
        None
    """
    coleccion = db['usuario']  # Accede a la colección 'usuario'
    # Actualiza el primer documento que coincida con el filtro
    resultado = coleccion.update_one(
        filtro, 
        {'$set': new_rol}  # Cambia 'rol' por 'new_rol' para actualizar el rol del usuario

    )
    if resultado.modified_count > 0:
        print("Rol actualizado correctamente.")
    else:
        print("El rol no pudo ser actualizado.")

# uso:
editar_rol( 
    {'nombre_usuario': 'Fmoya'}, # Cambia 'nombre_usuario' por el filtro que desees usar
    {'rol': 'user'}  # Cambia 'rol' por el nuevo rol que deseas establecer
)
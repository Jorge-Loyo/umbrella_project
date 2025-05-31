import os

class Config:
    """
    Configuraciones base de la aplicación Flask.
    """
    SECRET_KEY = os.environ.get('SECRET_KEY') or '904598d29a045df8c5a175e79b9b79240ec5ff4d3df517e1'
    # URI de conexión a MongoDB Atlas
    # Asegúrate de que el nombre de la base de datos ('Paraguas') esté en la URI o se especifique al obtener la BD.
    MONGO_URI = os.environ.get('MONGO_URI') or "mongodb+srv://Jloyo:2580@cluster0.rbb8srm.mongodb.net/Paraguas?retryWrites=true&w=majority"
    DEBUG = True # Modo Debug activado por defecto para desarrollo
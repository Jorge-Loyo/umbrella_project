from flask import Flask
from pymongo import MongoClient
from config import Config
import logging
from flask_login import LoginManager # <--- IMPORTAR LoginManager

mongo_client = None
db = None
login_manager = LoginManager() # <--- CREAR INSTANCIA de LoginManager
# Esta es la vista a la que Flask-Login redirigirá a los usuarios
# si intentan acceder a una página protegida sin haber iniciado sesión.
login_manager.login_view = 'auth.login' # 'auth.login' es el endpoint de tu ruta de login (blueprint auth, función login)
login_manager.login_message = "Por favor, inicia sesión para acceder a esta página."
login_manager.login_message_category = "info" # Categoría para el mensaje flash

def create_app(config_class=Config):
    global mongo_client, db

    app = Flask(__name__)
    app.config.from_object(config_class)

    app.logger.setLevel(logging.DEBUG)
    app.logger.info('Aplicación Umbrella iniciándose...')

    try:
        if mongo_client is None:
            mongo_client = MongoClient(app.config['MONGO_URI'])
            mongo_client.admin.command('ping')
            db = mongo_client.get_default_database()
            app.logger.info(f"Conexión a MongoDB establecida. Base de datos: {db.name}")
        else:
            app.logger.info("Cliente MongoDB ya inicializado.")
    except Exception as e:
        app.logger.error(f"Error al conectar o configurar MongoDB: {e}")
        db = None

    login_manager.init_app(app) # <--- INICIALIZAR Flask-Login con la app

    # Registrar Blueprints
    from app.main.routes import bp as main_bp
    app.register_blueprint(main_bp)
    app.logger.info('Blueprint "main" registrado.')

    from app.auth.routes import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.logger.info('Blueprint "auth" registrado con prefijo /auth.')

    from app.admin.routes import bp as admin_bp
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.logger.info('Blueprint "admin" registrado con prefijo /admin.')

    return app

# User loader callback para Flask-Login
@login_manager.user_loader
def load_user(user_id):
    """
    Esta función es usada por Flask-Login para cargar un usuario dado su ID
    (el que se almacena en la cookie de sesión).
    """
    from app.models import User # Importar aquí para evitar importación circular
    return User.get(user_id)

def get_db():
    if db is None:
        raise RuntimeError("La base de datos no ha sido inicializada.")
    return db
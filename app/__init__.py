from flask import Flask
from pymongo import MongoClient
from config import Config # Asegúrate que Config esté correctamente importada de tu config.py
import logging
from flask_login import LoginManager

mongo_client = None
db = None
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message = "Por favor, inicia sesión para acceder a esta página."
login_manager.login_message_category = "info"

def create_app(config_class=Config):
    global mongo_client, db

    app = Flask(__name__)
    app.config.from_object(config_class)

    # Configuración del logger
    app.logger.setLevel(logging.DEBUG)
    app.logger.info('Aplicación Umbrella iniciándose...')

    # Verificar que SECRET_KEY esté cargada
    if not app.secret_key:
        app.logger.warning("ADVERTENCIA: SECRET_KEY no está configurada en la aplicación!")
    else:
        app.logger.info(f"SECRET_KEY cargada correctamente.")
        # app.logger.debug(f"Valor de SECRET_KEY (solo para depuración extrema, no usar en producción): {app.secret_key}")
 

    # Conexión a MongoDB
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

    # Inicializar Flask-Login
    login_manager.init_app(app)
    app.logger.info("Flask-Login inicializado con la aplicación.")

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

@login_manager.user_loader
def load_user(user_id):
    # Usaremos el logger de la aplicación Flask.
    # Para acceder a app.logger aquí, necesitaríamos el contexto de la aplicación
    # o importar current_app. Es más simple usar print para este callback si
    # el logger de la app no está fácilmente disponible sin el contexto.
    # O, si estás seguro de que esto se llama dentro de un contexto de solicitud:
    from flask import current_app
    
    current_app.logger.debug(f"Flask-Login user_loader: Intentando cargar usuario con user_id: '{user_id}' (tipo: {type(user_id)})")
    from app.models import User # Importación diferida para evitar importaciones circulares
    
    if user_id is None:
        current_app.logger.warning("Flask-Login user_loader: user_id es None. Retornando None.")
        return None
        
    user = User.get(user_id) # User.get debe manejar la búsqueda en la BD

    if user:
        current_app.logger.debug(f"Flask-Login user_loader: Usuario '{user.username}' (ID: {user.id}) cargado.")
    else:
        current_app.logger.warning(f"Flask-Login user_loader: No se encontró usuario para user_id: '{user_id}'. User.get() retornó None.")
    return user

def get_db():
    if db is None:
        # Considera si quieres que la app falle aquí o si User.get() puede manejar un db None
        # Si db es None, la conexión inicial falló.
        print("ERROR CRITICO: get_db() fue llamado pero la instancia 'db' es None.")
        raise RuntimeError("La base de datos no ha sido inicializada o la conexión falló.")
    return db




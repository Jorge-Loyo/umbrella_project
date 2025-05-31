from flask import Blueprint

bp = Blueprint('auth', __name__, template_folder='../templates/auth')
# Si tienes plantillas específicas para auth (ej. login.html) en app/templates/auth/
# Si login.html está en app/templates/, entonces usa template_folder='../templates'

# Por ahora, asumiremos que login.html estará en app/templates/
# bp = Blueprint('auth', __name__, template_folder='../templates')


# Importar las rutas del blueprint DESPUÉS de crear 'bp'.
from app.auth import routes

print("Blueprint 'auth' creado.")
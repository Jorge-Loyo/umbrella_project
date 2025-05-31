from flask import Blueprint

bp = Blueprint('admin', __name__, template_folder='../templates/admin')
# Si tienes plantillas específicas para admin (ej. admin_dashboard.html) en app/templates/admin/
# Si admin_dashboard.html está en app/templates/, entonces usa template_folder='../templates'

# Por ahora, asumiremos que admin_dashboard.html estará en app/templates/
# bp = Blueprint('admin', __name__, template_folder='../templates')

# Importar las rutas del blueprint DESPUÉS de crear 'bp'.
from app.admin import routes

print("Blueprint 'admin' creado.")
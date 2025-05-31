from flask import Blueprint

# Creación del Blueprint 'main'
# El primer argumento 'main' es el nombre del blueprint.
# El segundo argumento __name__ ayuda a Flask a localizar la raíz del blueprint.
# template_folder='../templates': Indica que las plantillas para este blueprint
# se buscarán en la carpeta 'templates' que está un nivel arriba (es decir, app/templates).
# Flask es inteligente y si no se especifica, buscará en una carpeta 'templates'
# dentro del directorio del blueprint o en la carpeta 'templates' global de la app.
# Para una estructura centralizada de plantillas en app/templates, esta especificación
# puede no ser estrictamente necesaria si Flask ya está configurado para buscar allí.
bp = Blueprint('main', __name__, template_folder='../templates')

# Importar las rutas del blueprint DESPUÉS de crear 'bp' para evitar importaciones circulares.
from app.main import routes

print("Blueprint 'main' creado.")
from flask import render_template, current_app
from app.admin import bp

@bp.route('/')
def dashboard():
    current_app.logger.info('Accediendo al dashboard de administración.')
    # Renderiza admin_dashboard.html que debe estar en app/templates/ (o app/templates/admin/)
    return render_template('admin_dashboard.html', title='Panel de Administración')

# Aquí irán más rutas para gestionar usuarios, medicamentos, centros, etc.
# Ejemplo:
# @bp.route('/users')
# def manage_users():
#     return "Página para gestionar usuarios (próximamente)"
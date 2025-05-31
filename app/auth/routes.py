from flask import render_template, current_app, request, redirect, url_for, flash
from app.auth import bp
from app.models import User # <--- IMPORTAR la clase User
from flask_login import login_user, logout_user, current_user, login_required # <--- IMPORTAR funciones de Flask-Login

@bp.route('/login', methods=['GET', 'POST'])
def login():
    # Si el usuario ya está autenticado, redirigirlo al menú
    if current_user.is_authenticated:
        return redirect(url_for('main.menu'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        current_app.logger.info(f"Intento de login para el usuario: {username}")

        user = User.find_by_username(username) # Busca el usuario en la BD

        if user and user.check_password(password): # Si el usuario existe y la contraseña es correcta
            login_user(user) # Inicia la sesión para este usuario con Flask-Login
            current_app.logger.info(f"Login exitoso para {username}. Redirigiendo al menú.")
            # Flask-Login maneja la cookie de sesión.
            # Redirige a la página siguiente si el usuario intentaba acceder a una página protegida,
            # o al menú principal por defecto.
            next_page = request.args.get('next')
            if not next_page or url_for(next_page.lstrip('/')) == url_for('main.index'): # Evitar redirección a logout o index si es la página por defecto
                 next_page = url_for('main.menu')
            return redirect(next_page)
        else:
            current_app.logger.warning(f"Login fallido para {username}: usuario no encontrado o contraseña incorrecta.")
            flash('Usuario o contraseña incorrectos.', 'danger')
            # No es necesario redirigir aquí, simplemente se vuelve a renderizar la plantilla de login
            # return redirect(url_for('auth.login')) # Esto causaría una recarga innecesaria

    # Si es GET o el login falló (y no se redirigió en el POST)
    return render_template('login.html', title='Iniciar Sesión')

@bp.route('/logout')
@login_required # Solo usuarios logueados pueden desloguearse
def logout():
    logout_user() # Cierra la sesión del usuario actual con Flask-Login
    current_app.logger.info('Usuario cerró sesión.')
    flash('Has cerrado sesión exitosamente.', 'success')
    return redirect(url_for('main.index')) # Redirige a la página de inicio
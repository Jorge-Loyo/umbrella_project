from flask import render_template, current_app, request, redirect, url_for, flash
from app.auth import bp
from app.models import User
from flask_login import login_user, logout_user, current_user, login_required, AnonymousUserMixin # Añade AnonymousUserMixin

@bp.route('/login', methods=['GET', 'POST'])
def login():
    # --- INICIO DE LOGS DE DEPURACIÓN PARA current_user ---
    current_app.logger.debug(f"Accediendo a /auth/login. Método: {request.method}")
    current_app.logger.debug(f"Valor de current_user: {current_user}")
    current_app.logger.debug(f"Tipo de current_user: {type(current_user)}")
    is_anon = isinstance(current_user, AnonymousUserMixin)
    current_app.logger.debug(f"¿Es current_user una instancia de AnonymousUserMixin?: {is_anon}")
    
    if current_user is not None:
        current_app.logger.debug(f"current_user.is_authenticated (si no es None): {hasattr(current_user, 'is_authenticated') and current_user.is_authenticated}")
    else:
        current_app.logger.warning("current_user ES None ANTES del chequeo de is_authenticated.")
    # --- FIN DE LOGS DE DEPURACIÓN ---

    # Esta es la línea que daba error (línea 20 en tu traceback anterior)
    if current_user.is_authenticated:
        current_app.logger.info(f"Usuario '{current_user.username}' ya autenticado. Redirigiendo al menú.")
        return redirect(url_for('main.menu'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        current_app.logger.info(f"Intento de login POST para el usuario: '{username}'")

        user = User.find_by_username(username) 

        if user and user.check_password(password):
            login_user(user) 
            current_app.logger.info(f"Login exitoso para '{username}'. Redirigiendo al menú.")
            next_page = request.args.get('next')
            if not next_page or url_for(next_page.lstrip('/')) == url_for('main.index'):
                 next_page = url_for('main.menu')
            return redirect(next_page)
        else:
            current_app.logger.warning(f"Login fallido para '{username}': usuario no encontrado o contraseña incorrecta.")
            flash('Usuario o contraseña incorrectos.', 'danger')
            # Se vuelve a renderizar la plantilla de login para mostrar el mensaje flash
            # No es necesario un redirect(url_for('auth.login')) aquí si solo mostramos el error en la misma vista.
            
    # Para GET request o si el POST falló y no se redirigió
    return render_template('login.html', title='Iniciar Sesión')

@bp.route('/logout')
@login_required 
def logout():
    logout_user() 
    current_app.logger.info('Usuario cerró sesión.')
    flash('Has cerrado sesión exitosamente.', 'success')
    return redirect(url_for('main.index'))
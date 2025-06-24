from flask import render_template, current_app, url_for, request, jsonify, flash, redirect # Asegúrate de tener flash aquí si lo usas en esta ruta (lo usabas en /menu)
from app.main import bp
from flask_login import login_required, current_user
from app import get_db # Importa la función para obtener la instancia de la BD
from bson.objectid import ObjectId

@bp.route('/')
@bp.route('/index')
def index():
    current_app.logger.info('Accediendo a la ruta / o /index')
    return render_template('Index.html', title='Inicio')

@bp.route('/menu')
@login_required
def menu():
    current_app.logger.info(f"Usuario '{current_user.username}' accediendo al menú.")
    
    db = get_db()
    lista_centros = []
    try:
        centros_cursor = db.centros.find().sort("nombre", 1)
        for centro in centros_cursor:
            lista_centros.append({
                "id": centro.get("id_sucursal_original"),
                "nombre": centro.get("nombre")
            })
        current_app.logger.debug(f"Centros cargados para el menú: {lista_centros}")
    except Exception as e:
        current_app.logger.error(f"Error al cargar centros desde MongoDB: {e}")
        flash("Error al cargar la lista de centros.", "danger") # Necesitas importar flash de flask

    return render_template('menu.html', title='Menú Principal', user=current_user, centros=lista_centros)

@bp.route('/base')
@login_required
def base():
    current_app.logger.info(f"Usuario '{current_user.username}' accediendo a la base.")

    db = get_db()
    lista_centros = []
    lista_usuario = []
    try:
        # Cargar centros
        centros_cursor = db.centros.find().sort("nombre", 1)
        for centro in centros_cursor:
            lista_centros.append({
                "id": centro.get("id_sucursal_original"),
                "nombre": centro.get("nombre")
            })
        current_app.logger.debug(f"Centros cargados para el menú: {lista_centros}")

        # Cargar usuarios
        usuarios_cursor = db.usuario.find().sort("nombre_usuario", 1)
        for usuario in usuarios_cursor:
            lista_usuario.append({
                "id": usuario.get("_id"),
                "nombre_usuario": usuario.get("nombre_usuario")
            })
        current_app.logger.debug(f"Usuarios cargados para el menú: {lista_usuario}")

    except Exception as e:
        current_app.logger.error(f"Error al cargar datos desde MongoDB: {e}")
        flash("Error al cargar la lista de centros o usuarios.", "danger")

    return render_template(
        'base.html',
        title='Menú Principal',
        user=current_user,
        centros=lista_centros,
        usuarios=lista_usuario
    )
@bp.route('/editar_activo', methods=['POST'])
@login_required
def editar_activo_route():
    """
    Actualiza la actividad/inactividad de cualquier usuario.

    Args:
        filtro (dict): Filtro para encontrar el usuario a actualizar.
        activo_inactivo (dict): Diccionario con el estado activo/inactivo a establecer.
    Returns:
        Redirige a la página principal con un mensaje de éxito o error.
    """ 
    usuario_id = request.form['usuarioActivo']
    estado = request.form['activo_inactivo'] == 'Activo'
    db = get_db()
    coleccion = db['usuario']
    resultado = coleccion.update_one(
        {'_id': ObjectId(usuario_id)},
        {'$set': {'activo': estado}}
    )
    if resultado.modified_count > 0:
        flash('Usuario actualizado correctamente.', 'success')
    else:
        flash('No se encontró ningún usuario con ese ID o el estado ya estaba actualizado.', 'danger')
    return redirect(url_for('main.base'))




@bp.route('/crear_usuario', methods=['POST'])
@login_required
def crear_usuario_route():
    """
    Inserta un nuevo usuario o actualiza uno existente en la base de datos según el campo 'nombre_usuario'.

    Args:
        datos (dict): Diccionario con los datos obligatorios del usuario.

    Returns: 
        Redirige a la página principal con un mensaje de éxito o error.
    """
    estado = request.form['activo'] == 'Activo'
    datos = {
        'nombre': request.form['nombre'],
        'apellido': request.form['apellido'],
        'lugar_de_trabajo': request.form['lugar_de_trabajo'],
        'mail': request.form['mail'],
        'contraseña': request.form['contraseña'],
        'nombre_usuario': request.form['nombre_usuario'],
        'rol': request.form['rol'],
        'activo': estado
    }
    campos_obligatorios = ['nombre', 'apellido', 'lugar_de_trabajo', 'mail', 'contraseña', 'nombre_usuario', 'rol', 'activo']
    for campo in campos_obligatorios:
        if campo not in datos or datos[campo] in [None, '', []]:
            flash(f"El campo '{campo}' es obligatorio.", 'danger')
            return redirect(url_for('main.base'))
    db = get_db()
    coleccion = db['usuario']

    usuario_existente = coleccion.find_one({'nombre_usuario': datos['nombre_usuario']})

    if usuario_existente:
        resultado = coleccion.update_one(
            {'nombre_usuario': datos['nombre_usuario']},
            {'$set': datos}
        )
        if resultado.modified_count > 0:
            flash('El usuario ya existía, datos actualizados correctamente.', 'success')
        else:
            flash('El usuario ya existía, pero no hubo cambios en los datos.', 'info')
    else:
        resultado = coleccion.insert_one(datos)
        flash('Usuario creado exitosamente.', 'success')

    return redirect(url_for('main.base'))



@bp.route('/editar_pass', methods=['POST'])
@login_required
def editar_pass_route():
    """
    Actualiza la contraseña de un usuario específico.

    Args:
        usuario_id (str): ID del usuario cuyo contraseña se va a actualizar.
        nueva_contraseña (str): Nueva contraseña a establecer para el usuario.

    Returns: 
        Redirige a la página principal con un mensaje de éxito o error.
    """
    usuario_id = request.form['usuarioBlanqueo']  
    nueva_contrasena = request.form['nuevaContraseña']  

    db = get_db()
    coleccion = db['usuario']

    resultado = coleccion.update_one(
        {'_id': ObjectId(usuario_id)},
        {'$set': {'contraseña': nueva_contrasena}}
    )

    if resultado.modified_count > 0:
        flash("Contraseña actualizada correctamente.", "success")
    else:
        flash("La contraseña no pudo ser actualizada.", "danger")

    return redirect(url_for('main.base')) 



@bp.route('/buscar_medicamentos')
@login_required
def buscar_medicamentos():
    db = get_db()
    query = request.args.get('q', '').strip()
    medicamentos_encontrados = []

    if len(query) >= 2: # O 3, como prefieras
        current_app.logger.debug(f"Buscando medicamentos con query: '{query}'")
        try:
            regex_query = {"$regex": f"^{query}", "$options": "i"}
            
            # Buscamos por 'nombre' del medicamento o por 'codigo_medicamento'
            # El script de migración crea un índice de texto en ambos.
            resultados_cursor = db.medicamentos.find({
                "$or": [
                    {"nombre": regex_query}, # Asumiendo que el campo en MongoDB es 'nombre' para el nombre del medicamento
                    {"codigo_medicamento": regex_query} # Asumiendo que el campo es 'codigo_medicamento'
                ]
            }).limit(15)

            for med_doc in resultados_cursor:
                # Extraemos los datos directamente del documento del medicamento,
                # ya que ahora están denormalizados según tu último migrate_data.py
                medicamentos_encontrados.append({
                    "id": str(med_doc.get("_id")), # El ObjectId de MongoDB como string
                    "nombre": med_doc.get("nombre", "N/A"), # Nombre del medicamento
                    "codigo_medicamento": med_doc.get("codigo_medicamento", "N/A"), # Código del medicamento
                    
                    # Nombres directos desde el documento med_doc
                    "laboratorio_nombre": med_doc.get("laboratorio", "N/A"),
                    "monodroga_nombre": med_doc.get("monodroga", "N/A"),
                    "presentacion_descripcion": med_doc.get("presentacion_monodroga", "N/A"), # Usamos el campo con la descripción
                    "categoria_principal_nombre": med_doc.get("categoria", "N/A"), # Nombre de la categoría principal
                    "subcategoria_nombre": med_doc.get("subcategoria", "N/A"),       # Nombre de la subcategoría
                    
                    "trazable": med_doc.get("trazable", False), # Default a False si no está
                    
                    # También podrías querer devolver los IDs si son útiles para alguna otra lógica en el frontend,
                    # aunque para mostrar en el formulario ya no los necesitarías directamente.
                    "id_laboratorio_original": med_doc.get("id_laboratorio_original"),
                    "id_monodroga_original": med_doc.get("id_monodroga_original"),
                    "id_pres_monodroga": med_doc.get("id_pres_monodroga"), # El ID de la presentación
                    "id_categoria_principal_original": med_doc.get("id_categoria"), # El ID de la categoría principal
                    "id_subcategoria_original": med_doc.get("id_subcategoria")   # El ID de la subcategoría
                })
            current_app.logger.debug(f"Medicamentos encontrados para JSON: {medicamentos_encontrados}")
        except Exception as e:
            current_app.logger.error(f"Error al buscar medicamentos en MongoDB: {e}")
            return jsonify({"error": "Error interno al buscar medicamentos"}), 500
    
    return jsonify(medicamentos_encontrados)

# --- INICIO: SECCIÓN DE API FALTANTE ---
# Estas son las rutas que tu JavaScript estaba intentando llamar y que no existían.
# Ahora el servidor podrá responder con los datos correctos para los menús desplegables.

@bp.route('/api/monodrogas')
@login_required
def get_monodrogas_api():
    db = get_db()
    lista_monodrogas = []
    try:
        for doc in db.monodrogas.find({}, {"_id": 1, "id_monodroga_original": 1, "nombre": 1}).sort("nombre", 1):
            lista_monodrogas.append({
                "id": str(doc.get("_id")),
                "id_monodroga_original": doc.get("id_monodroga_original"),
                "nombre": doc.get("nombre")
            })
        return jsonify(lista_monodrogas)
    except Exception as e:
        current_app.logger.error(f"Error en API de monodrogas: {e}")
        return jsonify({"error": "Error interno"}), 500

@bp.route('/api/categorias')
@login_required
def get_categorias_api():
    db = get_db()
    lista_items = []
    try:
        # El script de migración la llama 'categorias_principales'
        for doc in db.categorias_principales.find({}, {"_id": 1, "id_categoria_original": 1, "nombre": 1}).sort("nombre", 1):
            lista_items.append({
                "id": str(doc.get("_id")),
                "id_categoria_original": doc.get("id_categoria_original"),
                "nombre": doc.get("nombre")
            })
        return jsonify(lista_items)
    except Exception as e:
        current_app.logger.error(f"Error en API de categorías: {e}")
        return jsonify({"error": "Error interno"}), 500

@bp.route('/api/subcategorias')
@login_required
def get_subcategorias_api():
    db = get_db()
    lista_items = []
    try:
        for doc in db.subcategorias.find({}, {"_id": 1, "id_subcategoria_original": 1, "nombre": 1}).sort("nombre", 1):
            lista_items.append({
                "id": str(doc.get("_id")),
                "id_subcategoria_original": doc.get("id_subcategoria_original"),
                "nombre": doc.get("nombre")
            })
        return jsonify(lista_items)
    except Exception as e:
        current_app.logger.error(f"Error en API de subcategorías: {e}")
        return jsonify({"error": "Error interno"}), 500

@bp.route('/api/laboratorios')
@login_required
def get_laboratorios_api():
    db = get_db()
    lista_items = []
    try:
        for doc in db.laboratorios.find({}, {"_id": 1, "id_laboratorio_original": 1, "nombre": 1}).sort("nombre", 1):
            lista_items.append({
                "id": str(doc.get("_id")),
                "id_laboratorio_original": doc.get("id_laboratorio_original"),
                "nombre": doc.get("nombre")
            })
        return jsonify(lista_items)
    except Exception as e:
        current_app.logger.error(f"Error en API de laboratorios: {e}")
        return jsonify({"error": "Error interno"}), 500

# --- FIN: SECCIÓN DE API FALTANTE ---
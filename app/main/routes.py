from flask import render_template, current_app, url_for, request, jsonify, flash # Asegúrate de tener flash aquí si lo usas en esta ruta (lo usabas en /menu)
from app.main import bp
from flask_login import login_required, current_user
from app import get_db # Importa la función para obtener la instancia de la BD

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
    return render_template('base.html', title='Base de Datos', user=current_user)

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
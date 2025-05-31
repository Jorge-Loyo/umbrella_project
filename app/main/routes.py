from flask import render_template, current_app, url_for
from app.main import bp
from flask_login import login_required, current_user
from app import get_db # Importa la función para obtener la instancia de la BD
from flask import request, jsonify # request para acceder a los parámetros de la URL, jsonify para respuestas JSON

@bp.route('/')
@bp.route('/index')
def index():
    current_app.logger.info('Accediendo a la ruta / o /index')
    return render_template('Index.html', title='Inicio')

@bp.route('/menu')
@login_required
def menu():
    current_app.logger.info(f"Usuario '{current_user.username}' accediendo al menú.")
    
    db = get_db() # Obtiene la instancia de la base de datos
    lista_centros = []
    try:
        # Busca todos los documentos en la colección 'centros'
        # y ordena por el campo 'nombre' alfabéticamente.
        # Asumimos que cada documento en 'centros' tiene un campo 'nombre' y 'id_sucursal_original'.
        centros_cursor = db.centros.find().sort("nombre", 1) # 1 para ascendente
        for centro in centros_cursor:
            lista_centros.append({
                "id": centro.get("id_sucursal_original"), # O podrías usar str(centro.get("_id")) si prefieres el ObjectId de Mongo
                "nombre": centro.get("nombre")
            })
        current_app.logger.debug(f"Centros cargados para el menú: {lista_centros}")
    except Exception as e:
        current_app.logger.error(f"Error al cargar centros desde MongoDB: {e}")
        flash("Error al cargar la lista de centros.", "danger")

    return render_template('menu.html', title='Menú Principal', user=current_user, centros=lista_centros) # Pasa la lista a la plantilla
# ... (tus otras rutas como index, menu) ...

@bp.route('/buscar_medicamentos')
@login_required
def buscar_medicamentos():
    db = get_db()
    query = request.args.get('q', '').strip()
    medicamentos_encontrados = []

    if len(query) >= 2: # O 3
        current_app.logger.debug(f"Buscando medicamentos con query: '{query}'")
        try:
            regex_query = {"$regex": f"^{query}", "$options": "i"}
            
            resultados_cursor = db.medicamentos.find({
                "$or": [
                    {"nombre": regex_query},
                    {"codigo_medicamento": regex_query}
                ]
            }).limit(15)

            for med_doc in resultados_cursor:
                # Obtener nombre del laboratorio
                nombre_laboratorio = "N/A"
                if med_doc.get("id_laboratorio_original") is not None:
                    lab = db.laboratorios.find_one({"id_laboratorio_original": med_doc["id_laboratorio_original"]})
                    if lab:
                        nombre_laboratorio = lab.get("nombre", "N/A")
                
                # Obtener nombre de la monodroga
                nombre_monodroga = "N/A"
                if med_doc.get("id_monodroga_original") is not None:
                    mono = db.monodrogas.find_one({"id_monodroga_original": med_doc["id_monodroga_original"]})
                    if mono:
                        nombre_monodroga = mono.get("nombre", "N/A")

                # Obtener nombre de la categoría principal
                nombre_categoria_principal = "N/A"
                if med_doc.get("id_categoria_principal_original") is not None:
                    cat_p = db.categorias_principales.find_one({"id_categoria_original": med_doc["id_categoria_principal_original"]})
                    if cat_p:
                        nombre_categoria_principal = cat_p.get("nombre", "N/A")
                
                # Obtener nombre de la subcategoría
                nombre_subcategoria = "N/A"
                if med_doc.get("id_subcategoria_original") is not None:
                    sub_cat = db.subcategorias.find_one({"id_subcategoria_original": med_doc["id_subcategoria_original"]})
                    if sub_cat:
                        nombre_subcategoria = sub_cat.get("nombre", "N/A")

                # Para la PRESENTACIÓN:
                # Asumiremos por ahora que id_pres_monodroga es la descripción directa o un ID.
                # Si es un ID que necesita lookup, necesitaríamos otra consulta aquí.
                # Si 'PRESE. MONODROGA' estaba en tu hoja 'Base' junto a 'ID_PRES_MONODROGA', 
                # deberías haberlo migrado a la colección 'medicamentos'.
                # Por ahora, usaré el valor de id_pres_monodroga directamente.
                # Si tienes una columna con el nombre de la presentación en tu hoja "Base",
                # asegúrate de que se migre al documento 'medicamentos'
                # y luego accede a ella aquí, ej: med_doc.get("nombre_presentacion_migrado")

                presentacion_desc = med_doc.get("id_pres_monodroga", "N/A") # Placeholder
                # Si tuvieras el nombre de la presentación en el mismo documento med_doc:
                # presentacion_desc = med_doc.get("nombre_campo_presentacion", med_doc.get("id_pres_monodroga", "N/A"))


                medicamentos_encontrados.append({
                    "id": str(med_doc.get("_id")),
                    "nombre": med_doc.get("nombre"),
                    "codigo_medicamento": med_doc.get("codigo_medicamento"),
                    # Devolvemos los NOMBRES ahora
                    "laboratorio_nombre": nombre_laboratorio,
                    "monodroga_nombre": nombre_monodroga,
                    "presentacion_descripcion": presentacion_desc, # <--- AJUSTAR ESTO SEGÚN CÓMO OBTENGAS LA DESCRIPCIÓN
                    "categoria_principal_nombre": nombre_categoria_principal,
                    "subcategoria_nombre": nombre_subcategoria,
                    "trazable": med_doc.get("trazable", False) # Asegurar un default
                })
            current_app.logger.debug(f"Medicamentos encontrados (con detalles): {medicamentos_encontrados}")
        except Exception as e:
            current_app.logger.error(f"Error al buscar medicamentos y sus detalles en MongoDB: {e}")
            return jsonify({"error": str(e)}), 500
    
    return jsonify(medicamentos_encontrados)
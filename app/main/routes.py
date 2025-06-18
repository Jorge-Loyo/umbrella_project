import uuid
from flask import render_template, current_app, url_for, request, jsonify, flash # Asegúrate de tener flash aquí si lo usas en esta ruta (lo usabas en /menu)
from app.main import bp
from flask_login import login_required, current_user
from app import get_db # Importa la función para obtener la instancia de la BD
from datetime import datetime
from bson import ObjectId

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

    return render_template('base.html', title='Menú Principal', user=current_user, centros=lista_centros)

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



@bp.route('/guardar_subcategoria', methods=['POST'])
@login_required
def guardar_subcategoria():
    db = get_db()
    data = request.get_json()
    current_app.logger.debug(f"JSON recibido para nueva subcategoría: {data}")

    nombre_subcat = data.get("subcategoriaForm", "").strip().upper()  # Convertir a mayúsculas y eliminar espacios

    if not nombre_subcat:
        current_app.logger.warning("Campo 'subcategoriaForm' vacío")
        return jsonify({"status": "error", "mensaje": "El campo Subcategoría es obligatorio."}), 400

    # Verificar si ya existe una subcategoría con ese nombre
    existente = db.subcategorias.find_one({"nombre": nombre_subcat})
    if existente:
        current_app.logger.warning(f"Ya existe una subcategoría con el nombre '{nombre_subcat}'")
        return jsonify({
            "status": "error",
            "mensaje": f"Ya existe una subcategoría con el nombre '{nombre_subcat}'."
        }), 409

    try:
        # Buscar la subcategoría con el mayor id_subcategoria_original
        ultima_subcat = db.subcategorias.find_one(
            {"id_subcategoria_original": {"$type": "int"}},
            sort=[("id_subcategoria_original", -1)]
        )
        nuevo_id_subcat = (ultima_subcat["id_subcategoria_original"] + 1) if ultima_subcat else 1

        subcategoria = {
            "_id": ObjectId(),  # ID interno de MongoDB
            "id_subcategoria_original": nuevo_id_subcat,  # ID incremental como entero
            "nombre": nombre_subcat
        }

        result = db.subcategorias.insert_one(subcategoria)
        current_app.logger.info(f"Subcategoría insertada con ID: {result.inserted_id}")

        return jsonify({
            "status": "ok",
            "mensaje": "Subcategoría guardada exitosamente.",
            "id": subcategoria["id_subcategoria_original"],
            "nombre": subcategoria["nombre"]
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error al guardar subcategoría: {e}")
        return jsonify({"status": "error", "mensaje": "Error interno al guardar subcategoría."}), 500
    
@bp.route('/guardar_categoria', methods=['POST'])
@login_required
def guardar_categoria():
    db = get_db()
    data = request.get_json()
    current_app.logger.debug(f"JSON recibido para nueva categoría: {data}")

    nombre_categoria = data.get("categoriaForm", "").strip().upper()  # Convertir a mayúsculas

    if not nombre_categoria:
        current_app.logger.warning("Campo 'categoriaForm' vacío")
        return jsonify({"status": "error", "mensaje": "El campo Categoría es obligatorio."}), 400

    # Verificar si ya existe una categoría con ese nombre
    existente = db.categorias.find_one({"nombre": nombre_categoria})
    if existente:
        current_app.logger.warning(f"Ya existe una categoría con el nombre '{nombre_categoria}'")
        return jsonify({
            "status": "error",
            "mensaje": f"Ya existe una categoría con el nombre '{nombre_categoria}'."
        }), 409

    try:
        # Buscar el valor más alto de id_categoria_original (como entero)
        ultima_categoria = db.categorias.find_one(
            {"id_categoria_original": {"$type": "int"}},
            sort=[("id_categoria_original", -1)]
        )

        nuevo_id_categoria = (ultima_categoria["id_categoria_original"] + 1) if ultima_categoria else 1

        categoria = {
            "_id": ObjectId(),  # ID interno de MongoDB
            "id_categoria_original": nuevo_id_categoria,  # ID incremental
            "nombre": nombre_categoria
        }

        result = db.categorias.insert_one(categoria)
        current_app.logger.info(f"Categoría insertada con ID: {result.inserted_id}")

        return jsonify({
            "status": "ok",
            "mensaje": "Categoría guardada exitosamente.",
            "id": categoria["id_categoria_original"],
            "nombre": categoria["nombre"]
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error al guardar categoría: {e}")
        return jsonify({"status": "error", "mensaje": "Error interno al guardar categoría."}), 500

@bp.route('/guardar_monodroga', methods=['POST'])
@login_required
def guardar_monodroga():
    db = get_db()

    try:
        data = request.get_json()
        nombre = data.get("nombreMonodroga", "").strip().upper()  # Convertir a mayúsculas
        codigo_raw = data.get("codigoMonodroga", "").strip()

        if not nombre or not codigo_raw:
            return jsonify({"status": "error", "mensaje": "Todos los campos son obligatorios."}), 400

        # Intentar convertir el código a entero
        try:
            codigo = int(codigo_raw)
        except ValueError:
            return jsonify({
                "status": "error",
                "mensaje": "El código debe ser un número entero."
            }), 400

        # Verificar si ya existe una monodroga con ese código
        existente = db.monodrogas.find_one({"id_monodroga_original": codigo})
        if existente:
            return jsonify({
                "status": "error",
                "mensaje": f"Ya existe una monodroga con el código '{codigo}'."
            }), 409  # 409 Conflict

        monodroga = {
            "id_monodroga_original": codigo,  # ya convertido a int
            "nombre": nombre
        }

        resultado = db.monodrogas.insert_one(monodroga)

        return jsonify({
            "status": "ok",
            "mensaje": "Monodroga guardada correctamente.",
            "id": str(resultado.inserted_id)
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error al guardar monodroga: {e}")
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error al guardar la monodroga."
        }), 500

@bp.route('/guardar_laboratorio', methods=['POST'])
@login_required
def guardar_laboratorio():
    db = get_db()
    try:
        data = request.get_json()
        nombre = data.get("nombreLaboratorio", "").strip().upper()  # Mayúsculas y sin espacios

        if not nombre:
            return jsonify({"status": "error", "mensaje": "El campo nombre es obligatorio."}), 400

        # Verificar si ya existe un laboratorio con ese nombre (en mayúsculas)
        existente = db.laboratorios.find_one({"nombre": nombre})
        if existente:
            return jsonify({
                "status": "error",
                "mensaje": f"Ya existe un laboratorio con el nombre '{nombre}'."
            }), 409

        # Buscar el id_laboratorio_original más alto
        ultimo = db.laboratorios.find_one(
            {"id_laboratorio_original": {"$type": "int"}},
            sort=[("id_laboratorio_original", -1)]
        )
        nuevo_id = (ultimo["id_laboratorio_original"] + 1) if ultimo else 1

        laboratorio = {
            "id_laboratorio_original": nuevo_id,
            "nombre": nombre
        }

        resultado = db.laboratorios.insert_one(laboratorio)

        return jsonify({
            "status": "ok",
            "mensaje": "Laboratorio guardado correctamente.",
            "id": str(resultado.inserted_id)
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error al guardar laboratorio: {e}")
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error al guardar el laboratorio."
        }), 500
    
@bp.route('/api/monodrogas')
@login_required
def api_monodrogas():
    db = get_db()
    monodrogas = list(db.monodrogas.find({}, {"_id": 0, "id_monodroga_original": 1, "nombre": 1}))
    return jsonify(monodrogas)

@bp.route('/api/categorias')
@login_required
def api_categorias():
    db = get_db()
    categorias = list(db.categorias.find({}, {"_id": 0, "id_categoria_original": 1, "nombre": 1}))
    return jsonify(categorias)

@bp.route('/api/subcategorias')
@login_required
def api_subcategorias():
    db = get_db()
    subcategorias = list(db.subcategorias.find({}, {"_id": 0, "id_subcategoria_original": 1, "nombre": 1}))
    return jsonify(subcategorias)


@bp.route('/api/laboratorios')
@login_required
def api_laboratorios():
    db = get_db()
    laboratorios = list(db.laboratorios.find({}, {"_id": 0, "id_laboratorio_original": 1, "nombre": 1}))
    return jsonify(laboratorios)


@bp.route('/guardar_medicamento', methods=['POST'])
@login_required
def guardar_medicamento():
    db = get_db()
    try:
        data = request.get_json()

        # Extracción y normalización de datos
        nombre = data.get("nombreMedicamento", "").strip().upper()
        codigo_raw = data.get("codigoMedicamento", "").strip()
        laboratorio = data.get("laboratorioMedicamento", "").strip().upper()
        monodroga = data.get("monodrogaMedicamento", "").strip().upper()
        id_monodroga_original = data.get("monodCodigoMedicamento", "").strip()
        presentacion = data.get("presentacionMonodroga", "").strip().upper()
        categoria = data.get("categoriaMedicamento", "").strip().upper()
        id_categoria = data.get("idCategoria", "").strip()
        subcategoria = data.get("subcategoriaMedicamento", "").strip().upper()
        id_subcategoria = data.get("idSubcategoria", "").strip()
        trazable = bool(data.get("trazable", False))

        # Validación de campos obligatorios
        campos_obligatorios = [nombre, codigo_raw, laboratorio, monodroga, id_monodroga_original, presentacion, categoria, subcategoria]
        if not all(campos_obligatorios):
            return jsonify({"status": "error", "mensaje": "Todos los campos son obligatorios."}), 400

        # Conversión de tipos
        try:
            codigo_medicamento = int(codigo_raw)
            id_monodroga_original_int = int(id_monodroga_original)
            id_categoria_int = int(id_categoria) if id_categoria else None
            id_subcategoria_int = int(id_subcategoria) if id_subcategoria else None
        except ValueError:
            return jsonify({
                "status": "error",
                "mensaje": "Los códigos deben ser números enteros."
            }), 400

        # Buscar el id_laboratorio_original por nombre (en mayúsculas)
        lab_doc = db.laboratorios.find_one({"nombre": laboratorio})
        if not lab_doc:
            return jsonify({"status": "error", "mensaje": "Laboratorio no encontrado."}), 400
        id_laboratorio_original_int = lab_doc.get("id_laboratorio_original")

        # Verificar si ya existe un medicamento con ese código
        if db.medicamentos.find_one({"codigo_medicamento": codigo_medicamento}):
            return jsonify({
                "status": "error",
                "mensaje": f"Ya existe un medicamento con el código '{codigo_medicamento}'."
            }), 409

        medicamento = {
            "_id": ObjectId(),
            "codigo_medicamento": codigo_medicamento,
            "nombre": nombre,
            "id_monodroga_original": id_monodroga_original_int,
            "monodroga": monodroga,
            "id_laboratorio_original": id_laboratorio_original_int,
            "laboratorio": laboratorio,
            "presentacion": presentacion,
            "id_categoria": id_categoria_int,
            "categoria": categoria,
            "id_subcategoria": id_subcategoria_int,
            "subcategoria": subcategoria,
            "trazable": trazable
        }

        resultado = db.medicamentos.insert_one(medicamento)

        return jsonify({
            "status": "ok",
            "mensaje": "Medicamento guardado correctamente.",
            "id": str(resultado.inserted_id)
        }), 201

    except Exception as e:
        current_app.logger.error(f"Error al guardar medicamento: {e}")
        return jsonify({
            "status": "error",
            "mensaje": "Ocurrió un error al guardar el medicamento."
        }), 500
import sys
import os
import pandas as pd
from pymongo import MongoClient, TEXT
from config import Config

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_SUBFOLDER = "datos_csv"
EXCEL_FILENAME = "Base de datos Umbrella.xlsx"
EXCEL_FILEPATH = os.path.join(BASE_DIR, DATA_SUBFOLDER, EXCEL_FILENAME)

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    client = MongoClient(Config.MONGO_URI)
    client.admin.command('ping')
    db = client.get_default_database()
    print(f"Conectado exitosamente a MongoDB. Base de datos: {db.name}")
except Exception as e:
    print(f"Error al conectar a MongoDB: {e}")
    exit()

def safe_int_convert(val_str):
    """Convierte un valor a entero de forma segura, manejando NaN, vacíos y '.0'."""
    if pd.isna(val_str) or str(val_str).strip() == '' or str(val_str).lower() == 'nan':
        return None
    try:
        return int(float(str(val_str)))
    except ValueError:
        return None

def migrate_laboratorios(excel_filepath, sheet_name='Laboratorio'):
    print(f"\nIniciando migración de laboratorios desde '{excel_filepath}', hoja '{sheet_name}'...")
    try:
        df = pd.read_excel(excel_filepath, sheet_name=sheet_name, dtype=str)
        laboratorios_collection = db.laboratorios
        laboratorios_collection.drop()
        count = 0
        for index, row in df.iterrows():
            try:
                id_lab_str = str(row.get('ID_LABORATORIO', '')).strip()
                nombre_lab_str = str(row.get('NOMBRE_LABORATORIO', '')).strip()

                if not id_lab_str or not nombre_lab_str:
                    print(f"Advertencia: Fila con ID_LABORATORIO o NOMBRE_LABORATORIO vacío no migrada: {row.to_dict()}")
                    continue
                
                id_lab_original = safe_int_convert(id_lab_str)
                if id_lab_original is None:
                    print(f"Advertencia: ID_LABORATORIO no es un número válido en fila: {row.to_dict()}")
                    continue

                laboratorio = {
                    "id_laboratorio_original": id_lab_original,
                    "nombre": nombre_lab_str
                }
                laboratorios_collection.insert_one(laboratorio)
                count += 1
            except KeyError as ke:
                print(f"Error de KeyError en laboratorios (verifica nombres de columna en Excel '{sheet_name}'): {ke} - Fila: {row.to_dict()}")
            except Exception as e_row:
                 print(f"Error procesando fila en laboratorios: {e_row} - Fila: {row.to_dict()}")
        print(f"Migración de laboratorios completada. {count} documentos insertados en 'laboratorios'.")
    except FileNotFoundError: print(f"Error: Archivo Excel no encontrado en la ruta: {excel_filepath}")
    except ValueError as ve:
        if "Worksheet" in str(ve) and "not found" in str(ve): print(f"Error: Hoja '{sheet_name}' no encontrada en '{excel_filepath}'.")
        else: print(f"Error al leer Excel (laboratorios): {ve}")
    except Exception as e: print(f"Error inesperado (laboratorios): {e}")

def migrate_monodrogas(excel_filepath, sheet_name='Monodroga'):
    print(f"\nIniciando migración de monodrogas desde '{excel_filepath}', hoja '{sheet_name}'...")
    try:
        df = pd.read_excel(excel_filepath, sheet_name=sheet_name, dtype=str)
        monodrogas_collection = db.monodrogas
        monodrogas_collection.drop()
        count = 0
        for index, row in df.iterrows():
            try:
                cod_monodroga_str = str(row.get('COD MONODROGA', '')).strip()
                nombre_monodroga_str = str(row.get('MONODROGA', '')).strip()

                if not cod_monodroga_str or not nombre_monodroga_str:
                    print(f"Advertencia: Fila con COD MONODROGA o MONODROGA vacío no migrada: {row.to_dict()}")
                    continue

                id_monodroga_original = safe_int_convert(cod_monodroga_str)
                if id_monodroga_original is None:
                    print(f"Advertencia: COD MONODROGA no es un número válido en fila: {row.to_dict()}")
                    continue
                
                monodroga = {
                    "id_monodroga_original": id_monodroga_original,
                    "nombre": nombre_monodroga_str
                }
                monodrogas_collection.insert_one(monodroga)
                count += 1
            except KeyError as ke: print(f"Error de KeyError en monodrogas (verifica nombres de columna en Excel '{sheet_name}'): {ke} - Fila: {row.to_dict()}")
            except Exception as e_row: print(f"Error procesando fila en monodrogas: {e_row} - Fila: {row.to_dict()}")
        print(f"Migración de monodrogas completada. {count} documentos insertados en 'monodrogas'.")
    except FileNotFoundError: print(f"Error: Archivo Excel no encontrado en la ruta: {excel_filepath}")
    except ValueError as ve:
        if "Worksheet" in str(ve) and "not found" in str(ve): print(f"Error: Hoja '{sheet_name}' no encontrada en '{excel_filepath}'.")
        else: print(f"Error al leer Excel (monodrogas): {ve}")
    except Exception as e: print(f"Error inesperado (monodrogas): {e}")

def migrate_categorias_principales(excel_filepath, sheet_name='Categorias'):
    print(f"\nIniciando migración de categorías principales desde '{excel_filepath}', hoja '{sheet_name}'...")
    try:
        df = pd.read_excel(excel_filepath, sheet_name=sheet_name, dtype=str)
        categorias_principales_collection = db.categorias_principales 
        categorias_principales_collection.drop()
        count = 0
        for index, row in df.iterrows():
            try:
                id_cat_str = str(row.get('ID CATEGORIA', '')).strip()
                nombre_cat_str = str(row.get('CATEGORIAS', '')).strip()

                if not id_cat_str or not nombre_cat_str:
                    print(f"Advertencia: Fila con ID CATEGORIA o CATEGORIAS vacío no migrada: {row.to_dict()}")
                    continue
                
                id_categoria_original = safe_int_convert(id_cat_str)
                if id_categoria_original is None:
                    print(f"Advertencia: ID CATEGORIA no es un número válido en fila: {row.to_dict()}")
                    continue

                categoria_doc = {
                    "id_categoria_original": id_categoria_original,
                    "nombre": nombre_cat_str
                }
                categorias_principales_collection.insert_one(categoria_doc)
                count += 1
            except KeyError as ke: print(f"Error de KeyError en categorías principales (verifica nombres de columna en Excel '{sheet_name}'): {ke} - Fila: {row.to_dict()}")
            except Exception as e_row: print(f"Error procesando fila en categorías principales: {e_row} - Fila: {row.to_dict()}")
        print(f"Migración de categorías principales completada. {count} documentos insertados en 'categorias_principales'.")
    except FileNotFoundError: print(f"Error: Archivo Excel no encontrado en la ruta: {excel_filepath}")
    except ValueError as ve:
        if "Worksheet" in str(ve) and "not found" in str(ve): print(f"Error: Hoja '{sheet_name}' no encontrada en '{excel_filepath}'.")
        else: print(f"Error al leer Excel (categorías principales): {ve}")
    except Exception as e: print(f"Error inesperado (categorías principales): {e}")

def migrate_subcategorias(excel_filepath, sheet_name='Subcategoria'): # <--- NOMBRE DE HOJA ACTUALIZADO
    print(f"\nIniciando migración de subcategorías desde '{excel_filepath}', hoja '{sheet_name}'...")
    try:
        df = pd.read_excel(excel_filepath, sheet_name=sheet_name, dtype=str)
        subcategorias_collection = db.subcategorias 
        subcategorias_collection.drop()
        count = 0
        for index, row in df.iterrows():
            try:
                # Columnas esperadas: ID SUB CATEGORIAS, SUB CATEGORIA
                id_subcat_str = str(row.get('ID SUB CATEGORIAS', '')).strip()
                nombre_subcat_str = str(row.get('SUB CATEGORIA', '')).strip()

                if not id_subcat_str or not nombre_subcat_str: # Ambas son obligatorias
                    print(f"Advertencia: Fila con ID SUB CATEGORIAS o SUB CATEGORIA vacío no migrada: {row.to_dict()}")
                    continue

                id_subcategoria_original = safe_int_convert(id_subcat_str)
                
                if id_subcategoria_original is None:
                    print(f"Advertencia: ID SUB CATEGORIAS no es un número válido en fila: {row.to_dict()}")
                    continue
                
                subcategoria_doc = {
                    "id_subcategoria_original": id_subcategoria_original,
                    "nombre": nombre_subcat_str
                    # Ya no hay 'id_categoria_padre_original' aquí porque no está en esta hoja
                }
                subcategorias_collection.insert_one(subcategoria_doc)
                count += 1
            except KeyError as ke: print(f"Error de KeyError en subcategorías (verifica nombres de columna en Excel '{sheet_name}'): {ke} - Fila: {row.to_dict()}")
            except Exception as e_row: print(f"Error procesando fila en subcategorías: {e_row} - Fila: {row.to_dict()}")
        print(f"Migración de subcategorías completada. {count} documentos insertados en 'subcategorias'.")
    except FileNotFoundError: print(f"Error: Archivo Excel no encontrado en la ruta: {excel_filepath}")
    except ValueError as ve:
        if "Worksheet" in str(ve) and "not found" in str(ve): print(f"Error: Hoja '{sheet_name}' no encontrada en '{excel_filepath}'.")
        else: print(f"Error al leer Excel (subcategorías): {ve}")
    except Exception as e: print(f"Error inesperado (subcategorías): {e}")

def migrate_sucursales(excel_filepath, sheet_name='Sucursales'):
    print(f"\nIniciando migración de sucursales/centros desde '{excel_filepath}', hoja '{sheet_name}'...")
    try:
        df = pd.read_excel(excel_filepath, sheet_name=sheet_name, dtype=str)
        centros_collection = db.centros 
        centros_collection.drop()
        count = 0
        for index, row in df.iterrows():
            try:
                id_sucursal_str = str(row.get('ID SUCURSAL', '')).strip()
                nombre_sucursal_str = str(row.get('SUCURSAL NOMBRE', '')).strip()

                if not id_sucursal_str or not nombre_sucursal_str:
                    print(f"Advertencia: Fila con ID_SUCURSAL o SUCURSAL_NOMBRE vacío no migrada: {row.to_dict()}")
                    continue
                
                id_sucursal_original = safe_int_convert(id_sucursal_str)
                if id_sucursal_original is None:
                     print(f"Advertencia: ID_SUCURSAL no es un número válido en fila: {row.to_dict()}")
                     continue

                centro_doc = {
                    "id_sucursal_original": id_sucursal_original,
                    "nombre": nombre_sucursal_str
                }
                centros_collection.insert_one(centro_doc)
                count += 1
            except KeyError as ke: print(f"Error de KeyError en sucursales (verifica nombres de columna en Excel '{sheet_name}'): {ke} - Fila: {row.to_dict()}")
            except Exception as e_row: print(f"Error procesando fila en sucursales: {e_row} - Fila: {row.to_dict()}")
        print(f"Migración de sucursales/centros completada. {count} documentos insertados en 'centros'.")
    except FileNotFoundError: print(f"Error: Archivo Excel no encontrado en la ruta: {excel_filepath}")
    except ValueError as ve:
        if "Worksheet" in str(ve) and "not found" in str(ve): print(f"Error: Hoja '{sheet_name}' no encontrada en '{excel_filepath}'.")
        else: print(f"Error al leer Excel (sucursales): {ve}")
    except Exception as e: print(f"Error inesperado (sucursales): {e}")

def migrate_medicamentos(excel_filepath, sheet_name='Base'):
    print(f"\nIniciando migración de medicamentos desde '{excel_filepath}', hoja '{sheet_name}'...")
    try:
        # Primero, obtenemos los nombres de columna reales para asegurar que coincidan
        try:
            df_check_cols = pd.read_excel(excel_filepath, sheet_name=sheet_name, nrows=0)
            actual_column_names = list(df_check_cols.columns)
            print(f"NOMBRES DE COLUMNA ENCONTRADOS POR PANDAS en hoja '{sheet_name}': {actual_column_names}")
            # Verifica que 'CODIGOMEDICAMENTO' (o como se llame exactamente en tu Excel) esté en esta lista.
        except Exception as e_cols:
            print(f"Advertencia: No se pudieron leer los encabezados de la hoja '{sheet_name}': {e_cols}")

        df = pd.read_excel(excel_filepath, sheet_name=sheet_name, dtype=str)
        medicamentos_collection = db.medicamentos
        medicamentos_collection.drop()
        count = 0
        
        # Nombres de columna esperados de tu hoja "Base" - AJUSTA SI ES NECESARIO
        # Basado en tu indicación, la columna clave es 'CODIGOMEDICAMENTO'
        COL_CODIGO_MEDEDICAMENTO = 'CODIGOMEDICAMENTO'
        COL_MEDICAMENTO = 'MEDICAMENTO'
        COL_ID_MONODROGA_EXCEL = 'CODMONODROGA' 
        COL_MONODROGA = 'MONODROGA'
        COL_ID_PRES_MONODROGA_EXCEL = 'IDPRESEMONODROGA' 
        COL_PRES_MONODROGA = 'PRESEMONODROGA'
        COL_PK = 'PK' 
        COL_ID_LABORATORIO_EXCEL = 'IDLABORATORIO' 
        COL_LABORATORIO = 'LABORATORIO'
        COL_ID_CATEGORIA = 'IDCATEGORIA' 
        COL_CATEGORIA = 'CATEGORIA' 
        COL_ID_SUBCATEGORIA = 'IDSUBCATEGORIA'
        COL_SUBCATEGORIA = 'SUBCATEGORIA'
        COL_TRAZABLE_EXCEL = 'TRAZABLE' # Asumiendo este nombre
        
        
        

        for index, row in df.iterrows():
            try:
                medicamento_nombre = str(row.get(COL_MEDICAMENTO, '')).strip()
                if not medicamento_nombre:
                    print(f"Advertencia: Fila sin nombre de medicamento ({COL_MEDICAMENTO}) no migrada: {row.to_dict()}")
                    continue

                # Leer el valor de la columna CODIGOMEDICAMENTO del Excel
                valor_codigo_leido_del_excel = str(row.get(COL_CODIGO_MEDEDICAMENTO, '')).strip()
                
                # Si el código es esencial y está vacío en el Excel, puedes decidir saltar la fila
                if not valor_codigo_leido_del_excel: 
                    print(f"Advertencia: Fila con '{COL_CODIGO_MEDEDICAMENTO}' vacío no migrada (Nombre: {medicamento_nombre}): {row.to_dict()}")
                    continue 
                
                # Los demás campos se leen como antes
                codigo_medicamento = safe_int_convert(valor_codigo_leido_del_excel)
                medicamento = str(row.get(COL_MEDICAMENTO, '')).strip()
                id_monodroga = safe_int_convert(row.get(COL_ID_MONODROGA_EXCEL))
                monodroga = str(row.get(COL_MONODROGA, '')).strip() 
                id_laboratorio = safe_int_convert(row.get(COL_ID_LABORATORIO_EXCEL))
                laboratorio = str(row.get(COL_LABORATORIO, '')).strip()
                id_categoria = safe_int_convert(row.get(COL_ID_CATEGORIA))
                categoria = str(row.get(COL_CATEGORIA, '')).strip()
                id_subcategoria = safe_int_convert(row.get(COL_ID_SUBCATEGORIA))
                subcategoria = str(row.get(COL_SUBCATEGORIA, '')).strip()
                id_pres_monodroga = str(row.get(COL_ID_PRES_MONODROGA_EXCEL, '')).strip()
                presentacion_monodroga = str(row.get(COL_PRES_MONODROGA, '')).strip()
                pk = str(row.get(COL_PK, '')).strip()  # Si migras PK, sino puedes omitirlo
                
                trazable_val = str(row.get(COL_TRAZABLE_EXCEL, '')).strip().upper()
                es_trazable = trazable_val in ['TRUE', '1', 'SI', 'VERDADERO', 'S']
                
                # pk_val = safe_int_convert(row.get(COL_PK_EXCEL)) # Si migras PK

                medicamento_doc = {
                    "pk_original": pk,
                    "codigo_medicamento": valor_codigo_leido_del_excel,
                    "nombre": medicamento_nombre,
                    "id_monodroga_original": id_monodroga,
                    "monodroga": monodroga,
                    "id_pres_monodroga": id_pres_monodroga,
                    "presentacion_monodroga": presentacion_monodroga,
                    "id_laboratorio_original": id_laboratorio,
                    "laboratorio": laboratorio,
                    "id_categoria": id_categoria,
                    "categoria": categoria,
                    "id_subcategoria": id_subcategoria, 
                    subcategoria: subcategoria,   
                    "trazable": es_trazable,
                    
                }
                medicamentos_collection.insert_one(medicamento_doc)
                count += 1
            except KeyError as ke: 
                print(f"Error de KeyError en medicamentos (columna no encontrada, verifica las constantes COL_... y los nombres en Excel): {ke} - Fila: {row.to_dict()}")
            except Exception as e_row: 
                print(f"Error procesando fila en medicamentos: {e_row} - Fila: {row.to_dict()}")
        
        print(f"Migración de medicamentos completada. {count} documentos insertados en 'medicamentos'.")
        
        if count > 0:
            index_name = "busqueda_medicamentos_nombre_codigo_v2" # Nuevo nombre para el índice
            try:
                existing_indexes = medicamentos_collection.index_information()
                for idx_name_loop in list(existing_indexes.keys()):
                    if idx_name_loop.startswith("busqueda_medicamentos"):
                        medicamentos_collection.drop_index(idx_name_loop)
                        print(f"Índice '{idx_name_loop}' anterior eliminado.")
            except Exception: pass
            
            medicamentos_collection.create_index(
                [("nombre", TEXT), ("codigo_medicamento", TEXT)], 
                default_language='spanish', 
                name=index_name
            )
            print(f"Índice de texto '{index_name}' creado en 'medicamentos' para 'nombre' y 'codigo_medicamento'.")
    except FileNotFoundError: print(f"Error: Archivo Excel no encontrado en la ruta: {excel_filepath}")
    except ValueError as ve: # Errores al leer la hoja de Excel
        if "Worksheet" in str(ve) and "not found" in str(ve): print(f"Error: Hoja '{sheet_name}' no encontrada en '{excel_filepath}'.")
        else: print(f"Error al leer Excel (medicamentos): {ve}")
    except Exception as e: # Errores inesperados en la función
        print(f"Error inesperado (medicamentos): {e}")

if __name__ == '__main__':
    print(f"Iniciando proceso de migración desde: {EXCEL_FILEPATH}")
    if not os.path.exists(EXCEL_FILEPATH):
        print(f"ERROR CRÍTICO: '{EXCEL_FILENAME}' no en '{DATA_SUBFOLDER}'. Ruta: {EXCEL_FILEPATH}")
    else:
        # Nombres de hoja como los listó `listar_hojas.py` (Title Case)
        migrate_laboratorios(EXCEL_FILEPATH, sheet_name='Laboratorio')
        migrate_monodrogas(EXCEL_FILEPATH, sheet_name='Monodroga')   
        migrate_categorias_principales(EXCEL_FILEPATH, sheet_name='Categorias') # Lee de la hoja "Categorias"
        migrate_subcategorias(EXCEL_FILEPATH, sheet_name='Subcategoria')     # Lee de la nueva hoja "Subcategoria"
        migrate_sucursales(EXCEL_FILEPATH, sheet_name='Sucursales') 
        migrate_medicamentos(EXCEL_FILEPATH, sheet_name='Base')     
        
        print("\nTodas las migraciones intentadas.")
    if client:
        client.close()
        print("Conexión a MongoDB cerrada.")
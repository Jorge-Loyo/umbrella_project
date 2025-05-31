import pandas as pd
import os

# --- Configuración ---
# Asegúrate de que estas variables apunten a tu archivo Excel correctamente
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_SUBFOLDER = "datos_csv" # La subcarpeta donde está tu archivo Excel
EXCEL_FILENAME = "Base de datos Umbrella.xlsx" # El nombre exacto de tu archivo Excel
# --- Fin de Configuración ---

EXCEL_FILEPATH = os.path.join(BASE_DIR, DATA_SUBFOLDER, EXCEL_FILENAME)

print(f"Intentando acceder al archivo Excel en: {EXCEL_FILEPATH}")

try:
    if os.path.exists(EXCEL_FILEPATH):
        # Carga el archivo Excel
        xls = pd.ExcelFile(EXCEL_FILEPATH)

        # Imprime la lista de nombres de las hojas encontradas
        print(f"\nNombres de las hojas encontrados en el archivo '{EXCEL_FILENAME}':")
        sheet_names_list = xls.sheet_names
        print(sheet_names_list)

        if not sheet_names_list:
            print("\nADVERTENCIA: No se encontraron hojas en el archivo Excel.")
        else:
            print("\nPor favor, compara estos nombres con los que usa el script 'migrate_data.py'.")
            print("Deben coincidir EXACTAMENTE (mayúsculas, minúsculas, espacios, etc.).")

    else:
        print(f"\nERROR CRÍTICO: El archivo Excel '{EXCEL_FILENAME}' NO FUE ENCONTRADO en la carpeta '{DATA_SUBFOLDER}'.")
        print(f"Verifica la ruta completa: {EXCEL_FILEPATH}")
        print("Asegúrate de que el nombre del archivo y la subcarpeta sean correctos y que el archivo exista allí.")

except Exception as e:
    print(f"\nOcurrió un error al intentar leer el archivo Excel o sus hojas: {e}")
    print("Esto podría deberse a que el archivo está corrupto, no es un formato Excel válido (.xlsx),")
    print("o la librería 'openpyxl' podría no estar instalada correctamente (intenta 'pip install openpyxl').")
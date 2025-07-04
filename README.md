# Proyecto Umbrella: Sistema de Gestión y Etiquetado

## 1. Descripción del Proyecto

**Umbrella** es una aplicación web desarrollada en Flask diseñada para la gestión de insumos y la generación de etiquetas en un entorno farmacéutico o de laboratorio. El sistema permite un control detallado sobre medicamentos, incluyendo su trazabilidad, y ofrece funcionalidades robustas de administración de usuarios con diferentes niveles de permisos.

La aplicación está orientada a optimizar el flujo de trabajo, reducir errores y centralizar la información de manera segura y eficiente.

## 2. Características Principales

- **Autenticación de Usuarios:** Sistema de inicio de sesión seguro con contraseñas encriptadas (bcrypt).
- **Gestión de Roles:** Dos niveles de permisos definidos:
  - **Administrador:** Acceso total a todas las funcionalidades, incluyendo la gestión de usuarios, medicamentos, categorías, etc.
  - **Operario:** Acceso restringido a las funciones esenciales del día a día, como la generación de etiquetas.
- **Generador de Etiquetas Dinámico:**
  - Búsqueda de medicamentos con autocompletado.
  - Generación de etiquetas con información detallada del producto.
  - Creación de códigos QR únicos para cada etiqueta, conteniendo información clave como código de producto, lote y fecha de vencimiento.
- **Previsualización e Impresión:** Modal de vista previa para verificar la etiqueta antes de imprimir y función de impresión adaptada a formatos específicos (ej. 60mm x 45mm).
- **Exportación de Datos:** Generación de archivos `.csv` con los datos de la etiqueta, listos para ser utilizados por sistemas externos como NiceLabel.
- **Administración Centralizada (CRUD):** Formularios para crear, leer, actualizar y eliminar (CRUD) entidades clave del sistema como:
  - Usuarios
  - Medicamentos
  - Monodrogas
  - Laboratorios
  - Categorías y Subcategorías

---

## 3. Tecnologías Utilizadas

- **Backend:**

  - **Framework:** Flask
  - **Base de Datos:** MongoDB (conectado a través de MongoDB Atlas)
  - **Librerías Python:**
    - `pymongo`: Driver oficial para interactuar con MongoDB.
    - `Flask-Login`: Para gestionar las sesiones de usuario.
    - `bcrypt`: Para la encriptación segura de contraseñas.
    - `pandas`: Para la generación de archivos Excel/CSV.
    - `python-dotenv`: Para la gestión de variables de entorno.

- **Frontend:**
  - **Lenguajes:** HTML5, CSS3, JavaScript (ES6)
  - **Frameworks y Librerías:**
    - **Bootstrap 5:** Para el diseño responsive y componentes de la interfaz.
    - **Font Awesome:** Para la iconografía.
    - **qrcode.js:** Para la generación de códigos QR en el lado del cliente.

---

## 4. Instalación y Ejecución

Para correr este proyecto en un entorno de desarrollo local, sigue los siguientes pasos.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Python 3.8+](https://www.python.org/downloads/)
- `pip` (generalmente se instala con Python)
- Una cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para crear una base de datos en la nube.

### Pasos de Instalación

1.  **Clonar el Repositorio**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_PROYECTO>
    ```

2.  **Crear y Activar un Entorno Virtual**
    Es una buena práctica aislar las dependencias del proyecto.
    ```bash
    # Para Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

````

3.  **Instalar Dependencias**

 pip install -r requirements.txt


4.  **Configurar Variables de Entorno**
 Crea un archivo llamado `.env` en la raíz de tu proyecto. Este archivo guardará tus credenciales de forma segura.


5.  **Ejecutar la Aplicación**
 Una vez que el entorno virtual esté activado y las dependencias instaladas, puedes iniciar el servidor de Flask:
 ```bash
 flask run
 o
 python run.py
 ```
 La aplicación estará disponible en `http://127.0.0.1:5000` en tu navegador.

 Usuario: Jloyo
 Contraseña: 2580

---

Key: 904598d29a045df8c5a175e79b9b79240ec5ff4d3df517e1
````

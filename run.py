from app import create_app # Importa la función factory create_app desde el paquete app

app = create_app() # Crea una instancia de la aplicación usando la factory

if __name__ == '__main__':
    # Inicia el servidor de desarrollo de Flask
    # debug=True permite recarga automática en cambios y un depurador en el navegador
    # host='0.0.0.0' hace que el servidor sea accesible desde otras máquinas en la red (opcional)
    app.run(host='0.0.0.0', port=5000, debug=app.config.get('DEBUG', True))
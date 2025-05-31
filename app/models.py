
# Asegúrate de tener estas importaciones al inicio del archivo:
# from werkzeug.security import generate_password_hash # Ya no usaremos esto para set_password
import bcrypt # Asegúrate de que bcrypt esté importado
from flask_login import UserMixin
from app import get_db

class User(UserMixin):
    def __init__(self, username, email=None, lugar_de_trabajo=None, nombre=None, apellido=None, role="operario", id=None, hashed_password=None):
        self.id = username
        self.username = username
        self.email = email
        self.lugar_de_trabajo = lugar_de_trabajo
        self.nombre = nombre
        self.apellido = apellido
        self.role = role
        self._hashed_password = hashed_password

    def get_id(self):
        return str(self.id)

    def set_password(self, password):
        """Genera un hash para la contraseña usando bcrypt y lo guarda."""
        # Convierte la contraseña a bytes
        password_bytes = password.encode('utf-8')
        # Genera un salt
        salt = bcrypt.gensalt()
        # Crea el hash
        self._hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8') # Guarda el hash como string

    def check_password(self, password):
        """Verifica la contraseña proporcionada contra el hash almacenado usando bcrypt."""
        if self._hashed_password is None:
            return False
        try:
            password_bytes = password.encode('utf-8')
            stored_hash_bytes = self._hashed_password.encode('utf-8')
            return bcrypt.checkpw(password_bytes, stored_hash_bytes)
        except Exception as e:
            print(f"Error en bcrypt.checkpw: {e}")
            return False

    @staticmethod
    def get(user_id):
        db = get_db()
        user_data = db.usuarios.find_one({"nombre_usuario": user_id})
        if user_data:
            user = User(
                username=user_data.get("nombre_usuario"),
                email=user_data.get("mail"),
                lugar_de_trabajo=user_data.get("lugar_de_trabajo"),
                nombre=user_data.get("nombre"),
                apellido=user_data.get("apellido"),
                role=user_data.get("role", "operario"),
                id=user_data.get("nombre_usuario"),
                hashed_password=user_data.get("contrasena")
            )
            return user
        return None

    @staticmethod
    def find_by_username(username):
        return User.get(username)
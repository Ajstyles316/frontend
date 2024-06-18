from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import json
import enfermedadesData from './enfermedades.json';
import pacienteData from './paciente.json';
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/example'
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False, name='nombre')
    password = db.Column(db.String(100), nullable=False, name='contrasena')
    correo = db.Column(db.String(255), nullable=False, name='correo')

class Session(db.Model):
    __tablename__ = 'sesiones'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(255), nullable=False)
    user = db.relationship('User', backref=db.backref('sessions', lazy=True))

class Child(db.Model):
    __tablename__ = 'hijos'
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False, name='nombre')
    birthdate = db.Column(db.Date, nullable=False, name='fecha_nacimiento')
    parent = db.relationship('User', backref=db.backref('children', lazy=True))

class Enfermedad(db.Model):
    __tablename__ = 'enfermedades'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)
    tratamientos = db.relationship('Tratamiento', backref='enfermedad', lazy=True)

class Tratamiento(db.Model):
    __tablename__ = 'tratamientos'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    diagnostico = db.Column(db.String(255), nullable=False)
    medicamentos = db.Column(db.String(255), nullable=False)
    plan_tratamiento = db.Column(db.String(255), nullable=False)
    progreso = db.Column(db.String(255), nullable=True)

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    genero = db.Column(db.String(10), nullable=False)
    historiales = db.relationship('HistorialMedico', backref='paciente', lazy=True)

class HistorialMedico(db.Model):
    __tablename__ = 'historial_medico'
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    enfermedad = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)
    fecha_diagnostico = db.Column(db.Date, nullable=False)
    recetas = db.Column(db.String(255), nullable=False)
    medicamentos = db.Column(db.String(255), nullable=False)

@app.route('/get_pacientes', methods=['GET'])
def get_pacientes():
    with open('paciente.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['nombre'], password=data['contrasena'], correo=data['correo'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['nombre']).first()
    if not user or not user.password == data['contrasena']:
        return jsonify({'message': 'login failed'})
    return jsonify({'message': 'login successful'})

@app.route('/save_session', methods=['POST'])
def save_session():
    data = request.get_json()
    user = User.query.filter_by(username=data['nombre']).first()
    if user:
        new_session = Session(
            user_id=user.id,
            username=user.username,
            description=data['descripcion']
        )
        db.session.add(new_session)
        db.session.commit()
        return jsonify({'message': 'session saved successfully'})
    return jsonify({'message': 'user not found'}), 404

@app.route('/get_sessions', methods=['GET'])
def get_sessions():
    sessions = Session.query.all()
    session_list = [{
        'nombre': session.username,
        'fecha': session.date.strftime("%Y-%m-%d %H:%M:%S"),
        'descripcion': session.description
    } for session in sessions]
    return jsonify(session_list)

@app.route('/register_child', methods=['POST'])
def register_child():
    data = request.get_json()
    parent = User.query.filter_by(username=data['parent_username']).first()
    if parent:
        new_child = Child(
            parent_id=parent.id,
            name=data['nombre'],
            birthdate=datetime.strptime(data['fecha_nacimiento'], "%Y-%m-%d")
        )
        db.session.add(new_child)
        db.session.commit()
        return jsonify({'message': 'child registered successfully'})
    return jsonify({'message': 'parent not found'}), 404

@app.route('/get_children/<username>', methods=['GET'])
def get_children(username):
    parent = User.query.filter_by(username=username).first()
    if parent:
        children = Child.query.filter_by(parent_id=parent.id).all()
        children_list = [{
            'nombre': child.name,
            'fecha_nacimiento': child.birthdate.strftime("%Y-%m-%d")
        } for child in children]
        return jsonify(children_list)
    return jsonify({'message': 'parent not found'}), 404

@app.route('/get_enfermedades', methods=['GET'])
def get_enfermedades():
    with open('enfermedades.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)

@app.route('/create_plan_tratamiento', methods=['POST'])
def create_plan_tratamiento():
    data = request.get_json()
    paciente_id = data['paciente_id']
    diagnostico = data['diagnostico']
    medicamentos = data['medicamentos']
    plan_tratamiento = data['planTratamiento']
    nuevo_plan = Tratamiento(
        paciente_id=paciente_id,
        diagnostico=diagnostico,
        medicamentos=medicamentos,
        plan_tratamiento=plan_tratamiento
    )
    db.session.add(nuevo_plan)
    db.session.commit()
    return jsonify({'message': 'Plan de tratamiento creado'})

@app.route('/get_informe/<int:id>', methods=['GET'])
def get_informe(id):
    tratamiento = Tratamiento.query.get(id)
    if tratamiento:
        paciente = Paciente.query.get(tratamiento.paciente_id)
        informe = {
            'paciente': {
                'nombre': paciente.nombre,
                'edad': paciente.edad,
                'genero': paciente.genero
            },
            'diagnostico': tratamiento.diagnostico,
            'medicamentos': tratamiento.medicamentos.split(','),
            'planTratamiento': tratamiento.plan_tratamiento,
            'progreso': tratamiento.progreso
        }
        return jsonify(informe)
    return jsonify({'message': 'Tratamiento no encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)

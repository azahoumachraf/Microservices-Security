from flask import Flask, request, jsonify
import sqlite3


app = Flask(__name__)

# Connexion à la base SQLite
def get_db():
    conn = sqlite3.connect('employees.db')
    conn.execute('CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY, name TEXT, position TEXT, departement REAL)')
    return conn

@app.route('/', methods=['GET'])
def get_employees():
    conn = get_db()
    employees = conn.execute('SELECT * FROM employees').fetchall()
    conn.close()
    return jsonify(employees)

@app.route('/', methods=['POST'])
def add_employee():
    data = request.json
    conn = get_db()
    conn.execute('INSERT INTO employees (name, position, departement) VALUES (?, ?, ?)',
                 (data['name'], data['position'], data['departement']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Employee added"}), 201

@app.route('/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    conn = get_db()
    conn.execute('DELETE FROM employees WHERE id = ?', (employee_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Employee deleted"})

@app.route('/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    conn = get_db()
    
    # Vérifier si l'employé existe
    employee = conn.execute('SELECT * FROM employees WHERE id = ?', (employee_id,)).fetchone()
    if employee is None:
        conn.close()
        return jsonify({"error": "Employee not found"}), 404
    
    # Mettre à jour les données de l'employé
    updated_name = data.get('name', employee[1])
    updated_position = data.get('position', employee[2])
    updated_department = data.get('departement', employee[3])

    conn.execute('UPDATE employees SET name = ?, position = ?, departement = ? WHERE id = ?', 
                 (updated_name, updated_position, updated_department, employee_id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Employee updated successfully", 
                    "employee": {"id": employee_id, "name": updated_name, "position": updated_position, "departement": updated_department}})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)

from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Connexion à la base SQLite
def get_db():
    conn = sqlite3.connect('users.db')
    conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)')
    return conn

@app.route('/', methods=['GET'])
def get_users():
    conn = get_db()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()
    return jsonify(users)

@app.route('/', methods=['POST'])
def add_user():
    data = request.get_json()  # Récupère les données JSON
    print(data)  # Affiche le contenu de 'data' pour déboguer

    # Vérifie si les données sont présentes et si chaque champ requis est dans 'data'
    missing_fields = []
    
    if not data:
        missing_fields.append('body')
    else:
        if 'name' not in data:
            missing_fields.append('name')
        if 'email' not in data:
            missing_fields.append('email')
        if 'phone' not in data:
            missing_fields.append('phone')
    
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Ajout des données à la base
    conn = get_db()
    conn.execute('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)', 
                 (data['name'], data['email'], data['phone']))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "User added"}), 201

@app.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user_data = request.get_json()
    
    conn = get_db()
    # Recherche de l'utilisateur par son ID dans la base de données
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    
    if user is None:
        return jsonify({"message": "User not found"}), 404
    
    # Mise à jour des données de l'utilisateur
    updated_name = user_data.get('name', user[1])
    updated_email = user_data.get('email', user[2])
    updated_phone = user_data.get('phone', user[3])
    
    conn.execute('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', 
                 (updated_name, updated_email, updated_phone, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "User updated successfully", "user": {"id": user_id, "name": updated_name, "email": updated_email, "phone": updated_phone}})

@app.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db()
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "User deleted"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

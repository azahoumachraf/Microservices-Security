from flask import Flask, request, jsonify
import sqlite3


app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('orders.db')
    conn.execute('CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, user_id INTEGER, product_id INTEGER, quantity INTEGER)')
    return conn

@app.route('/', methods=['GET'])
def get_orders():
    conn = get_db()
    orders = conn.execute('SELECT * FROM orders').fetchall()
    conn.close()
    return jsonify(orders)

@app.route('/', methods=['POST'])
def add_order():
    data = request.json
    conn = get_db()
    conn.execute('INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)', 
                 (data['user_id'], data['product_id'], data['quantity']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Order placed"}), 201

@app.route('/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    conn = get_db()
    
    # Vérifier si la commande existe
    order = conn.execute('SELECT * FROM orders WHERE id = ?', (order_id,)).fetchone()
    if order is None:
        conn.close()
        return jsonify({"error": "Order not found"}), 404
    
    # Mettre à jour les données de la commande
    updated_user_id = data.get('user_id', order[1])
    updated_product_id = data.get('product_id', order[2])
    updated_quantity = data.get('quantity', order[3])

    conn.execute('UPDATE orders SET user_id = ?, product_id = ?, quantity = ? WHERE id = ?', 
                 (updated_user_id, updated_product_id, updated_quantity, order_id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Order updated successfully", 
                    "order": {"id": order_id, "user_id": updated_user_id, "product_id": updated_product_id, "quantity": updated_quantity}})

@app.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    conn = get_db()
    conn.execute('DELETE FROM orders WHERE id = ?', (order_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Order deleted"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
    #app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)

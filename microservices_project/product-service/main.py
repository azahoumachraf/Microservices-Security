from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('products.db')
    conn.execute('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL, stock INTEGER)')
    return conn

@app.route('/', methods=['GET'])
def get_products():
    conn = get_db()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return jsonify(products)

@app.route('/', methods=['POST'])
def add_product():
    data = request.json
    conn = get_db()
    conn.execute('INSERT INTO products (name, price, stock) VALUES (?, ?,?)', (data['name'], data['price'],data['stock']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product added"}), 201

@app.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db()
    conn.execute('DELETE FROM products WHERE id = ?', (product_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product deleted"})

@app.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    conn = get_db()
    
    # Vérifier si le produit existe
    product = conn.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()
    if product is None:
        conn.close()
        return jsonify({"error": "Product not found"}), 404
    
    # Mettre à jour les données du produit
    updated_name = data.get('name', product[1])
    updated_price = data.get('price', product[2])
    updated_stock = data.get('stock', product[3])

    conn.execute('UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?', 
                 (updated_name, updated_price, updated_stock, product_id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Product updated successfully", 
                    "product": {"id": product_id, "name": updated_name, "price": updated_price, "stock": updated_stock}})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
    #app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)

from flask import Flask, request, jsonify
from prometheus_client import generate_latest, Counter, CONTENT_TYPE_LATEST


app = Flask(__name__)

# recently added
REQUEST_COUNT = Counter('request_count', 'Total number of requests')

@app.route('/', methods=['POST'])
def send_notification():
    REQUEST_COUNT.inc()  # recently added by achraf
    data = request.json
    return jsonify({"message": f"Notification sent to user {data['user_id']}"}), 200

#recently added by a 
@app.route('/metrics', methods=['GET'])
def metrics():
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

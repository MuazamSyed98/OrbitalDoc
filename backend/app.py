from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from change_detector import detect_change

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/api/test-detection", methods=["GET"])
def test_detection():
    # Proper full path using os.path.join
    base_dir = os.path.abspath(os.path.dirname(__file__))
    img1 = os.path.join(base_dir, "../data/sample_before.png")
    img2 = os.path.join(base_dir, "../data/sample_after.png")
    
    try:
        result = detect_change(img1, img2)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/")
def home():
    return jsonify({"message": "✅ OrbitalDoc Flask backend is running!"})

@app.route("/api/fetch-satellite", methods=["GET"])
def fetch_satellite():
    return jsonify({"message": "Satellite fetch endpoint is ready!"})
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)

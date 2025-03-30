from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from pathlib import Path
from dotenv import load_dotenv
from change_detector import detect_change
from satellite_fetcher import fetch_satellite_images

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Health check route
@app.route("/")
def home():
    return jsonify({"message": "✅ OrbitalDoc Flask backend is running!"})


# Test detection route (for placeholder logic)
@app.route("/api/test-detection", methods=["GET"])
def test_detection():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    img1 = os.path.join(base_dir, "../data/sample_before.png")
    img2 = os.path.join(base_dir, "../data/sample_after.png")
    
    try:
        result = detect_change(img1, img2)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Real satellite fetch route
@app.route("/api/fetch-satellite", methods=["POST"])
def fetch_satellite():
    try:
        data = request.get_json()

        if not data:
            raise ValueError("❌ No JSON data received.")

        bounds = data.get("bounds")
        date_from = data.get("startDate")
        date_to = data.get("endDate")

        if not bounds or not date_from or not date_to:
            raise ValueError("❌ Missing one or more required parameters (bounds, startDate, endDate).")

        # Format bounds as [W, S, E, N]
        w, s = bounds[0][1], bounds[0][0]
        e, n = bounds[1][1], bounds[1][0]
        formatted_bounds = [w, s, e, n]

        print("📦 Bounds:", formatted_bounds)
        print("📆 Dates:", date_from, "→", date_to)

        # Fetch both before and after images
        before_path, after_path = fetch_satellite_images(formatted_bounds, date_from, date_to)

        # Return both paths relative to backend
        return jsonify({
            "message": "✅ Satellite images fetched successfully",
            "beforeImage": os.path.relpath(before_path, start=os.path.dirname(__file__)).replace("\\", "/"),
            "afterImage": os.path.relpath(after_path, start=os.path.dirname(__file__)).replace("\\", "/")
        })

    except Exception as e:
        print("🚨 Error in /api/fetch-satellite:", str(e))
        return jsonify({ "error": str(e) }), 500


# Serve images from /data folder
@app.route('/data/<path:filename>')
def serve_data_image(filename):
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    return send_from_directory(data_dir, filename)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)

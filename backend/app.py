import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from change_detector import detect_change
from satellite_fetcher import fetch_satellite_images

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "OrbitalDoc Flask backend is running!"})

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

@app.route("/api/fetch-satellite", methods=["POST"])
def fetch_satellite():
    try:
        data = request.get_json()

        if not data:
            raise ValueError("No JSON data received.")

        bounds = data.get("bounds")
        date_from = data.get("startDate")
        date_to = data.get("endDate")

        if not bounds or not date_from or not date_to:
            raise ValueError("Missing bounds, startDate or endDate")

        # Format bounds as [W, S, E, N]
        w, s = bounds[0][1], bounds[0][0]
        e, n = bounds[1][1], bounds[1][0]
        formatted_bounds = [w, s, e, n]

        print("📦 Bounds:", formatted_bounds)
        print("🗖 Dates:", date_from, "→", date_to)

        # Ensure pair folder exists for AI training later
        pair_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ml", "data", "pairs"))
        os.makedirs(pair_dir, exist_ok=True)

        # Fetch images
        before_path, after_path = fetch_satellite_images(formatted_bounds, date_from, date_to)

        # ✅ Calculate change score
        change_score, pixel_change_count = calculate_change_score(before_path, after_path)

        # Import model prediction only here to avoid OOM
        from ml.predictor import predict_change_class
        ai_prediction = predict_change_class(before_path, after_path)

        return jsonify({
            "message": "✅ Satellite images fetched successfully",
            "beforeImage": os.path.relpath(before_path, start=os.path.dirname(__file__)).replace("\\", "/"),
            "afterImage": os.path.relpath(after_path, start=os.path.dirname(__file__)).replace("\\", "/"),
            "change_score": change_score,
            "pixel_change_count": pixel_change_count,
            "cloud_coverage_percentage": calculate_cloud_coverage(after_path),
            "ai_prediction": ai_prediction
        })

    except Exception as e:
        print("🚨 Error in /api/fetch-satellite:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/data/<path:filename>')
def serve_data_image(filename):
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    return send_from_directory(data_dir, filename)

def calculate_change_score(before_path, after_path):
    before = Image.open(before_path).convert("L")
    after = Image.open(after_path).convert("L")
    before_arr = np.array(before)
    after_arr = np.array(after)

    if before_arr.shape != after_arr.shape:
        before_arr = np.resize(before_arr, after_arr.shape)

    diff = np.abs(before_arr.astype("int") - after_arr.astype("int"))
    pixel_change_count = np.sum(diff > 30)
    total_pixels = diff.size
    change_score = int((pixel_change_count / total_pixels) * 100)

    return change_score, int(pixel_change_count)

def calculate_cloud_coverage(image_path, threshold=200):
    image = Image.open(image_path).convert("L")
    arr = np.array(image)
    cloud_pixels = np.sum(arr > threshold)
    total_pixels = arr.size
    return round((cloud_pixels / total_pixels) * 100, 2)

@app.route("/ping")
def ping():
    return "pong", 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)

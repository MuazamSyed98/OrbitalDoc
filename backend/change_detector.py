import cv2
import numpy as np
import tensorflow as tf

def preprocess_image(image_path):
    """
    Loads and preprocesses an image for model input.
    """
    print(f"🔄 Preprocessing: {image_path}")
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image not found: {image_path}")
    
    image = cv2.resize(image, (256, 256))  # or whatever your model needs
    image = image / 255.0
    return np.expand_dims(image, axis=0)  # shape: (1, 256, 256, 3)

def detect_change(image_before_path, image_after_path, model_path=None):
    """
    Compares two satellite images and returns change mask or score.
    """
    img_before = preprocess_image(image_before_path)
    img_after = preprocess_image(image_after_path)

    # Placeholder: Compute pixel-wise difference
    print("🧠 Running change detection (placeholder logic)")
    diff = np.abs(img_before - img_after)
    score = np.mean(diff)
    
    return {
        "change_score": round(float(score), 4),
        "message": "🧪 Change detection logic placeholder"
    }

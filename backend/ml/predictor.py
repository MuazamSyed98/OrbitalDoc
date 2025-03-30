import numpy as np
from PIL import Image
import tensorflow as tf
import os

# ✅ Resolve absolute path to the model
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "change_classifier_model.h5"))
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_images(before_path, after_path):
    """
    Loads, resizes, normalizes and stacks two images along the channel axis.
    Output shape: (1, 128, 128, 6)
    """
    before = Image.open(before_path).resize((128, 128)).convert("RGB")
    after = Image.open(after_path).resize((128, 128)).convert("RGB")

    before_arr = np.array(before) / 255.0
    after_arr = np.array(after) / 255.0

    stacked = np.concatenate((before_arr, after_arr), axis=2)  # (128, 128, 6)
    return np.expand_dims(stacked, axis=0)  # (1, 128, 128, 6)

def predict_change_class(before_path, after_path):
    """
    Returns 1 if the model predicts substantial change, else 0.
    """
    x = preprocess_images(before_path, after_path)
    pred = model.predict(x)[0][0]
    return int(pred > 0.5)

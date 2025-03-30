import os
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras import layers, models

# Config
PAIR_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "pairs"))
MODEL_PATH = os.path.join("ml", "change_classifier_model.h5")

# Preprocessing
def load_pair(base_name):
    before_path = os.path.join(PAIR_DIR, f"{base_name}_before.png")
    after_path = os.path.join(PAIR_DIR, f"{base_name}_after.png")
    label_path = os.path.join(PAIR_DIR, f"{base_name}_label.txt")

    before = Image.open(before_path).resize((128, 128)).convert("RGB")
    after = Image.open(after_path).resize((128, 128)).convert("RGB")

    before_arr = np.array(before) / 255.0
    after_arr = np.array(after) / 255.0
    stacked = np.concatenate((before_arr, after_arr), axis=2)  # (128, 128, 6)

    with open(label_path, "r") as f:
        label = int(f.read().strip())

    return stacked, label

# Load all data
X, y = [], []
for file in os.listdir(PAIR_DIR):
    if file.endswith("_before.png"):
        base = file.replace("_before.png", "")
        img, label = load_pair(base)
        X.append(img)
        y.append(label)

X = np.array(X)
y = np.array(y)

print(f"Loaded {len(X)} image pairs ✅")

# Build Model
model = models.Sequential([
    layers.Input(shape=(128, 128, 6)),
    layers.Conv2D(16, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(1, activation='sigmoid')  # Binary output
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train
model.fit(X, y, epochs=20, batch_size=4, verbose=1)

# Save model
model.save(MODEL_PATH)
print(f"✅ Model saved to: {MODEL_PATH}")

from main import app
from flask import render_template, request, jsonify
from keras.models import load_model
import mediapipe as mp
import cv2
import numpy as np
import base64
import re

model = load_model('keras_model.h5')

# Mediapipe
hands = mp.solutions.hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Classes
classes = [
    'A','B','C','D','E','F','G','H','I','J','L','M','N'
]   

@app.post("/predict")
def predict():
    data = request.get_json()
    img_data = data["image"]

    # Remove prefixo data:image/png;base64,
    img_str = re.sub("^data:image/.+;base64,", "", img_data)
    img_bytes = base64.b64decode(img_str)

    # Converte bytes → array numpy → imagem OpenCV
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"prediction": None})

    # Inverter imagem (modo espelho)
    img = cv2.flip(img, 1)

    h, w, _ = img.shape
    frameRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(frameRGB)

    if not results.multi_hand_landmarks:
        return jsonify({"prediction": None})

    hand = results.multi_hand_landmarks[0]

    x_max, y_max = 0, 0
    x_min, y_min = w, h

    for lm in hand.landmark:
        x, y = int(lm.x * w), int(lm.y * h)
        x_min = min(x_min, x)
        x_max = max(x_max, x)
        y_min = min(y_min, y)
        y_max = max(y_max, y)

    x1 = max(0, x_min - 50)
    y1 = max(0, y_min - 50)
    x2 = min(w, x_max + 50)
    y2 = min(h, y_max + 50)

    crop = img[y1:y2, x1:x2]

    if crop.size == 0:
        return jsonify({"prediction": None})

    crop = cv2.resize(crop, (224, 224))
    crop = (crop.astype(np.float32) / 127.0) - 1
    crop = np.expand_dims(crop, axis=0)

    prediction = model.predict(crop, verbose=0)
    index = np.argmax(prediction)
    letra = classes[index]

    return jsonify({"prediction": letra})


@app.route('/')
def homepage():
    return render_template("index.html")

@app.route('/configuracoes.html')
def configuracoes():
    return render_template("configuracoes.html")

@app.route("/traduzir.html")
def traduzir():
    return render_template("traduzir.html")

@app.route('/ajuda.html')
def ajuda():
    return render_template("ajuda.html")

@app.route('/sobre.html')
def sobre():
    return render_template("sobre.html")

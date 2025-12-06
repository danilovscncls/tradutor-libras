const video = document.getElementById("webcam");
const canvas = document.getElementById("captureCanvas");
const resultBox = document.getElementById("translatedText");
const startBtn = document.getElementById("startBtn");

const stopBtn = document.getElementById("stopBtn");
let stream = null;
let intervalId = null;


// Ativa webcam
startBtn.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Começa ciclo de captura a cada 300ms
    setInterval(captureAndSend, 300);
});

function captureAndSend() {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o frame atual no canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converte para base64 PNG
    const imageData = canvas.toDataURL("image/png");

    // Envia para o backend
    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData })
    })
    .then(res => res.json())
    .then(data => {
        resultBox.textContent = data.prediction || "(nenhuma mão detectada)";
    })
    .catch(err => console.error(err));
}

// Corrige o start para guardar o stream e o interval
startBtn.addEventListener("click", async () => {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(captureAndSend, 300);
});

// Botão de parar
stopBtn.addEventListener("click", () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }

    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});
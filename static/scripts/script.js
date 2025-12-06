const statusEl = document.getElementById('status');
const logEl = document.getElementById('log');
const outputEl = document.getElementById('output');
const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const canvasCtx = canvasElement.getContext("2d");
let camera = null;
let hands = null;
let lastRecognizedText = ""; // Para evitar repetição da fala

function log(msg) {
    console.log(msg);
    logEl.textContent += msg + "\n";
    logEl.scrollTop = logEl.scrollHeight;
}
function setStatus(msg, ok=true) {
    statusEl.textContent = "Status: " + msg;
    statusEl.className = ok ? 'ok' : 'error';
    log("STATUS: " + msg);
}
function showError(msg) {
    setStatus(msg, false);
    log("ERRO: " + msg);
}
function speak(text) {
    try {
    let u = new SpeechSynthesisUtterance(text);
    u.lang = 'pt-BR';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    } catch(e) {
    log("TTS erro: " + e);
    }
}

// Checagens rápidas ao clicar no botão
document.getElementById('runCheck').addEventListener('click', async () => {
    logEl.textContent = "";
    setStatus("Executando checagens...");
    if (!window.isSecureContext && location.hostname !== "localhost") {
    showError("Contexto inseguro: abra via http(s) ou localhost.");
    } else {
    setStatus("Contexto seguro OK.");
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError("API getUserMedia não suportada neste navegador.");
    return;
    } else {
    log("getUserMedia disponível.");
    }
    try {
    const wasmUrl = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.wasm';
    const r = await fetch(wasmUrl);
    if (r.ok) {
        log("Fetch wasm OK (status " + r.status + ").");
        setStatus("Dependências CDN acessíveis.");
    } else {
        showError("Não foi possível baixar o WASM do MediaPipe (status " + r.status + ").");
    }
    } catch(e) {
    showError("Falha no fetch WASM: " + e);
    }
});

// Captura erros globais
window.addEventListener('error', (ev) => {
    log("Global error: " + ev.message + " @ " + ev.filename + ":" + ev.lineno);
    setStatus("Erro global (veja console).", false);
});
window.addEventListener('unhandledrejection', (ev) => {
    log("Unhandled rejection: " + ev.reason);
    setStatus("Rejeição não tratada (veja console).", false);
});

async function initHands() {
    log("Iniciando MediaPipe Hands...");
    try {
    hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    } catch(e) {
    showError("Falha ao inicializar Hands: " + e);
    return;
    }

    hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.65,
    minTrackingConfidence: 0.65
    });

    hands.onResults((results) => {
        try {
            canvasElement.width = videoElement.videoWidth || 640;
            canvasElement.height = videoElement.videoHeight || 480;
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            if (results.image) {
                canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
            }

            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                for (const landmarks of results.multiHandLandmarks) {
                    drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
                    drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1 });

                    let currentText = "Aguardando gesto...";
                    
                    const isIndexUp = landmarks[8].y < landmarks[6].y;
                    const isMiddleUp = landmarks[12].y < landmarks[10].y;
                    const isRingUp = landmarks[16].y < landmarks[14].y;
                    const isPinkyUp = landmarks[20].y < landmarks[18].y;
                    const isThumbAcross = landmarks[4].x < landmarks[3].x;
                    const isThumbOut = landmarks[4].y < landmarks[2].y && landmarks[4].x < landmarks[5].x;

                    // --- Lógica de Reconhecimento com if/else if ---

                    // LETRA B: 4 dedos esticados, polegar cruzado
                    if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp && isThumbAcross) {
                        currentText = "B";
                    }
                    // OBRIGADO: 4 dedos esticados (polegar não cruzado)
                    else if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) {
                        currentText = "OBRIGADO";
                    }
                    // LETRA L: Indicador e polegar esticados, outros dobrados
                    else if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp && isThumbOut) {
                        currentText = "L";
                    }
                    // SIM: Apenas indicador esticado
                    else if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
                        currentText = "SIM";
                    }
                    // LETRA S: Punho fechado com polegar sobre os dedos
                    else if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp && landmarks[4].x > landmarks[5].x) {
                        currentText = "S";
                    }
                    // NÃO: Punho fechado (regra genérica, por último)
                    else if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
                        currentText = "NÃO";
                    }

                    outputEl.innerText = currentText;

                    if (currentText !== "Aguardando gesto..." && currentText !== lastRecognizedText) {
                        speak(currentText);
                        lastRecognizedText = currentText;
                    } else if (currentText === "Aguardando gesto...") {
                        lastRecognizedText = "";
                    }
                }
            } else {
                outputEl.innerText = "Nenhuma mão detectada";
                lastRecognizedText = "";
            }
            canvasCtx.restore();
        } catch (e) {
            log("Erro em onResults: " + e);
        }
    });

    try {
    camera = new Camera(videoElement, {
        onFrame: async () => {
        await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    await camera.start();
    setStatus("Câmera iniciada e MediaPipe pronto.");
    log("Camera start OK.");
    } catch(e) {
    showError("Falha ao iniciar câmera: " + e);
    }
}

// Inicializar automaticamente
(async () => {
    try {
    if (!('mediaDevices' in navigator)) {
        showError("navigator.mediaDevices não disponível.");
        return;
    }
    await initHands();
    } catch(e) {
    showError("Erro na inicialização: " + e);
    }
})();
let socket;
function startWebSocket() {
    socket = new WebSocket('wss://192.168.2.104:2000');

    socket.onopen = function (e) {
        console.log("[open] Conexión establecida");
    };

    socket.onmessage = function (event) {
        console.log(`[message] Datos recibidos del servidor: ${event.data}`);
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`);
        } else {
            console.error('[close] Conexión fallecida');
            // alert('Websocket Cerrado')
        }
    };

    socket.onerror = function (error) {
        console.error(`[error] ${error.message}`);
    };
}

function stopWebSocket() {
    if (socket) {
        socket.close();
    }
}

function sendMessage() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const input = document.getElementById('messageInput');
        const message = input.value;

        socket.send(message);
        input.value = '';  // Limpiar el input
    } else {
        console.error('No se puede enviar el mensaje: WebSocket no está en estado OPEN.');
    }
}

window.startWebSocket = startWebSocket;
window.stopWebSocket = stopWebSocket;
window.sendMessage = sendMessage;
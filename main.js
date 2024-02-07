let socket;
let client_id;
// Objeto de mapeo para emojis
const emojiMap = {
    ":)": "😊",
    ":(": "😞",
    ";)": "😉",
    ":D": "😃",
    ":'(": "😢",
    ":P" : "🤪"
    // Agrega más mapeos según sea necesario
};
// Función para reemplazar texto por emojis
function reemplazarConEmojis(texto) {
    Object.keys(emojiMap).forEach(clave => {
        const emoji = emojiMap[clave];
        // Usamos 'g' para reemplazar todas las instancias
        texto = texto.replace(new RegExp(escapeRegExp(clave), 'g'), emoji);
    });
    return texto;
}

// Función de ayuda para escapar caracteres especiales en las claves del emojiMap
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& significa la cadena coincidente entera
}
function startWebSocket() {
    socket = new WebSocket('wss://192.168.2.104:2000');

    socket.onopen = function () {
        console.log("[open] Conexión establecida");
    };

    socket.onmessage = event =>{
        const data = JSON.parse(event.data)
        if (data.tipo && data.tipo ==='registro_cliente'){
            client_id=data.cliente_id;
            console.log(`Su id de usuario es ${client_id}`)
            return;
        }
        console.log(`${data.cliente_id}: ${data.mensaje}`)
        const messages = document.getElementById('messages')
        const divchild = document.createElement('div')
        if(data.cliente_id === client_id){
            const mensajeConEmoji = reemplazarConEmojis(data.mensaje);
            divchild.textContent=`Yo: ${mensajeConEmoji}`
            divchild.style.color='green'
        }else{
            const mensajeConEmoji = reemplazarConEmojis(data.mensaje);
            divchild.textContent=`${data.cliente_id}: ${mensajeConEmoji}`
            divchild.style.color='blue'
        }

        messages.appendChild(divchild)
    }

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

function limpiar() {
    document.getElementById('messages').innerHTML='';
}
function sendMessage() {
    const input = document.getElementById('messageInput');
    if(input.value === ''){
       return
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
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
window.limpiar =limpiar;
let socket = new WebSocket('wss://192.168.2.104:2000');

socket.onmessage = event =>{
    const data = JSON.parse(event.data)
    console.log(`${data.cliente_id}: ${data.mensaje}`)
    const messages = document.getElementById('messages')
    const divchild = document.createElement('div')
    divchild.textContent=`${data.cliente_id}: ${data.mensaje}`
    messages.appendChild(divchild)
}
const WebSocket = require("ws");
const wss = new WebSocket.Server({port: 8082});

let state = {
    running: false,
    fontSocketValue:50,
    speedSocketValue:1,
    socketBgColor:'#000000',
    socketFontColor:'#ffffff'
}

wss.on("connection", ws => {
    ws.send(JSON.stringify(getStateMessage()));
    ws.on("message", message => {
        message = JSON.parse(message)
        wss.clients.forEach(function each(client) {
            if (message.type === "request") {
                if (message.action === "play") {
                    state.running = true;
                    // console.log(message.action,state)
                } else if (message.action === "stop") {
                    state.running = false
                    // console.log(message.action,state)
                } else if(message.action === "fontReSize"){
                    state.fontSocketValue = message.fontValue
                    // console.log(message.action,state)

                } else if(message.action === "changeSpeed"){
                    state.speedSocketValue = message.speedValue
                    // console.log(message.action, state)

                }  else if(message.action === "changeBackGroundColor"){
                    state.socketBgColor = message.backgroundColorPicked
                    // console.log(message.action ,state)

                } else if(message.action === "changeFontColor"){
                    state.socketFontColor = message.FontColorPicked
                    // console.log(message.action ,state)

                } else {
                    console.log("Unknown action ", message.action)
                }
                client.send(JSON.stringify(getStateMessage()));
            }
        })
    })
    ws.on("close", () => {
        console.log("Client has disconnected");
    })
})
function getStateMessage() {
    return {
        "type": "response",
        "value": state.running,
        "fontValue":state.fontSocketValue,
        "speedValue":state.speedSocketValue,
        "backGroundColor":state.socketBgColor,
        "newFontColor":state.socketFontColor

    };
}
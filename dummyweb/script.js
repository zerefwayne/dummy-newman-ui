const webSocketURL = "ws://localhost:8080";
const connectionStatus = document.getElementById("connectionStatus");

const connectToWebSocket = () => {
  const ws = new WebSocket(webSocketURL);

  ws.onopen = () => {
    console.log("Connected to socket!");
    ws.send(JSON.stringify({ data: 'ping' }));
  };

  ws.onclose = () => {
    connectionStatus.innerText = "Disconnected!";
  }

  ws.onmessage = function ({data}) {
    console.log("Recieved message", data);

    if (data && data === "pong") {
      connectionStatus.innerText = "Connected!";
    };

    if(data.type && data.type === "update") {
      console.log(data);
    }
  };

};

connectToWebSocket();

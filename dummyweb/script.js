const webSocketURL = "ws://localhost:8080";
const connectionStatus = document.getElementById("connectionStatus");
const updatesList = document.getElementById("updates");

const connectToWebSocket = () => {
  const ws = new WebSocket(webSocketURL);

  ws.onopen = () => {
    console.log("Connected to socket!");
    ws.send(JSON.stringify({ data: 'ping' }));
  };

  ws.onclose = () => {
    connectionStatus.innerText = "Disconnected, please refresh!";
  }

  ws.onmessage = function ({ data }) {
    console.log("Recieved message", data);

    if (data && data === "pong") {
      connectionStatus.innerText = "Connected!";
      return;
    };

    data = JSON.parse(data);

    if (data.type && data.type === "update") {
      let newLI = document.createElement("li");
      newLI.appendChild(document.createTextNode(data.data));
      updatesList.appendChild(newLI);
    }
  };

};

connectToWebSocket();

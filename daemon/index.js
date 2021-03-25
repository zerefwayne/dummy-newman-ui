const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const sockets = {};

const broadcast = (id, payload) => {
  Object.keys(sockets).forEach((socketID) => {
    if (socketID === id) return;
    sockets[socketID].send(payload);
  });
};

wss.on('connection', ws => {
  const id = new Date().toTimeString();
  sockets[id] = ws;
  console.log(`connected: ${id}`);
  ws.on('close', () => {
    console.log(`disconnected: ${id}`);
    delete sockets[id];
  });
  ws.on('message', message => {
    message = JSON.parse(message);
    console.log("Message received: ", message);
    message.data && message.data === "ping" && ws.send("pong");
    if (message.type && message.type === "update") {
      let payload = {
        "type": message.type,
        "data": message.data
      };
      payload = JSON.stringify(payload);
      broadcast(id, payload);
    }
  });
});

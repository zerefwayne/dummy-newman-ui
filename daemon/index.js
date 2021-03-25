const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

/* {uniqueID: websocket connection Object} */
const sockets = {};

/* Broadcast messsage to every socket except the sender */
const broadcast = (id, payload) => {
  Object.keys(sockets).forEach((socketID) => {
    if (socketID === id) return;
    sockets[socketID].send(payload);
  });
};

wss.on('connection', ws => {
  /* generate unique id for each connection */
  const id = new Date().toTimeString();
  /* use it to store the connectionObject */
  sockets[id] = ws;
  console.log(`connected: ${id}`);
  /* remove the connection from active sockets after being closed */
  ws.on('close', () => {
    console.log(`disconnected: ${id}`);
    delete sockets[id];
  });
  ws.on('message', message => {
    message = JSON.parse(message);
    console.log("Message received: ", message);
    /* check for ping message */
    message.data && message.data === "ping" && ws.send("pong");
    if (message.type && message.type === "update") {
      /* update message will be received from the newman run process */
      let payload = {
        "type": message.type,
        "data": message.data
      };
      payload = JSON.stringify(payload);
      /* the message will be relayed to all the dashboard instances listening */
      broadcast(id, payload);
    }
  });
});

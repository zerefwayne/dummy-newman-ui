const WebSocket = require('ws');
const forever = require('forever-monitor');
const webSocketURL = "ws://localhost:8080";

/* returns a websocket connection */
const connectToWebSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      const wss = new WebSocket(webSocketURL);
      wss.onopen = () => {
        resolve(wss);
      };
      wss.on('error', (e) => {
        reject(e);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/* spawns the nodejs daemon in background */
const spawnDaemon = async () => {
  return new Promise((resolve) => {
    const child = new (forever.Monitor)('../daemon/index.js', {
      max: 1,
      silent: true,
      args: []
    });
    child.on('exit', function () {
      console.log('daemon has exited.');
    });
    child.start();
    // gives time for WebSocket Server on daemon to start successfully
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};

/* imitates newman.run command and UIReporter */
const run = async () => {
  try {
    console.log(`(re)Connecting to ${webSocketURL}`);
    /* tries to get WebSocket connection if running */
    let wss = await connectToWebSocket();
    console.log("Daemon running, connected to:", webSocketURL);

    /* sends an update to the websocket every second */
    setInterval(() => {
      let payload = {
        type: "update",
        data: new Date().toString()
      };
      wss.send(JSON.stringify(payload));
    }, 1000);
  
  } catch (err) {
    /* if connectToWebSocket() returns an error, it tries to spawn the daemon */
    console.log("Daemon not running, retrying to spawn daemon.");
    /* spawns daemon in background and resolves after 2 seconds */
    await spawnDaemon();
    /* calls the run function again */
    run();
  }
};

run();

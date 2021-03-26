# Sample Demo App


### [Video Demo](https://user-images.githubusercontent.com/28949397/112529472-4fb3e800-8dcb-11eb-8292-c88b4bfd0fe5.mp4)

## Components

### Daemon Script

The daemon script is a NodeJS script which listens for messages from the DummyNewman process updates and broadcasts them to dashboard listening to them.

### DummyNewman

DummyNewman is a dummy implementation of newman that connects to daemon and sends process updates to it for being displayed on the dashboard.

### Dashboard

Dashboard is a simple HTML, JS App that connects to Daemon if running and listens for updates that it might have.

## How to start?

1.  Run `npm install` to install dependencies.
2.  Run `npm install -g http-server-spa`.
3.  Run `http-server-spa dummyweb index.html 8081` and head over to http://localhost:8081 to see the webpage.
4.  Run `cd dummynewman && node index.js` to start the dummy newman job.
5.  It will automatically spawn the daemon and connect to it.

## Spawning the daemon

DummyNewman output when daemon is running:

```
➜  dummynewman node index.js
(re)Connecting to ws://localhost:8080
Daemon running, connected to: ws://localhost:8080
```

If DummyNewman detects that the server is not running: It will automatically spawn the daemon script, wait for 2 seconds and retry connecting to the daemon on `ws://localhost:8080`

DummyNewman output when daemon is not running:

```
➜  dummynewman node index.js
(re)Connecting to ws://localhost:8080
Daemon not running, retrying to spawn daemon.
(re)Connecting to ws://localhost:8080
Daemon running, connected to: ws://localhost:8080
```


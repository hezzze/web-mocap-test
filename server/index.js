const { WebSocketServer } = require('ws');
const dgram = require('node:dgram')
const port = 3000
const server = new WebSocketServer({ port })
console.log(`listening on port: ${port}`)

const controller = new AbortController();
const { signal } = controller;
const dgramSocket = dgram.createSocket({
    type: 'udp4',
    signal
})

server.on("connection", (socket) => {
  // send a message to the client
  socket.send(JSON.stringify({
    type: 'init',
    msg: 'connection established!'
  }));

  var counter = 0
  var packetN = 0

  // receive a message from the client
  socket.on("message", (data) => {
    // console.log("incoming raw json data: ", data)

    // const packet = JSON.parse(data)
    packetN++
    if (packetN % 100 === 0)  {
        console.log(`${packetN} packages sent`)
    }
    
    dgramSocket.send(data, 54321, 'localhost', (err) => {
        counter++
        if (counter % 60 === 0) {
            console.log("60 packets lost...")
            counter = 0
        }
    })
  });
});
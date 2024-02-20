const express = require('express');

const path = require('path');

const db = require('./config/connection');
const Pusher = require('pusher-js')
// Comment out this code once you have built out queries and mutations in the client folder
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const PORT2 =process.env.PORT2 || 8080;
const app = express();
const server = require('http').Server(app);
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Comment out this code once you have built out queries and mutations in the client folder
  app.use(routes);

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

  } // closes if (process.env.NODE_ENV === 'production') condition


// Comment out this code once you have built out queries and mutations in the client folder
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));
// });

const WebSocket = require('ws');
const { constants } = require('buffer');

const wss = new WebSocket.Server({ server }); // Replace 8080 with the desired port number

// Store the connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  // Add the new client to the set
  clients.add(ws);
  ws.on('message', (message) => {
    // const receivedData = JSON.parse(message.data);
    const messageString = message.toString('utf8');
    const parse = JSON.parse(messageString);
    // console.log(parse)
    console.log('Received message:', messageString);
    // console.log(parse[1]);
    if(parse[1]==='started'){
      // console.log("test")
    // Process the received message and send a response if needed
    clients.forEach((client) => {
      client.send(messageString);
    });
    // ws.send(messageString);
    } else if(parse[1]==='next user'){
      clients.forEach((client) => {
        client.send(messageString);
      });
    } else if(parse[1]==='players'){
      clients.forEach((client) => {
          client.send(messageString);
      });
    } else if(parse[1]==='winner'){
      clients.forEach((client) => {
        client.send(messageString);
      });
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});

// const io = require('socket.io')(server);
// // listens for when a user connects to server
// io.on('connection', (socket) => {
//   console.log('A user connected Server');
//   //listents for join to be emitted from client
//   socket.on('join', (username) => {
//     //emits user joined to all connected clients
//     io.emit('user joined', `${username} has joined`);
//   });

//   socket.on('passNum',(data)=>{
//     io.emit('getNum',(data));
//   })

//     // Handle button press event
//   socket.on('relocateUsers', () => {
//       // Emit a usersRelocated event to all connected clients
//       io.emit('usersRelocated');
//     });
// });

// const pusher = new Pusher({
//   appId: "1758469",
//   key: "536cdade0e1860d0eda7",
//   secret: "8d414a1e4cd2ffed9e4c",
//   cluster: "us3",
// });

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });

// app.post('/send-message', (req, res) => {
//   const { message } = req.body;

//   pusher.trigger('chat-channel', 'new-message', {
//       message,
//   });

//   res.status(200).send('Message sent');
// });

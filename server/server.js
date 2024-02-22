const express = require('express');

const path = require('path');

const connectDB = require('./config/connection');

const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const PORT2 =process.env.PORT2 || 8080;
connectDB();
const app = express();
// const server = require('http').Server(app);
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  // Comment out this code once you have built out queries and mutations in the client folder
  app.use(routes);

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

  } // closes if (process.env.NODE_ENV === 'production') condition

// Comment out this code once you have built out queries and mutations in the client folder
const server = app.listen(PORT, () => console.log(`Now listening on localhost: ${PORT}`));


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



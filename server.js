var app = require('express')();
var WebSocketServer = require("ws").Server

var SocketServer = function () {
	 
	function startServer() {
		app.set('port', process.env.PORT || 8042);
		const server = app.listen(app.get('port'), function() {
		  console.log('Express server listening on port ' + server.address().port);
		});
		createWSServer(server); 
	} 
	
  function createWSServer(server) {
		const wss = new WebSocketServer({ server: server });

		wss.on('connection', function connection(ws) { 	
			
			 ws.on('message', function incoming(message) {
				console.log('received: %s', message);
				const jsonmessage = JSON.parse(message);
				if(jsonmessage.t != "ping") {
					broadcastMsg(wss, ws, message);
				}
			  });
		});
  } 
	
	function broadcastMsg(wss, ws, data) {
		// Broadcast to everyone else.		 
		wss.clients.forEach(function each(client) {
		console.log('client');
		  if (client !== ws && client.readyState === 1) {
			 console.log('client ready:' + client.readyState) ;
			  
			client.send(data);
		  }
		});	
	}

  return {
    startServer: startServer
	}
	
} 

module.exports = SocketServer();
var express		=	require('express');
var app			=	express();
var http		=	require('http').Server(app);
var io			=	require('socket.io')(http);
var totalUsers	=	0;
var	logonCreds	=	{username:"admin",password:"admin"};
var	clientName,sender;
var userConnection	={name:'',count:'',isconnected:false};
var allClients	=	[];

app.use(express.static('public'));

/* Logon Validation and Routing*/
app.get('/logonValidation', function(req, res){
	if((req.query.user_name== logonCreds.username && req.query.password== logonCreds.password)|| true){
		res.sendFile(__dirname + '/public/homepage.html');		
	}
	else
		res.sendFile(__dirname + '/public/errorpage.html');
});
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/loginpage.html');
});

/* Socket Connection and other Socket Events*/
io.on('connection', function(socket){
	totalUsers+=1;
	console.log('A user connected, total no. of users='+totalUsers);
	clientName						=	socket.handshake.query.name;							//To get request parameters from query.
	userConnection					=	{name:'',count:'',isconnected:false};
	userConnection.name				=	clientName;
	userConnection.count			=	totalUsers;
	userConnection.isconnected		=	true;
	io.sockets.emit('user count',userConnection);												// An event is transmitted whenever a new user connects.
	socket.on('chat message', function(recievedJson){											//Chat Message Json Recieved {sender,msg}.
		var sender	=	'<span>'+recievedJson.sender+' : </span> ';
		io.sockets.emit('return message',sender+recievedJson.msg);
	});
	socket.on('disconnect', function(){
		debugger;
		totalUsers-=1;
		console.log('A user disconnected');
		userConnection				=	{name:'',count:'',isconnected:false};
		userConnection.name			=	clientName;
		userConnection.count		=	totalUsers;
		userConnection.isconnected	=	false;
		io.sockets.emit('user count',userConnection);											// An event is transmitted whenever a  user disconnects.
	});
});
io.sockets.on('connection', function(socket) {
   allClients.push(socket);

   socket.on('disconnect', function() {
      console.log('Got disconnect!');

      var i = allClients.indexOf(socket);
      delete allClients[i];
   });
});

http.listen(3000, function(){
	console.log('listening on *:3000');
	console.log('Server Restart 1');
	console.log('Server Restart 2');
});
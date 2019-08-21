const express = require('express'),
	app = express();

app.use(express.static(__dirname+'/static'));
app.use(express.static(__dirname+'/views'));
/*
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/views/index.html'));
});
*/
let webserver = app.listen(3000, function () {
  console.log("LiveRgex server started, listening on port 3000");
});

console.log("------------------------My Watch Begins!-----------------------");

var http = require("http");
http.createServer(function(request, response){
response.writeHead(200, {'Content-Type': 'text/plain'});
response.end("welcome to the bot server");
}).listen(5678);


var express =require("express");

var app = express();
var server = app.listen(8001);
var path= require("path");
var bodyParser = require('body-parser');
var request = require("request");
// static resources
app.use('/css', express.static("css"));
app.use('/js', express.static("js"));
app.use('/images', express.static("images"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.send('Hello World from express');
});

app.get('/index', function (req, res) {
   res.sendFile(path.join(__dirname,"/html/fullview.html"));
});


app.post('/message', function (req, res) {
  console.log("message received from webhook "+req.body.message );
   const message = req.body;
   const query=req.query;
   if(message.to=="stupid_snow@applozic.com"){
   var apiUrl = "https://api.api.ai/api/query?query="+req.body.message+"&lang=en&sessionId=09874634636463&v=20150910";
  var senMessageUrl= " https://apps.applozic.com/rest/ws/message/v2/send";
   var options = {
  		url: apiUrl,
  		headers: {
    	'Authorization': 'Bearer 77ce1347c98d4cffb7aebc9e20bd2478'
  		}
	};
	
	request(options,function(err,response,body){
var data = JSON.parse(body);
		var result=data.result;
		console.log("response received from API.AI "+result.fulfillment.speech);
		
		//console.log("\n result  \n"+JSON.stringify(result));
		console.log("response received from API.AI "+result.fulfillment.speech);
		var sendMessageOptions={
		url:senMessageUrl,
		method:'POST',
		json:{
			"to":message.from,
  			"message":result.fulfillment.speech
		},
		headers: {
    	"Access-Token":"suraj",
		"Application-Key":"156568f01fff47efbfe9f7a6715f072c9",
		"Authorization":"Basic c3R1cGlkX3Nub3dAYXBwbG96aWMuY29tOmZmNWQ5MzVkLWE0ZjItNGM3ZC05OTY1LWRlNzllMzIxMThiYw=="
  		}

	};
		request(sendMessageOptions,function(error,resp,respBody){

			if(resp.status==200){
				console.log(" message sent to "+message.from);
			}	
			res.send({"status":resp.status}).end();

		});
	
   }); 
}



});

app.get('/isFirstConversation', function (req, res) {
  

   var userId= req.query.userId;
   console.log("userId received : "+userId);

   var userDetailParams = {
		url:"https://apps.applozic.com/rest/ws/message/v2/list?userId="+userId+"&pageSize=1",
		method:'GET',
		headers: {
    	"Access-Token":"suraj",
		"Application-Key":"156568f01fff47efbfe9f7a6715f072c9",
		"Authorization":"Basic c3R1cGlkX3Nub3dAYXBwbG96aWMuY29tOmZmNWQ5MzVkLWE0ZjItNGM3ZC05OTY1LWRlNzllMzIxMThiYw=="
  		}

   };

	request(userDetailParams,function(error,resp,respBody){	
				console.log(error );
				if(resp.statusCode==200){

				var data = JSON.parse(respBody);
				
					console.log("response body",respBody);
				console.log("data" ,data.response);
				var messageLength = data.response.message.length;
				
				
					if(messageLength==0) {
						res.send(true).end();
						console.log("new user =: true");

					}else{
						res.send(false).end();
						console.log("new user =: flase");
					}
  	 }else{
   	console.log("error occured while fetching messages :");
   	console.log(error);

	}

 });

});


app.get('/welcomeMessage', function (req, res) {

				var userId=req.query.userId;

				var sendMessageOptions={
				url:"https://apps.applozic.com/rest/ws/message/v2/send",
				method:'POST',
				json:{
					"to":userId,
  					"message":" Hey There! I am Stupid Snow, Well I am not stupid my master call me that. I am here to help you...."
					},
				headers: {
    				"Access-Token":"suraj",
					"Application-Key":"156568f01fff47efbfe9f7a6715f072c9",
					"Authorization":"Basic c3R1cGlkX3Nub3dAYXBwbG96aWMuY29tOmZmNWQ5MzVkLWE0ZjItNGM3ZC05OTY1LWRlNzllMzIxMThiYw=="
  					}

			};
		request(sendMessageOptions,function(error,resp,respBody){

			if(resp.statusCode==200){
				console.log(" message sent to "+userId);
			}else{

				console.log("not able to send the message.  server has  returned status code: "+resp.statusCode);
			}	
			res.end();

		});
		
});






console.log("------------------------My Watch Begins!-----------------------");



var sampleRepos={

	"chat":{
			"generic":"here you go! www.applozic.com",
			"web":"here you go for web! www.applozic.com",
			"android": "here you go for android: www.applozic.com",
			"ios":"here is the ios link! www.applozic.com"
			},
	"dbms":{
		"generic":"here you go! www.mysql.com",
		"web":"here you go for web! www.mysql.com",
			"android": "here you go for android: www.mysql.com",
			"ios":"here is the ios link! www.mysql.com"
	},
	"cache":{
		"generic":"here you go! www.hazelCast.com",
			"web":"here you go for web! www.hazelCast.com",
			"android": "here you go for android: www.hazelcast.com",
			"ios":"here is the ios link! www.hazelcast.com"
	},
	"queue":{
		"generic":"here you go! www.rabitAMQ.com",
		"web":"here you go for web! www.rabitAMQ.com",
			"android": "here you go for android: www.RabbitAMQ.com",
			"ios":"here is the ios link! www.RabbitAMQ.com"
	}

}

var express =require("express");

var app = express();
var server = app.listen(8001);
var path= require("path");
var bodyParser = require('body-parser');
var request = require("request");
//var mongoDbHelper = require("./modules/mongoDbHelper.js");
// static resources
app.use('/css', express.static("css"));
app.use('/js', express.static("js"));
app.use('/images', express.static("images"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

eUrl= app.get('/', function (req, res) {
   res.send('Hello World from express');
});

app.get('/index', function (req, res) {
   res.sendFile(path.join(__dirname,"/html/fullview.html"));
});


app.post('/message', function (req, res) {
  console.log("message received from webhook "+req.body.message );
   const message = req.body;
   const query=req.query;
   var replyMessage;
   if(message.to=="stupid_snow@applozic.com"){
   var apiUrl = "https://api.api.ai/api/query?query="+req.body.message+"&lang=en&sessionId=09874634636463&v=20150910";
  var sendMessageUrl=" https://apps.applozic.com/rest/ws/message/v2/send";
   var options = {
  		url: apiUrl,
  		headers: {
    	'Authorization': 'Bearer eab42d260cc34b128c9821087672a764'
  		}
	};
	
	request(options,function(err,response,body){
	var data = JSON.parse(body);
		var result=data.result;

		//console.log(result);
		var param = result.parameters;
		
		if(!(Object.keys(param).length===0 &&param.constructor===Object)){
			console.log(param);
				if(param.tags && param.tags.length!=0){
					var platform= param.plateform==''?"generic":param.plateform;
					console.log("plateform "+platform);
					replyMessage= sampleRepos[param.tags][platform];

					//replyMessage= "got you! parameter extracted: platform : "+ param.plateform+"  tags : "+param.tags+" \n calling node server to fullfill your request "

				}


		}if(!replyMessage){
			replyMessage= result.fulfillment.speech;
		}

		console.log("message reply: "+replyMessage);
		//res.send({"reply message":replyMessage}).end();


		//console.log("response received from API.AI "+result.fulfillment.speech);
		
		//console.log("\n result  \n"+JSON.stringify(result));
		//console.log("response received from API.AI "+result.fulfillment.speech);
		var sendMessageOptions={
		url:sendMessageUrl,
		method:'POST',
		json:{
			"to":message.from,
  			"message":replyMessage
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


app.get('/save', function (req, res) {

var doc= {"userNAme":"don","age":"20"};

mongoDbHelper.insert("user",doc);
res.end();

});

app.get('/getdb', function (req, res) {

var doc= {"userNAme":"don"};

var result = mongoDbHelper.find("user",doc);
res.send(result).end();

});


app.post('/populate', function (req, res) {

var doc= {"userNAme":"don"};

var result = mongoDbHelper.find("user",doc);
res.send(result).end();

});






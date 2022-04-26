//import
var express = require('express');
var bodyParser= require('body-parser');
var apiRouter= require('./apiRouter').router;
var url =require('url');
// instantiate server
var server =express();

//body Parser configuration
  server.use(bodyParser.urlencoded({extended:true}));
  server.use(bodyParser.json());

//configurate route
server.get('/',function(req,res){
  
   res.setHeader('Cotent-Type','text/html');
   res.status(200).send('<h1>Bonjour  sur mo server</h1>');
  
});
server.get('/home ',function(req,res){
      
  res.status(200).send('<h1>safaaaaa</h1>');
 
});
server.use('/api/',apiRouter);

//launch server
server.listen(8000,function(){
    console.log('server en ecoute :)');
});  
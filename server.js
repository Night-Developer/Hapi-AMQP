var Hapi = require('hapi');
var server = new Hapi.Server(3333);
var process = require('child_process');

var amqp = require('amqp');

var connection = amqp.createConnection({
    host:'hermes.blageek.net',
    login:'guest',
    password:'guest'
});

connection.on('ready',function(){
    console.log('Conexion lista.'); 
});

connection.on('error',function(){
    console.log('Error conexion',arguments); 
});

console.log('start worker');
// se realiza el fork del nuevo proceso
var child = process.fork('worker.js');

var manejardorDeCola = function(connection,cola,mensaje){
    console.log("Antes del publish");
    connection.publish(cola,mensaje);
    console.log("Mensaje enviado a la cola");
}

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
          reply('Hola Mundo');
    }
});

server.route({
  method: 'POST',
  path: '/message/',
  handler: function (request, reply) {
    
    var data = request.payload;
    var cola = data.cola;
    var mensaje = data.mensaje;
  
    manejardorDeCola(connection,cola,mensaje);
  
    reply('Data recibida ' + JSON.stringify(data) );
  }
});

server.route({
    method: 'GET',
    path: '/{cola}/{mensaje}',
    handler: function (request, reply) {
      
        var cola = request.params.cola;
        var mensaje = request.params.mensaje;
      
        manejardorDeCola(connection,cola,mensaje);
      
        reply('Cola: ' + request.params.cola + ', mensaje:'+request.params.mensaje);
    }
});

server.start(function () {
    console.log('Servidor arriba y corriendo:', server.info.uri);
});

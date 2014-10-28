var amqp = require('amqp');

var connection = amqp.createConnection({
    host:'hermes.blageek.net',
    login:'guest',
    password:'guest'
});

connection.on('ready',function(){
    console.log('Conexion lista worker'); 
});

connection.on('error',function(){
    console.log('Error conexion',arguments); 
});


(function(connection){
    setTimeout(function() {
  
        //nombre de la cola que estaremso consumiendo      
        var cola = "cola";
  
        connection.queue(cola, function (cola) {
              
            // comodin para capturar todos los mensajes
            cola.bind('#');
        
            cola.subscribe(function (message) {
                var buf = new Buffer(message.data);
                
                console.log("Mensaje optenido ",buf.toString());
            });
        });
    }, 5000);
})(connection);

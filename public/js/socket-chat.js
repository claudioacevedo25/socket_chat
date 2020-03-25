var socket = io();

var parametros = new URLSearchParams(window.location.search);

if(!parametros.has('nombre') || !parametros.has('sala')){
    window.location = 'index.html';
    throw new Error ('El nombre y la sala son necesario')
}

let usuario = {
    nombre: parametros.get('nombre'),
    sala: parametros.get('sala')
}



socket.on('connect', function() {
    console.log('Conectado al servidor');

    //primer param:nombre del listener en comun (servidor-cliente)
    //segundo param: la data que le envio al servidor
    //tercer param: un callback en caso de exito en el envio de la info, este a su vez recibe como parametro la respuesta del serv
    socket.emit('entrarChat', usuario, function (resp) {

        console.log('Usuarios Conectados', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información desde el servidor con l listener 'crearMensaje'
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//ESCUCHAR CUANDO UN USUARIO ENTRA O SALE DEL CHAT 
socket.on('listaPersona', function(personas) {

    console.log('Servidor:', personas);

});


//MENSAJES PRIVADOS
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje privado: ', mensaje);
})
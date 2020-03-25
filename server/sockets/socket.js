const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios');
const {crearMensaje} = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

   client.on('entrarChat', (data, callback) => {

    if( !data.nombre || !data.sala){
        return callback({
            err: true,
            messaje: 'El nombre/sala es necesario'
        })
    }

    // para unirme a una sala
    client.join(data.sala);

   usuarios.agregarPersona(client.id, data.nombre, data.sala);

   //se dispara cuando una persona ingresa al chat
   client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
   callback(usuarios.getPersonasPorSala(data.sala));
   });


   client.on('crearMensaje', (data) => {

    let persona = usuarios.getPersona(client.id);
    let mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
   })



   client.on('disconnect', () => {
     
    let personaBorrada = usuarios.borrarPersona(client.id)

    //notifica a todos los usuarios cunado algoso se desconecta
    client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`) )
 
   //se dispara cuandto(persona.sala).o una persona sale del chat
    client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
   })


   //mensajes privados 
   client.on('mensajePrivado', data => {

    let persona = usuarios.getPersona(client.id);
    client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    
   })


  });

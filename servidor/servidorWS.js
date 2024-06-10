function ServidorWS(io) {
    this.lanzarServidor = function(io, sistema) {

        io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado');

            socket.on("crearPartida", (datos) => {
                let codigo = sistema.crearPartida(datos.email);
                if (codigo != -1) {
                    socket.join(codigo);
                }
                this.enviarAlRemitente(socket, "partidaCreada", { "codigo": codigo });
                let lista = sistema.partidasDisponibles();
                this.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
            });

            socket.on('unirAPartida', (datos) => {
                let res = sistema.unirAPartida(datos.email, datos.codigo);
                if (res.codigo) {
                    socket.join(res.codigo);
                    this.enviarAlRemitente(socket, "unidoAPartida", { "email": datos.email });
                    let lista = sistema.partidasDisponibles();
                    this.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
                } else {
                    socket.emit('error', { message: 'No se pudo unir a la partida' });
                }
            });

            socket.on('partidasDisponibles', (datos) => {
                let lista = sistema.partidasDisponibles();
                this.enviarAlRemitente(socket, "listaPartidas", lista);

            });

            // Escuchar el movimiento del cliente
            socket.on('move', (data) => {
                console.log('Move received:', data);
                
            });
            
          

            socket.on('disconnect', () => {
                console.log('Cliente desconectado');
            });
        });
    };

    this.enviarAlRemitente = function(socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    };

    this.enviarATodosMenosRemitente = function(socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    };

    this.enviarGlobal = function(io, mens, datos) {
        io.emit(mens, datos);
    };
}

module.exports.ServidorWS = ServidorWS;

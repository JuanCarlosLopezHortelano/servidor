function ServidorWS(io) {
    this.lanzarServidor = function(io, sistema) {
        this.enviarAlRemitente = function(socket, mensaje, datos) {
            socket.emit(mensaje, datos);
        };

        this.enviarATodosMenosRemitente = function(socket, mens, datos) {
            socket.broadcast.emit(mens, datos);
        };

        this.enviarGlobal = function(io, mens, datos) {
            io.emit(mens, datos);
        };

        io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado:', socket.id);

            socket.on("crearPartida", (datos) => {
                let codigo = sistema.crearPartida(datos.email);
                if (codigo != -1) {
                    socket.join(codigo.toString());
                    console.log(`Cliente ${socket.id} unido a la sala ${codigo} (crearPartida)`);
                }
                this.enviarAlRemitente(socket, "partidaCreada", { "codigo": codigo });
                let lista = sistema.partidasDisponibles();
                this.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
            });

            socket.on('unirAPartida', (datos) => {
                let res = sistema.unirAPartida(datos.email, datos.codigo);
                if (res.codigo) {
                    socket.join(res.codigo.toString());
                    console.log(`Cliente ${socket.id} unido a la sala ${res.codigo} (unirAPartida)`);
                    this.enviarAlRemitente(socket, "unidoAPartida", { "email": datos.email });
                    let lista = sistema.partidasDisponibles();
                    this.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
                } else {
                    socket.emit('error', { message: 'No se pudo unir a la partida' });
                }
            });

            socket.on('partidasDisponibles', () => {
                let lista = sistema.partidasDisponibles();
                this.enviarAlRemitente(socket, "listaPartidas", lista);
            });

            socket.on('move', (data) => {
                console.log('Movimiento recibido:', data);
                data.codigo = parseInt(data.codigo, 10); // Asegurar que es un entero
                this.listarUsuariosEnSala(data.codigo.toString()); // Convertir a string para la sala
                io.sockets.in(data.codigo.toString()).emit('move', data);  // Enviar el movimiento a todos en la sala
            });

            socket.on('disconnect', () => {
                console.log('Cliente desconectado:', socket.id);
            });
        });

        this.listarUsuariosEnSala = function(codigo) {
            const room = io.sockets.adapter.rooms.get(codigo);
            if (room) {
                console.log(`Usuarios en la sala ${codigo}:`);
                for (const socketId of room) {
                    const userSocket = io.sockets.sockets.get(socketId);
                    if (userSocket) {
                        console.log(userSocket.id);
                    }
                }
            } else {
                console.log(`No hay usuarios en la sala ${codigo}`);
            }
        };
    };
}
module.exports.ServidorWS = ServidorWS;

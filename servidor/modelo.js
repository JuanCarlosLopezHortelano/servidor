const cad = require("./cad.js");
const bcrypt = require('bcrypt');
const correo=require("./email.js");



function Sistema() {
    // Objeto que almacena a los usuarios
    this.usuarios = {};

    //Objeto que almacena partidas
    this.partidas = {};

    // Conexión a la base de datos
    this.cad = new cad.CAD();

    // Verifica si un usuario está activo
    this.usuarioActivo = function (nick) {
        if (nick in this.usuarios) {
            return { "activo": true };
        } else {
            return { "activo": false };
        }
    }

    // Conectar a la base de datos
    this.cad.conectar(function (db) {
        console.log("Conectado a Mongo Atlas");
    });

    // Agrega un usuario al sistema
    this.agregarUsuario = function (usr) {
      const email = usr.email;
      if (!this.usuarios[email]) {
          this.usuarios[email] = new Usuario(usr.email, usr.nick, usr.nombre);
          console.log("Nuevo usuario en el sistema: " + email);
          return { "email": email };
      } else {
          console.log("El email " + email + " está en uso");
          return { "email": -1 };
      }
  }

    // Obtiene la lista de usuarios
    this.obtenerUsuarios = function () {
        return this.usuarios;
    }

    

   // Elimina un usuario del sistema
   this.eliminarUsuario = function (email) {
    if (this.usuarios.hasOwnProperty(email)) {
        delete this.usuarios[email];
        console.log("Usuario eliminado: " + email);
        return { "email": email };
    } else {
        console.log("No existe el usuario: " + email);
        return { "email": -1 };
    }
}

    // Obtiene el número de usuarios en el sistema
    this.numeroUsuarios = function () {
        return { "num": Object.keys(this.usuarios).length };
    }

    // Autenticación de usuario utilizando Google
    this.usuarioGoogle = function (usr, callback) {
      this.registrarLog("autenticarUsuarioGoogle", usr.email); // Registrar la actividad

        this.cad.buscarOCrearUsuario(usr, function (obj) {

            callback(obj);
        });
    }

    this.registrarUsuario = function (obj, callback) {
        let modelo = this;
        if (!obj.nick) {
          obj.nick = obj.email;
        }
      
        // Genera un hash de la clave antes de almacenarla
        bcrypt.hash(obj.password, 10, function (err, hash) {
          if (err) {
            console.error(err);
            return callback({ "error": "No se pudo cifrar la clave" });
          }
      
          // Sustituye la clave original con el hash
          obj.password = hash;
      
          modelo.cad.buscarUsuario({"email":obj.email}, function (usr) {
            if (!usr) {

              // El usuario no existe, luego lo puedo registrar
              obj.key = Date.now().toString();
              obj.confirmada = false;
              modelo.cad.insertarUsuario(obj, function (res) {
                
                callback(res);
              });
              correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
              
            }
            else {
              
              console.log("El email ya esta ocupado")
              callback({"email": -1});
            }
          });
        });
      }

    this.confirmarUsuario=function(obj,callback){
      
      let modelo=this;
      this.cad.buscarUsuario({"email":obj.email,"confirmada":false,"key":obj.key},function(usr){
        if (usr){
            usr.confirmada=true;
            modelo.cad.actualizarUsuario(usr,function(res){
              callback({"email":res.email}); //callback(res)
            })
        }else
            {
            callback({"email":-1});
        }
      })
    }


           // Método para verificar la clave durante el inicio de sesión
this.loginUsuario = function (obj, callback) {

            this.cad.buscarUsuario({ "email":obj.email, "confirmada":true }, function (usr) {
              if (usr) {
                // Compara la clave cifrada almacenada en la base de datos con la clave proporcionada

                
                bcrypt.compare(obj.password, usr.password, function (err, result) {
                  if (err) {
                    console.error(err);
                    return callback({ "error": "Error al comparar las claves" });
                  }
          
                  if (result) {
                    console.log("Las contraseñas coinciden.");
                    callback(usr);

                  } else {
                    console.log("Las contraseñas no coinciden.");
                    callback({ "email": -1 });
                  }
                });
              } else {
                callback({ "email": -1 });
              }
            });
          }



          //Crear Partidas

          
      this.crearPartida = function(email) {
            const codigo = this.obtenerCodigo()
            console.log("code:", { codigo });
            this.partidas[codigo] = new Partida(codigo);
            this.partidas[codigo].jugadores.push(email); // Agregar el usuario que crea la partida
            this.registrarLog("crearPartida", email); // Registrar la actividad

            return codigo;
        }

        this.unirAPartida = function(email, codigo) {
          let partida = this.partidas[codigo];
          if (partida && partida.jugadores.length < 2) {
              partida.jugadores.push(email);
              console.log("Se pudo unir a la partida",email);
              this.registrarLog("unirAPartida", email); // Registrar la actividad

              return {"codigo": codigo};

            } else {
                console.log("No se pudo unir a la partida");
                return false;
            }
          }

          this.obtenerCodigo = function() {
            return Math.floor(Math.random() * 10000) + 1;
        }

        this.partidasDisponibles = function() {
          let lista = [];
          
          // Iterar sobre las propiedades del objeto this.partidas
          for (let key in this.partidas) {
              if (this.partidas.hasOwnProperty(key)) {
                  let p = this.partidas[key];
                  if (p.jugadores.length < 2) {
                      lista.push(p);
                  }
              }
          }
      
          return lista.length > 0 ? lista : false;
      };



      this.registrarLog = function(tipoOperacion, email){
        console.log(email)
        console.log("AQUIIII")
          let log = {
          "tipoOperacion": tipoOperacion,
          "email": email,
          "fecha-hora":new Date().toISOString()
        };
        this.cad.insertarLog(log,(res)=>{
          console.log("Log registrado",res);
        })


      }

  }


            

              
      

  function Usuario(usuario) {
    this.email = usuario.email;
    this.nick = usuario.nick;
    this.nombre = usuario.nombre;
}
function Partida(codigo){
  this.codigo = codigo;
  this.jugadores = [];
  this.maxJug = 2;
  
  }





// Exporta la clase Sistema
module.exports.Sistema = Sistema;

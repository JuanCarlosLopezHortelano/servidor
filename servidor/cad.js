const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

function CAD() {

    this.usuarios;
    
    this.logs;


    // Método para conectar a la base de datos
    this.conectar = async function (callback) {
        let cad = this;
        let client = new mongo("mongodb+srv://juancarloslhhellin:78pDSRTsC68GCFvW@proyectossoft.gzwcn2s.mongodb.net/?retryWrites=true&w=majority");
        await client.connect();
        const database = client.db("sistema");
        cad.usuarios = database.collection("usuarios");
        cad.logs = database.collection("logs")
        callback(database);
    }

    // Método para buscar o crear un usuario
    this.buscarOCrearUsuario = function (usr, callback) {
        buscarOCrear(this.usuarios, usr, callback);
    }

    // Función interna para buscar o crear un usuario en la colección
    this.buscarOCrearUsuario=function(usr,callback){
        buscarOCrear(this.usuarios,usr,callback);
        }

        function buscarOCrear(coleccion,criterio,callback)
        {
            coleccion.findOneAndUpdate(criterio, {$set: criterio}, {upsert:
            true,returnDocument:"after",projection:{email:1}}, function(err,doc) {
            if (err) { throw err; }
            else {
            console.log("Elemento actualizado");
            console.log(doc.value.email);
            callback({email:doc.value.email});
        }
        });
        }
    

    

    // Método para buscar un usuario
    this.buscarUsuario = function (obj, callback) {
        buscar(this.usuarios, obj, callback);
    }

    // Función interna para buscar un usuario en la colección
    function buscar(coleccion, criterio, callback) {
        coleccion.find(criterio).toArray(function (error, usuarios) {
            if (usuarios.length === 0) {
                callback(undefined);
            } else {
                callback(usuarios[0]);
            }
        });
    }

    // Método para insertar un nuevo usuario
    this.insertarUsuario = function (usuario, callback) {
        insertar(this.usuarios, usuario, callback);
    }

    

    // Función interna para insertar un elemento en la colección
    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            } else {
                console.log("Nuevo elemento creado");

                callback(elemento);
            }
        });
    }

    this.actualizarUsuario=function(obj,callback){
        actualizar(this.usuarios,obj,callback);
        }

        function actualizar(coleccion,obj,callback){
            coleccion.findOneAndUpdate({_id:ObjectId(obj._id)}, {$set: obj},
            {upsert: false,returnDocument:"after",projection:{email:1}},
            function(err,doc) {
            if (err) { throw err; }
            else {
                console.log("Elemento actualizado");
                //console.log(doc);
                //console.log(doc);
                callback({email:doc.value.email});
                }
                });
                }  
                
                
    this.insertarLog = function(log,callback){
        insertar(this.logs,log,callback)
    }

}
// Exportamos el objeto CAD para su uso en otras partes de la aplicación
module.exports.CAD = CAD;

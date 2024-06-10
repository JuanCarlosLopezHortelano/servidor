const fs = require("fs");
const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const moduloWS = require("./servidor/servidorWS.js");
const cors=require("cors");
const jwt = require("jsonwebtoken");

// Configuración de middleware para parsear solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../claves.env') });




// Importa el módulo 'cookie-session' para gestionar las sesiones de cookies.
const cookieSession = require("cookie-session");


const modelo = require("./servidor/modelo.js");
const PORT = process.env.PORT || 3001;

// Sirve archivos estáticos desde el directorio raíz
app.use(express.static(__dirname + "/"));

app.use(cookieSession({
  name: 'Sistema',
  keys: ['key1', 'key2']
}));



let ws = new moduloWS.ServidorWS();
let io = new Server(httpServer,{cors:{ origins: '*:*'}});





const sistema = new modelo.Sistema();




app.use(cors({
    origin:"http://localhost:3000"
   }));
   

app.get("/agregarUsuario/:nick", function(request, response) {
    let nick = request.params.nick;
    let res = sistema.agregarUsuario(nick);
    response.send(res);
});

app.get("/obtenerUsuarios", function(request, response) {
    let res = sistema.obtenerUsuarios();
    response.json(res);
});

app.get("/numeroUsuarios", function(request, response) {
    let res = sistema.numeroUsuarios();
    response.json(res);
});

app.get("/usuarioActivo/:nick", function(request, response) {
    let nick = request.params.nick;
    let res = sistema.usuarioActivo(nick);
    response.json(res);
});

app.get("/eliminarUsuario/:nick", function(request, response) {
    let nick = request.params.nick;
    let res = sistema.eliminarUsuario(nick);
    response.json(res);
});



app.post("/registrarUsuario",function(request,response){
    sistema.registrarUsuario(request.body,function(res){
    response.send({"nick":res.email});
    });
    });



app.post("/loginUsuario",function(request,response){
    sistema.loginUsuario(request.body,function(user){
    let token=jwt.sign({email:user.email,id:user._id},"937465366567-m4lurf473go0f19ou1jrevj7n3oat164.apps.googleusercontent.com    ");
    response.header("authtoken",token).json({error:null,data:token,email:user.email});
    })
    })
    


app.get("/confirmarUsuario/:email/:key",function(request,response){
    let email=request.params.email;
    let key=request.params.key;
    sistema.confirmarUsuario({"email":email,"key":key},function(usr){
    if (usr.email!=-1){
    response.cookie('nick',usr.email);
    }
    response.redirect('/');
    });
    })
    


const verifyToken = (req, res, next) => {
                const token = req.header('auth-token');
                if (!token) return res.status(401).json({ error: 'Acceso denegado' })
                try {
                const verified = jwt.verify(token, "937465366567-m4lurf473go0f19ou1jrevj7n3oat164.apps.googleusercontent.com")
                req.user = verified
                next() // continuamos
                } catch (error) {
                res.status(400).json({error: 'token no es válido'})
                }
                }


app.get("/obtenerUsuarios",verifyToken,function(request,response){
                let lista=sistema.obtenerUsuarios();
                response.send(lista);
                });

app.post('/enviarJwt',function(request,response){
                    let jswt=request.body.jwt;
                    let user=JSON.parse(atob(jswt.split(".")[1]));
                    let email=user.email;
                    sistema.usuarioGoogle({"email":email},function(obj){
                    let token=jwt.sign({email:obj.email,id:obj._id}," 937465366567-hs9jnojes1i6jmouqce8ghj6183hn6g0.apps.googleusercontent.com");
                    response.header("authtoken",token).json({error:null,data:token,email:obj.email});
                    })
                    });


        
httpServer.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});

//io.listen(httpServer);
ws.lanzarServidor(io,sistema);
                    




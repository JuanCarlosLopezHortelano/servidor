const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: path.resolve(__dirname, '../claves.env') });

// Importa el módulo 'passport' que se utiliza para la autenticación en Node.js.
const passport = require("passport");


// Importa la estrategia de autenticación de Google OAuth2 de Passport.
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;
const GitHubStrategy = require('passport-github2').Strategy;

// Importa la estrategia de autenticación local de Passport.
const LocalStrategy = require('passport-local').Strategy;

// Serializa al usuario para almacenar en la sesión.
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserializa al usuario a partir de la sesión.
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Configura la estrategia de autenticación de Google OAuth2.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //callbackURL: "http://procesossoft-yhkqrakm7q-ew.a.run.app/google/callback"  //PRODUCCION
  callbackURL: "http://localhost:3000/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  // Función de callback que se ejecuta cuando la autenticación de Google tiene éxito.
  // En este caso, se devuelve el perfil del usuario.
  return done(null, profile);
}
));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
passport.use(
  new GoogleOneTapStrategy(
    {
      clientID: process.env.GOOGLE_ONETAP_CLIENT_ID,
      clientSecret: process.env.GOOGLE_ONETAP_CLIENT_SECRET, // your google client secret
      verifyCsrfToken: false, // whether to validate the csrf token or not
    },
    function (profile, done) {
      // Here your app code, for example:
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      return done(null, profile);
    }
  )
  );


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // Verificar la autenticación y llamar a done según corresponda
  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);
  console.log("profile:", profile);
  let errorCondition = true;

  if (errorCondition) {
    // En caso de error, pasar el error a done
    console.log("Error durante la autenticación:", error);
    return done(error);
  } else if (!user) {
    // Si el usuario no está autenticado, pasar null como primer argumento a done
    console.log("Usuario no autenticado");
    return done(null, false);
  } else {
    // Si la autenticación fue exitosa, pasar el usuario autenticado como segundo argumento a done
    console.log("Autenticación exitosa. Usuario autenticado:", user);
    return done(null, user);
  }
}));
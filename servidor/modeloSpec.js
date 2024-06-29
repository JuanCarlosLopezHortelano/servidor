const modelo = require("./modelo.js");
const Sistema = modelo.Sistema;

describe('El sistema', function() {
   let sistema;
   
   beforeEach(function() {
   sistema=new Sistema()
   // Redefinir manualmente la función registrarLog para que no haga nada durante las pruebas
   sistema.registrarLog = function(tipoOperacion, email) {
      // Mock implementation: no hacer nada
  };
   });
   
   
   it('debería crear un sistema de tipo Sistema', function() {
      expect(sistema instanceof Sistema).toBe(true);
   });

   it('inicialmente no hay usuarios', function() {
  expect(sistema.numeroUsuarios()).toEqual({ num : 0 });
  });

  it('debería agregar un usuario correctamente', function() {
   expect(sistema.numeroUsuarios()).toEqual({ num : 0 }); 
   let usr2;
   usr2={"nick":"Pepa","email":"pepa@pepa.es"};
   sistema.agregarUsuario(usr2);
   expect(sistema.numeroUsuarios()).toEqual({ num : 1 });
});


it('no debería agregar un usuario con email duplicado', function() {
   let usr2 = { "nick": "Pepa", "email": "pepa@pepa.es" };
   sistema.agregarUsuario(usr2);
   sistema.agregarUsuario(usr2);
   expect(sistema.numeroUsuarios()).toEqual({ num: 1 });
});

 // Prueba la función eliminarUsuario
 it('debería eliminar un usuario correctamente', function() {
   let usr2;
   usr2={"nick":"Pepa","email":"pepa@pepa.es"};
   sistema.agregarUsuario(usr2);

   sistema.eliminarUsuario(usr2.email)
   expect(sistema.numeroUsuarios()).toEqual({ num : 0 });
});

it('debería devolver el número correcto de usuarios', function() {
   let usr2 = { "nick": "Pepa", "email": "pepa@pepa.es" };
   sistema.agregarUsuario(usr2);

   let usr3 = { "nick": "Pepo", "email": "pepo@pepo.es" };
   sistema.agregarUsuario(usr3);

   sistema.agregarUsuario(usr3);
   sistema.agregarUsuario(usr2);
   expect(sistema.numeroUsuarios()).toEqual({ num: 2 });
});

it('debería verificar si un usuario está activo', function() {
   let usr2 = { "nick": "Pepa", "email": "pepa@pepa.es" };
   sistema.agregarUsuario(usr2);
   expect(sistema.usuarioActivo(usr2.email)).toEqual({ "activo": true });
   expect(sistema.usuarioActivo("inexistente@pepa.es")).toEqual({ "activo": false });
});



// Prueba la funcion
it('debería devolver el número correcto de usuarios', function() {
   let usr2;
   usr2={"nick":"Pepa","email":"pepa@pepa.es"};
   sistema.agregarUsuario(usr2);

   let usr3;
   usr3={"nick":"Pepo","email":"pepo@pepo.es"};
   sistema.agregarUsuario(usr3);

   sistema.agregarUsuario(usr3);
   sistema.agregarUsuario(usr2);
   expect(sistema.numeroUsuarios()).toEqual({ num : 2 });
});
it('debería crear y unir a una partida', function() {
   let email = 'player@test.com';
   sistema.agregarUsuario({ email: email, nick: 'player', nombre: 'Player' });
   let codigo = sistema.crearPartida(email);
   expect(typeof codigo).toBe('number');
   expect(codigo).toBeGreaterThan(0);
   expect(codigo).toBeLessThan(10001);

   let joinResult = sistema.unirAPartida('secondPlayer@test.com', codigo);
   expect(joinResult.codigo).toBe(codigo);

   let partida = sistema.partidas[codigo];
   expect(partida.jugadores.length).toBe(2);
   });
   })
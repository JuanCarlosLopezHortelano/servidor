const modelo = require("./modelo.js");
const Sistema = modelo.Sistema;

describe('El sistema', function() {
   let sistema;
   
   beforeEach(function() {
   sistema=new Sistema()

   });
   
   
   it('debería crear un sistema de tipo Sistema', function() {
      expect(sistema instanceof Sistema).toBe(true);
   });

   it('inicialmente no hay usuarios', function() {
  expect(sistema.numeroUsuarios()).toEqual({ num : 0 });
  });

  it('debería agregar un usuario correctamente', function() {
   expect(sistema.numeroUsuarios()).toEqual({ num : 0 }); 
   sistema.agregarUsuario("pepe");
   expect(sistema.numeroUsuarios()).toEqual({ num : 1 });
});

 // Prueba la función eliminarUsuario
 it('debería eliminar un usuario correctamente', function() {
   sistema.agregarUsuario("usuario3");
   sistema.eliminarUsuario("usuario3");
   expect(sistema.usuarioActivo("usuario3")).toEqual({ "Activo": false });
});

// Prueba la funcion
it('debería devolver el número correcto de usuarios', function() {
   sistema.agregarUsuario("usuario5");
   sistema.agregarUsuario("usuario6");
   expect(sistema.numeroUsuarios()).toEqual({ num : 2 });
});


   })
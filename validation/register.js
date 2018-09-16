const validator = require("validator");

module.exports = body => {
  let errors = [];
  let isValid = true;
  if (validator.isEmpty(body.username)) {
    errors.push("Se requiere nombre de usuario");
  }
  if (validator.isEmpty(body.name)) {
    errors.push("Se requiere el nombre");
  }
  if (validator.isEmpty(body.email)) {
    errors.push("Correo electronico es requerido");
  }
  if (!validator.isEmail(body.email)) {
    errors.push(
      "Por favor introduzca una dirección de correo electrónico válida"
    );
  }
  if (validator.isEmpty(body.password)) {
    errors.push("Se requiere contraseña");
  }
  if (errors.length > 0) {
    isValid = false;
  }

  return {
    errors,
    isValid
  };
};

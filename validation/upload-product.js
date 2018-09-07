const validator = require("validator");

module.exports = (body, files) => {
  let errors = [];
  let isValid = true;
  if (validator.isEmpty(body.title)) {
    errors.push({ message: "Título es requerido" });
  }
  if (validator.isEmpty(body.category)) {
    errors.push({ message: "la categoria es requerida" });
  }
  if (validator.isEmpty(body.details)) {
    errors.push({
      message: "Detalles son requeridos"
    });
  }
  if (validator.isEmpty(body.date)) {
    errors.push({ message: "Fecha es requerida" });
  }
  if (!files.productImg) {
    errors.push({ message: "La imagen del producto es obligatoria" });
  }
  if (errors.length > 0) {
    isValid = false;
  }

  return {
    errors,
    isValid
  };
};

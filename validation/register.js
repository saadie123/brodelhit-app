const validator = require("validator");

module.exports = body => {
  let errors = [];
  let isValid = true;
  if (validator.isEmpty(body.username)) {
    errors.push("Username is required");
  }
  if (validator.isEmpty(body.email)) {
    errors.push("Email is required");
  }
  if (!validator.isEmail(body.email)) {
    errors.push("Please enter a valid email");
  }
  if (validator.isEmpty(body.password)) {
    errors.push("Password is required");
  }
  if (errors.length > 0) {
    isValid = false;
  }

  return {
    errors,
    isValid
  };
};

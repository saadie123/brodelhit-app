module.exports = (date, cl) => {
  if (date < new Date()) {
    return cl;
  } else {
    return "";
  }
};

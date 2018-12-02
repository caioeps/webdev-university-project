module.exports = function decorateMongooseError(error) {
  console.log(error)
  if (!error) return null;

  if(error.errors) {
    return Object.keys(error.errors).reduce((errors, key) => {
      errors[key] = errors.errors[key].message;
      return errors;
    }, {});
  } else {
    return {
      base: error.errmsg
    };
  }
}

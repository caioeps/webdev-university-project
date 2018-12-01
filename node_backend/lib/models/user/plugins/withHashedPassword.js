/**
 * Plugin to add hashed password.
 */
module.exports = async function withHashedPassword(schema) {
  schema.pre('validate', async function(next) {
    try {
      await this.encryptPassword();
      next();
    } catch (error) {
      next(error);
    }
  });
}

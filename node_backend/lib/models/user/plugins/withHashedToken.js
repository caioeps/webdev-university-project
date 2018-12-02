/**
 * Plugin to add hashed token.
 */
module.exports = async function withHashedToken(schema) {
  schema.pre('validate', async function(next) {
    try {
      await this.encryptToken();
      next();
    } catch (error) {
      next(error);
    }
  });
}

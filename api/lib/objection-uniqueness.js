const { UserInputError } = require('apollo-server-micro');
const v = require('voca');

function ObjectionUniqueness(Model) {
  return class extends Model {
    async $beforeInsert(context) {
      await super.$beforeInsert(context);

      const uniqueFields = this.constructor.validateUniqueness;
      if (uniqueFields) {
        const errors = {};
        const queries = uniqueFields.map(fieldName => {
          const value = this[fieldName];

          return this.constructor
            .query()
            .where(fieldName, value)
            .limit(1);
        });
        await Promise.all(queries).then(results => {
          uniqueFields.map((fieldName, idx) => {
            if (results[idx].length > 0) {
              errors[fieldName] = v.capitalize(`${fieldName} is already taken`);
            }
          });
        });

        if (Object.values(errors).length > 0) {
          throw new UserInputError('ValidationError', {
            errors
          });
        }
      }
    }
  };
}

module.exports = {
  ObjectionUniqueness
};

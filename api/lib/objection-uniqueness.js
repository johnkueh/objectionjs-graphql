const { UserInputError } = require('apollo-server-lambda');
const v = require('voca');

function ObjectionUniqueness(Model) {
  return class extends Model {
    async $beforeInsert(context) {
      await super.$beforeInsert(context);

      const uniqueFields = this.constructor.validateUniqueness;
      if (uniqueFields) {
        const errors = {};
        const queries = uniqueFields.map(field => {
          const { fieldName, scope } = parseFieldName(field);
          let query = this.constructor
            .query()
            .limit(1)
            .where(fieldName, this[fieldName]);

          if (scope) {
            query = query.where(scope, this[scope]);
          }

          return query;
        });
        await Promise.all(queries).then(results => {
          uniqueFields.map((field, idx) => {
            if (results[idx].length > 0) {
              const { fieldName, scope } = parseFieldName(field);
              if (scope) {
                errors[fieldName] = v.capitalize(
                  `${fieldName} with scope ${scope} is already taken`
                );
              } else {
                errors[fieldName] = v.capitalize(`${fieldName} is already taken`);
              }
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

const parseFieldName = field => {
  let fieldName = field;
  let scope = null;

  if (Array.isArray(field)) {
    [fieldName, { scope }] = field;
  }

  return {
    fieldName,
    scope
  };
};

module.exports = {
  ObjectionUniqueness
};

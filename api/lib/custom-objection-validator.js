const v = require('voca');
const { Validator } = require('objection');
const { UserInputError } = require('apollo-server-lambda');

class CustomObjectionValidator extends Validator {
  validate(args) {
    // The model instance. May be empty at this point.
    const model = args.model;

    // The properties to validate. After validation these values will
    // be merged into `model` by objection.
    const json = args.json;

    // `ModelOptions` object. If your custom validator sets default
    // values, you need to check the `opt.patch` boolean. If it is true
    // we are validating a patch object and the defaults should not be set.
    const opt = args.options;

    // A context object shared between the validation methods. A new
    // object is created for each validation operation. You can store
    // any data here.
    const ctx = args.ctx;

    // Do your validation here and throw any exception if the
    // validation fails.
    const schema = model.constructor.validationSchema;

    if (schema) {
      try {
        schema.validateSync(json, { abortEarly: false });
      } catch (error) {
        const { name, inner } = error;
        const errors = {};
        inner.forEach(({ path, message }) => {
          errors[path] = v.capitalize(message);
        });
        throw new UserInputError(name, {
          errors
        });
      }
    }

    return json;
  }

  beforeValidate(args) {
    // Takes the same arguments as `validate`. Usually there is no need
    // to override this.
    return super.beforeValidate(args);
  }

  afterValidate(args) {
    // Takes the same arguments as `validate`. Usually there is no need
    // to override this.
    return super.afterValidate(args);
  }
}

module.exports = {
  CustomObjectionValidator
};

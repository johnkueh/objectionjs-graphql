const { Model } = require('objection');
const yup = require('yup');
const guid = require('objection-guid')();
const { CustomObjectionValidator } = require('../lib/custom-objection-validator');
const { ObjectionUniqueness } = require('../lib/objection-uniqueness');
const validator = new CustomObjectionValidator();

class Base extends ObjectionUniqueness(guid(Model)) {
  static get yup() {
    return yup;
  }

  static createValidator() {
    return validator;
  }
}

module.exports = {
  Model: Base
};

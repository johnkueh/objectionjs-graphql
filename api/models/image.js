import { Model } from './base';

class Image extends Model {
  static get tableName() {
    return 'images';
  }

  static get validateUniqueness() {
    return ['publicId'];
  }

  static get validationSchema() {
    return this.yup.object().shape({
      publicId: this.yup.string().required(),
      imageableType: this.yup
        .string()
        .required()
        .matches(/(UserLogo)/),
      imageableId: this.yup.string().required()
    });
  }
}

export default Image;

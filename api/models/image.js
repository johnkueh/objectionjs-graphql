import { Model } from './base';
import cloudinary from 'cloudinary';

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

  async $afterDelete(queryContext) {
    await super.$afterDelete(queryContext);
    await cloudinary.uploader.destroy(this.publicId);
  }
}

export default Image;

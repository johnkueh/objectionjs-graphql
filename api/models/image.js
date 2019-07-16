import { Model } from './base';

class Image extends Model {
  static get tableName() {
    return 'images';
  }
}

export default Image;

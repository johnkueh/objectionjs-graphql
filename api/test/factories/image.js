import factory from '../support/factory-with-adapter';
import Image from '../../models/image';

factory.define('image', Image, {
  publicId: '123123',
  caption: 'A caption'
});

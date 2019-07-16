import { objectType, inputObjectType, queryField, mutationField, arg } from 'nexus';
import ValidationErrors from '../lib/validation-errors';
import Image from '../models/image';

export const ImageType = objectType({
  name: 'Image',
  definition(t) {
    t.id('id');
    t.string('publicId');
    t.int('position', { nullable: true });
    t.string('caption', { nullable: true });
  }
});

export const UpsertImageInputType = inputObjectType({
  name: 'UpsertImageInput',
  definition(t) {
    t.string('imageableType');
    t.string('imageableId');
    t.string('publicId');
    t.id('id', { required: false });
    t.int('position', { required: false });
    t.string('caption', { required: false });
  }
});

export const UpsertImageMutation = mutationField('upsertImage', {
  type: ImageType,
  args: {
    input: arg({
      type: UpsertImageInputType,
      required: true
    })
  },
  resolve: async (parent, { input }) => {
    return Image.query().upsertGraph(input);
  }
});

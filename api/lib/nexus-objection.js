import lowerCase from 'lodash/lowerCase';
import { objectType, inputObjectType, queryField, mutationField, arg, idArg } from 'nexus';

export const crudType = ({ model, owner, modelFields, createInputFields, updateInputFields }) => {
  const ModelType = objectType({
    name: model.name,
    ...modelFields
  });

  const CollectionQuery = queryField(model.tableName, {
    type: ModelType,
    list: true,
    resolve: async (parent, args, ctx) => {
      const query = model.query();
      if (owner) {
        const relatedIds = await owner(ctx)
          .$relatedQuery(model.tableName)
          .map(({ id }) => id);
        return query.where('id', 'IN', relatedIds);
      }
      return query;
    }
  });

  const ResourceInputType = inputObjectType({
    name: `${model.name}Input`,
    definition(t) {
      t.id('id', { required: true });
    }
  });

  const ResourceQuery = queryField(lowerCase(model.name), {
    type: ModelType,
    args: {
      input: arg({
        type: ResourceInputType,
        required: true
      })
    },
    resolve: async (parent, { input }, ctx) => {
      return model.query().findById(input.id);
    }
  });

  const CreateInputType = inputObjectType({
    name: `Create${model.name}Input`,
    ...createInputFields
  });

  const CreateMutation = mutationField(`create${model.name}`, {
    type: ModelType,
    args: {
      input: arg({
        type: CreateInputType,
        required: true
      })
    },
    resolve: async (parent, { input }, ctx) => {
      const created = await model.query().insert(input);
      if (owner) {
        await created.$relatedQuery(owner(ctx).constructor.tableName).relate(owner(ctx).id);
      }
      return created;
    }
  });

  const UpdateInputType = inputObjectType({
    name: `Update${model.name}Input`,
    ...updateInputFields
  });

  const UpdateMutation = mutationField(`update${model.name}`, {
    type: ModelType,
    args: {
      input: arg({
        type: UpdateInputType,
        required: true
      })
    },
    resolve: async (parent, { input }) => {
      const { id } = input;
      return model.query().patchAndFetchById(id, input);
    }
  });

  const DeletePayload = objectType({
    name: `Delete${model.name}Payload`,
    definition(t) {
      t.int('count');
    }
  });

  const DeleteInputType = inputObjectType({
    name: `Delete${model.name}Input`,
    definition(t) {
      t.string('id', { required: true });
    }
  });

  const DeleteMutation = mutationField(`delete${model.name}`, {
    type: DeletePayload,
    args: {
      input: arg({
        type: DeleteInputType,
        required: true
      })
    },
    resolve: async (parent, { input }) => {
      const { id } = input;
      return { count: await model.query().deleteById(id) };
    }
  });

  return {
    ModelType,
    CollectionQuery,
    ResourceQuery,
    CreateInputType,
    CreateMutation,
    UpdateInputType,
    UpdateMutation,
    DeleteInputType,
    DeleteMutation
  };
};

export default {
  crudType
};

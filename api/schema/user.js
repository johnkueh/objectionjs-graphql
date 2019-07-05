import { objectType, inputObjectType, queryField, mutationField, arg } from 'nexus';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import ValidationErrors from '../lib/validation-errors';
import User from '../models/user';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('email');
  }
});

export const LoginInputType = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
  }
});

export const SignupInputType = inputObjectType({
  name: 'SignupInput',
  definition(t) {
    t.string('email', { required: true });
    t.string('password', { required: true });
    t.string('name', { required: true });
  }
});

export const AuthPayloadType = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('jwt');
    t.field('user', { type: UserType });
  }
});

export const meQuery = queryField('me', {
  type: UserType,
  resolve: async (parent, args, ctx) => {
    if (ctx.user) {
      const user = await User.query().findById(ctx.user.id);
      return user;
    }

    throw ValidationErrors({
      auth: 'You are not authorized to perform this action'
    });
  }
});

export const signupMutation = mutationField('signup', {
  type: AuthPayloadType,
  args: {
    input: arg({
      type: SignupInputType,
      required: true
    })
  },
  resolve: async (parent, { input }) => {
    const { email, name, password } = input;
    const user = await User.query().insert({
      email,
      name,
      password
    });
    return {
      jwt: jwtSign({ id: user.id, email }),
      user
    };
  }
});

export const loginMutation = mutationField('login', {
  type: AuthPayloadType,
  args: {
    input: arg({
      type: LoginInputType,
      required: true
    })
  },
  resolve: async (parent, { input }) => {
    const { email, password } = input;
    const users = await User.query().where('email', email);
    const user = users[0];

    if (user && bcrypt.compareSync(password, user.password)) {
      return {
        jwt: jwtSign({ id: user.id, email }),
        user
      };
    }

    throw ValidationErrors({
      auth: 'Please check your credentials and try again.'
    });
  }
});

export const JWTSECRET = 'JWTSECRET';
export const jwtSign = ({ id, email }) => jsonwebtoken.sign({ id, email }, JWTSECRET);

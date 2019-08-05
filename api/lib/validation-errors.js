import { UserInputError } from 'apollo-server-lambda';

const ValidationErrors = errors => new UserInputError('ValidationError', { errors });

export default ValidationErrors;

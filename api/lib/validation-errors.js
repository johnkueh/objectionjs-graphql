import { UserInputError } from 'apollo-server-micro';

const ValidationErrors = errors => new UserInputError('ValidationError', { errors });

export default ValidationErrors;

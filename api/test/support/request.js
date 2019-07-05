import supertest from 'supertest';

const request = async ({ handler, apiPath, variables, query, headers = {}, cookies = [] }) => {
  const { body } = await supertest(handler)
    .post(apiPath)
    .set(headers)
    .set('Cookie', cookies)
    .send({
      query,
      variables
    });

  // Debug use only
  if (body.errors) {
    body.errors.map(error => {
      switch (error.extensions.code) {
        case 'BAD_USER_INPUT':
          return null;
        case 'UNAUTHENTICATED':
          return null;
        default:
          return console.log(`❌  ${error.extensions.code}`, error);
      }
    });
  }

  return body;
};

export default request;

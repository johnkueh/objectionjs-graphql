### Objection.js GraphQL Starter

- Objection.js as ORM
- Apollo Server as GraphQL server
- GraphQL Nexus - code-first schema definition
- Next.js for server-rendered frontend
- bcrypt, jwt for authentication
- Custom react hooks for [managing form state](https://github.com/yoongfook/objection-js-graphql-starter/blob/master/web/hooks/use-form.js) and [image/file uploading to Cloudinary](https://github.com/yoongfook/objection-js-graphql-starter/blob/master/web/hooks/use-upload.js)
- FactoryGirl for test fixtures replacement, paired with `factory-girl-objection-adapter`
  for easy creation of test cases
- Jest and Cypress for integration tests
- Deploy API to AWS Lambda via Serverless Framework [serverless.yml](https://github.com/yoongfook/objection-js-graphql-starter/tree/master/api/serverless.yml)
- Example [integration tests](https://github.com/yoongfook/objection-js-graphql-starter/tree/master/api/test/integration) of graphql endpoints using database transactions, `apollo-server-testing`, and Jest snapshots to capture responses
- Example [e2e tests](https://github.com/yoongfook/objection-js-graphql-starter/tree/master/api/cypress/integration) using Cypress for important user flows

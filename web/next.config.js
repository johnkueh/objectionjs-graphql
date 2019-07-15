const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

module.exports = withSass(
  withCss({
    target: 'serverless',
    env: {
      GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET
    }
  })
);

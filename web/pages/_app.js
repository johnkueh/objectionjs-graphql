import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from 'react-apollo-hooks';
import { CloudinaryContext } from 'cloudinary-react';
import withApolloClient from '../lib/with-apollo-client';
import 'nprogress/nprogress.css';
import '../styles/index.scss';

Router.events.on('routeChangeStart', url => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
  render() {
    const { Component, pageProps, router, apolloClient } = this.props;

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" />
        </Head>
        <Container>
          <ApolloProvider client={apolloClient}>
            <CloudinaryContext cloudName={process.env.CLOUDINARY_CLOUD_NAME}>
              <Component {...pageProps} router={router} apolloClient={apolloClient} />
            </CloudinaryContext>
          </ApolloProvider>
        </Container>
      </>
    );
  }
}

export default withApolloClient(withRouter(MyApp));

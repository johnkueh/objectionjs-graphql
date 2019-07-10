import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import NProgress from 'nprogress';
import { ApolloProvider } from 'react-apollo-hooks';
import withApolloClient from '../lib/with-apollo-client';
import 'nprogress/nprogress.css';

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
        </Head>
        <Container>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} router={router} apolloClient={apolloClient} />
          </ApolloProvider>
        </Container>
      </>
    );
  }
}

export default withApolloClient(withRouter(MyApp));

import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';

let apolloClient = null;

function create({ initialState, headers: customHeaders }) {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT, // Server URL (must be absolute)
    credentials: 'include', // Additional fetch() options like `credentials` or `headers`
    // Use fetch() polyfill on the server
    fetch: !process.browser && fetch
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...customHeaders
      }
    };
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo({ initialState, headers }) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create({ initialState, headers });
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create({ initialState, headers });
  }

  return apolloClient;
}

import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { inject, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../environments/environment';
import { provideApollo } from 'apollo-angular';

/**
 * Modern Apollo Provider for Angular 17+ Standalone Architecture
 * This seamlessly integrates with HttpClient, allowing us to reuse
 * our completely custom authInterceptor for JWT injection and 401 refresh logic natively!
 */
export const graphqlProvider = makeEnvironmentProviders([
  provideApollo(() => {
    const httpLink = inject(HttpLink);

    return {
      link: httpLink.create({
        uri: environment.graphqlUrl,
        withCredentials: true, // Absolutely mandatory for secure HttpOnly session cookies
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
      },
    };
  }),
]);

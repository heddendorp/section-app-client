import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';

const uri = environment.server + '/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const http = httpLink.create({ uri });
  const addClientName = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders()
        .set('x-graphql-client-name', 'events-client')
        .set('x-graphql-client-version', environment.version),
    });
    return forward(operation);
  });
  const link = addClientName.concat(http);

  return {
    link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

import express from 'express';
import * as http from 'http';
import { createContext } from './context';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { schema } from './schema';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      picture: string;
    }

    interface Request {
      user?: User;
      token?: {
        iss: string;
        sub: string;
        aud: string[];
        iat: number;
        exp: number;
        azp: string;
        scope: string;
      };
    }
  }
}

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema,
  context: createContext,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // ApolloServerPluginCacheControl(),
    // measurementPlugin,
  ],
});

server.start().then(() => {
  server.applyMiddleware({ app });
  const port = process.env.PORT ?? 3333;
  httpServer.listen({ port }, () => {
    console.log(`
    🚀 Server ready at http://localhost:${port}
    🕵️ GraphQL ready at: http://localhost:${port}${server.graphqlPath}
    `);
  });
});

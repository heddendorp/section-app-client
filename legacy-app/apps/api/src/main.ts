import { ApolloServer } from 'apollo-server'
import {PrismaClient} from '@tumi/models';
import {schema} from '@tumi/schema';

const prisma = new PrismaClient()

const server = new ApolloServer({
  schema,
  context() {
    return {
      prisma,
    }
  },
})

server.listen().then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
  `)
})

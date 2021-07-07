//--------MODULES
import {  ApolloServer, makeExecutableSchema } from 'apollo-server'
import { readFileSync } from 'fs'
import { join } from 'path'


//-------FILES
import userQuery from './api/users/user.query'
import userMutate from './api/users/user.mutate'
import contextCreator from './utils/ctx'

const resolvers = {
  Query: {
    ...userQuery,
  },
  Mutation: {
    ...userMutate
  }
}

const schema = makeExecutableSchema({
  typeDefs: readFileSync(join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  resolverValidationOptions: { requireResolversForResolveType: false },
});

const server = new ApolloServer({
  schema,
  cors: false,
  context: contextCreator,
})

server.listen({ port: 8080 }).then(_=>console.log(`Server is Up! 🚀🚀`))
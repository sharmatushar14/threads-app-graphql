import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphqlServer(){
    const gqlserver =  new ApolloServer({
        typeDefs:
        //Schema sort of
        `
        type Query {
            ${User.queries}
        }
        type Mutation {
            ${User.mutations}
        }
        `, //To make them required, ! is used to make them required, by default they are optional
        resolvers: {
            Query: {
                ...User.resolvers.queries
            },
            Mutation: { 
                ...User.resolvers.mutations
            }
        }
    });
    
    
    //Start the GQL Server
    await gqlserver.start();

    return gqlserver;
}

export default createApolloGraphqlServer;
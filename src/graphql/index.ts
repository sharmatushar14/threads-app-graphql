import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphqlServer(){
    const gqlserver =  new ApolloServer({
        typeDefs:
        //Schema sort of
        `
        type Query {

        }
        type Mutation {

        }
        `, //To make them required, ! is used to make them required, by default they are optional
        resolvers: {
            Query: {

            },
            Mutation: {

            }
        }
    });
    
    
    //Start the GQL Server
    await gqlserver.start();

    return gqlserver;
}

export default createApolloGraphqlServer;
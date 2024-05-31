import express from "express"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { graphql } from "graphql";
import { prismaClient } from "./lib/db";

async function init() {const app = express();
app.use(express.json());
const PORT =  Number(process.env.PORT) || 8000;

const gqlserver =  new ApolloServer({
    typeDefs:
    //Schema sort of
    `
    type Query {
        hello: String
        say(name: String): String 
    }
    type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
    }
    `, //To make them required, ! is used to make them required, by default they are optional
    resolvers: {
        Query: {
            hello: ()=> {return `Hey, There I am a GraphQL Server`},
            say: (_, {name}: {name: String})=> `Hey ${name}, How are you!`
        },
        Mutation: {
            createUser: async(_, {firstName, lastName, email, password}:
                {
                    firstName: string
                    lastName: string
                    email: string
                    password: string
                }
            )=>{
                await prismaClient.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        password,
                        salt: "random_salt",
                    }
                })
            
                return true;
            }
        }
    }
});


//Start the GQL Server
await gqlserver.start();

app.get('/', (req, res)=>{
    res.json({
        message: "Server is up and running"
    })
})

app.use('/graphql', expressMiddleware(gqlserver))

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})}


init();



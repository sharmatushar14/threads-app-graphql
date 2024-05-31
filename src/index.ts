import express from "express"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { graphql } from "graphql";

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
    `,
    resolvers: {
        Query: {
            hello: ()=> {return `Hey, There I am a GraphQL Server`},
            say: (_, {name}: {name: String})=> `Hey ${name}, How are you!`
        }
    }
})


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



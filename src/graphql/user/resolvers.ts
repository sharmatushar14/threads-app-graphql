import UserService, {CreateUserPayload} from "../../services/user"

const queries = {
    getUserToken: async(
        _: any, 
        payload: {email: string; passsword: string}
    ) => {
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.passsword
        })
        return token;
    },

    getCurrentLoggedInUser: async(_:any, parameters:any, context:any)=>{
        //context is accessed as the third parameter, always remember
        if(context && context.user){
            const id = context.user.id;
            console.log(id);
            const user = await UserService.getUserById(id);
            console.log(user);
            return user;
        }
        throw new Error("I dont know who are you")
    }

}
const mutations = {
    createUser: async(_: any, payload: CreateUserPayload) => {
        const res = await UserService.createUser(payload);
        return res.id
    }
}

export const resolvers = {queries, mutations};
import { createHmac, randomBytes} from "node:crypto";
import JWT from 'jsonwebtoken';
import { prismaClient } from "../lib/db";

const JWT_SECRET = "tTushar@12234"

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string
}

class UserService {
    private static generateHash(salt: string, password: string){
        if (!salt || !password) {
            throw new Error("Salt and password must be provided");
        }
        const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");
        console.log(hashedPassword);
        return hashedPassword;    
    }

    public static createUser(payload: CreateUserPayload) {
        const {firstName, lastName, email, password} = payload;

        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt, password);
        if(!hashedPassword){
            throw new Error("Something wrong with password function");
        }

        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword
            }
        })
    }

    private static getUserByEmail(email: string){
        return prismaClient.user.findUnique({where: {email}});
    }

    public static async getUserToken(payload: GetUserTokenPayload){
        const {email, password} = payload;
        const user = await UserService.getUserByEmail(email);
        if(!user) throw new Error("User not found")
        console.log(user);
        
        const usersalt = user.salt.toString();
        console.log(usersalt);
        
        
        try {
            const userHashPassword = UserService.generateHash(usersalt, password);
            console.log("Hashed password:", userHashPassword);
                    
            if(userHashPassword !== user.password){
              throw new Error("Incorrect Password");
        }

        } catch (error) {
            console.error("Error generating hash:", error);
        }

        //Generate Token
        const token = JWT.sign({id: user.id, email: user.email}, JWT_SECRET);
        return token;
    }
}

export default UserService;
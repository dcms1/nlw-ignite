import axios from 'axios';
import prismaClient from '../prisma';
import {sign} from "jsonwebtoken";

interface IAccessTokenResponse{
    access_token:string;
}

interface IUserResponse{
    avatar_url:string;
    login: string;
    id: number;
    name: string;
}

class AutenticateUserService{
    async execute(code:string){
        const url = "https://github.com/login/oauth/access_token";

        const {data:accessTokenResponse} = await axios.post<IAccessTokenResponse>(url,null,{
            params: {
                client_id: process.env.github_client_id,
                client_secret: process.env.github_client_secret,
                code,

            },
            headers: {
                "Accept": "application/json"
            }
        })
        
        const response = await axios.get<IUserResponse>("https://api.github.com/user",{
            headers: {
                authorization:`Bearer ${accessTokenResponse.access_token}`
            }
        })

        const {login, id, avatar_url, name} = response.data

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        })

        if(!user){
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        }

        

        const token = sign({
            user:{
                name: user.name,
                avatar_url: user.avatar_url,
                login: user.login,
            },
         },
         process.env.jwt_secret,
         {
             subject : user.id,
             expiresIn: "1d",
         }
        );

        
        return {token, user};
    }
}
export{AutenticateUserService}
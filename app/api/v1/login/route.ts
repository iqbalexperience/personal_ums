import { callDynamicApi } from "@/lib/callDynamicApi";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateFromEmail } from "unique-username-generator";
import jwt from "jsonwebtoken";


export async function POST(req: NextRequest) {
  try {
    const { email, password, apiKey, method, access_token, ip, device, language } = await req.json();


    if(!email || !apiKey || !ip || !device || !language || !method){
        return NextResponse.json({ message: "Invalid request", required: { email, apiKey, ip, device, language, method } }, { status: 400 });
    }

    if(method === "credentials"){
        if(!password){
            return NextResponse.json({ message: "Invalid request", required: { password } }, { status: 400 });
        }
        
        const findUser = await callDynamicApi({
            model: "user",
            queryType: "findFirst",
            where: {
                email
            },
            apiKey,
            select: {
                id: true,
                password: true,
                accounts: {
                    where: {
                        provider: "credentials"
                    },
                    select: {
                        access_token: true
                    }
                }
            }
        })
        // console.log(findUser);
        const password_hashed = findUser?.result?.password;
        const account_token = findUser?.result?.accounts[0]?.access_token;
        const userId = findUser?.result?.id

        if(!password_hashed || !userId){
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        const comparePassword = bcrypt.compareSync(password, password_hashed)
        // console.log({comparePassword});

        if(!comparePassword){
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        if(!account_token){
            return NextResponse.json({ message: "Not linked to credentials auth" }, { status: 400 });
        }

        var session_token = jwt.sign({ email: email, password: password }, account_token);

        const expires = generateExpireTime()
        console.log({expires});


        const response_1 = await createUserSession({sessionToken: session_token, ip, device, language, apiKey, userId, expires});

        // console.log(session_token);
        return NextResponse.json({ token: response_1?.result?.sessionToken }, { status: 200 });

        
    }else{

    }

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}



const createUserSession = async({sessionToken, ip, device, language, apiKey, userId, expires}:any) => {

        await callDynamicApi({
            apiKey,
            model: "session",
            queryType: "deleteMany",
            where: {
                userId,
                expires: {
                    lt: new Date()
                }
            }
        });

    const checkSession = await callDynamicApi({
        apiKey,
        model: "session",
        queryType: "findFirst",
        where: {
            userId,
            expires: {
                gt: new Date()
            },
            device,
            ip
        },
        select: {
            sessionToken: true,
        },
    });
    if(checkSession?.result?.sessionToken){
        return checkSession
    }else{
        const result = await callDynamicApi({
            apiKey,
            model: "session",
            queryType: "create",
            data: {
                sessionToken,
                ip: ip,
                device: device,
                language: language,
                user: {connect: {id: userId}},
                expires
            },
            select: {
                sessionToken: true,
            },
        });
    
        return result
    }


}



const generateExpireTime = () => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 12);
    return currentDate;
  };
  

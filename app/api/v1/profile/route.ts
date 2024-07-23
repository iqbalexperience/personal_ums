import { callDynamicApi } from "@/lib/callDynamicApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const { userId, name, img, extra, apiKey } = await req.json();

    if(!userId){
        return NextResponse.json({
            message: "Unauthorized",
            required: {
                userId
            }
        }, { status: 400 });
    }

    const result = await callDynamicApi({
        model: "profile",
        queryType: "update",
        where: {
            userId
        },
        data: {
            name,
            img,
            extra
        },
        select: {
            id: true,
            name: true,
            img: true,
            username: true,
            extra: true
        },
        apiKey
    });

    return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }); 
    }
}
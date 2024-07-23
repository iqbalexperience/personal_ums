import { callDynamicApi } from "./callDynamicApi";

export const verifySession = async (apiKey: string, sessionToken: string) => {
    const result = await callDynamicApi({
        apiKey,
        model: "session",
        queryType: "findFirst",
        where: {
            sessionToken,
            expires: {
                gt: new Date(),
            },
        },
        select: {
            userId: true,
        },
    });
    return result?.result?.userId;
}

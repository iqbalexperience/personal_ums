import { prismaInstance } from "@/lib/prismaInit";
import { NextRequest, NextResponse } from "next/server";

interface RequestType {
  model: any;
  queryType: any;
  where?: any;
  select?: any;
  take?: any;
  skip?: any;
  orderBy?: any;
  data?: any;
  apiKey: any;
}

export async function callDynamicApi({
  model,
  queryType,
  where,
  select,
  take,
  skip,
  orderBy,
  data,
  apiKey,
}: RequestType) {
  try {
    if (
      !model ||
      ![
        "findUnique",
        "findMany",
        "findFirst",
        "create",
        "update",
        "delete",
        "createMany",
        "updateMany",
        "deleteMany",
      ].includes(queryType) ||
      !apiKey
    ) {
      return { status: false, message: "Invalid request", result: {} };
    }
    const reqAuth = await prismaInstance.umsClient.findFirst({
      where: {
        apiKeys: {
          has: apiKey,
        },
      },
      select: {
        id: true,
      },
    });

    if (!reqAuth?.id) {
      return { status: false, message: "Unauthorised", result: {} };
    }

    const dbBody: any = {};
    if (where)
      dbBody["where"] =
        model === "user"
          ? queryType.includes("update")
            ? {
                email_clientId: { email: where.email, clientId: reqAuth?.id },
              }
            : { clientId: reqAuth?.id, ...where }
          : where;
    if (select) dbBody["select"] = select;
    if (take && queryType === "findMany") dbBody["take"] = take;
    if (skip && queryType === "findMany") dbBody["skip"] = skip;
    if (orderBy && queryType === "findMany") dbBody["orderBy"] = orderBy;
    if (
      data &&
      ["create", "update", "createMany", "updateMany"].includes(queryType)
    )
      dbBody["data"] =
        model === "user" && queryType.includes("create")
          ? {
              ...data,
              client: {
                connect: {
                  id: reqAuth?.id,
                },
              },
            }
          : data;

    console.log({ dbBody });
    // @ts-ignore
    const result = await prismaInstance[model][queryType](dbBody);
    return { status: true, result };
  } catch (error) {
    console.log(error);
    return { status: false, message: "Something went wrong", result: {} };
  }
}

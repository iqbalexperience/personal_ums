import { prismaInstance } from "@/lib/prismaInit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      model,
      queryType,
      where,
      select,
      take,
      skip,
      orderBy,
      data,
      apiKey,
    } = await req.json();
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
      return NextResponse.json(
        {
          message: "Invalid request",
          required: {
            model,
            queryType,
            apiKey,
          },
        },
        { status: 400 }
      );
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const dbBody: any = {};
    if (where) dbBody["where"] = model === "user" && where.email ? { email_clientId: {
      email: where.email,
      clientId: reqAuth?.id,
    }, ...where } : where;
    if (select) dbBody["select"] = select;
    if (take && queryType === "findMany") dbBody["take"] = take;
    if (skip && queryType === "findMany") dbBody["skip"] = skip;
    if (orderBy && queryType === "findMany") dbBody["orderBy"] = orderBy;
    if (
      data &&
      ["create", "update", "createMany", "updateMany"].includes(queryType)
    )
      dbBody["data"] = data;
    // @ts-ignore
    const result = await prismaInstance[model][queryType](dbBody);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

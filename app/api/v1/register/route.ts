import { callDynamicApi } from "@/lib/callDynamicApi";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateFromEmail } from "unique-username-generator";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, img, access_token, provider, apiKey } =
      await req.json();

    if (
      !email ||
      !["credentials", "google", "facebook", "github", "discord"].includes(
        provider
      ) ||
      !apiKey
    ) {
      return NextResponse.json(
        {
          message: "email provider and apiKey are required",
          required: {
            email,
            provider,
            apiKey,
          },
        },
        { status: 400 }
      );
    }

    if (provider === "credentials") {
      if (!name || !password) {
        return NextResponse.json(
          {
            message: "name and password are required",
            required: {
              name,
              password,
            },
          },
          { status: 400 }
        );
      }

      const userStatus = await isUser({ apiKey, email, provider });

      if (userStatus === "link_account") {
        const result = await callDynamicApi({
          apiKey,
          model: "user",
          queryType: "update",
          where: {
            email: email,
          },
          data: {
            accounts: {
              create: {
                provider: provider,
                access_token: nanoid(32),
                refresh_token: nanoid(32),
                reset_token: nanoid(32),
              },
            },
          },
          select: {
            id: true,
            emailVerified: true,
            email: true,
          },
        });
        if (result.status) {
          return NextResponse.json(result);
        } else {
          return NextResponse.json(
            { message: result.message },
            { status: 200 }
          );
        }
      } else if (userStatus === "create_user") {
        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await callDynamicApi({
          apiKey,
          model: "user",
          queryType: "create",
          data: {
            email: email,
            password: hashedPassword,
            emailVerified: false,
            profile: {
              create: {
                name: name,
                img: img,
                username: generateFromEmail(email, 6),
              },
            },
            accounts: {
              create: {
                provider: provider,
                access_token: nanoid(32),
                refresh_token: nanoid(32),
                reset_token: nanoid(32),
              },
            },
          },
          select: {
            id: true,
            emailVerified: true,
            email: true,
          },
        });
        if (result.status) {
          return NextResponse.json(result);
        } else {
          return NextResponse.json(
            { message: result.message },
            { status: 200 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "User and account already exists" },
          { status: 200 }
        );
      }
    } else {
      if (!name || !access_token) {
        return NextResponse.json(
          {
            message: "name and access_token are required",
            required: {
              name,
              access_token,
            },
          },
          { status: 400 }
        );
      }
      const userStatus = await isUser({ apiKey, email, provider });
      if (userStatus === "link_account") {
        const result = await callDynamicApi({
          apiKey,
          model: "user",
          queryType: "update",
          where: {
            email: email,
          },
          data: {
            accounts: {
              create: {
                provider: provider,
                access_token: access_token,
                refresh_token: nanoid(32),
                reset_token: nanoid(32),
              },
            },
          },
          select: {
            id: true,
            emailVerified: true,
            email: true,
          },
        });
        if (result.status) {
          return NextResponse.json(result);
        } else {
          return NextResponse.json(
            { message: result.message },
            { status: 200 }
          );
        }
      } else if (userStatus === "create_user") {
        const hashedPassword = await bcrypt.hash(nanoid(6), 12);

        const result = await callDynamicApi({
          apiKey,
          model: "user",
          queryType: "create",
          data: {
            email: email,
            password: hashedPassword,
            emailVerified: true,
            profile: {
              create: {
                name: name,
                img: img,
                username: generateFromEmail(email, 6),
              },
            },
            accounts: {
              create: {
                provider: provider,
                access_token: access_token,
                refresh_token: nanoid(32),
                reset_token: nanoid(32),
              },
            },
          },
          select: {
            id: true,
            emailVerified: true,
            email: true,
          },
        });
        if (result.status) {
          return NextResponse.json(result);
        } else {
          return NextResponse.json(
            { message: result.message },
            { status: 200 }
          );
        }
      } else {
        return NextResponse.json(
          { message: "User and account already exist" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

const isUser = async ({ apiKey, email, provider }: any) => {
  const response = await callDynamicApi({
    model: "user",
    queryType: "findFirst",
    where: {
      email,
    },
    apiKey,
    select: {
      id: true,
      accounts: {
        where: {
          provider,
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!response?.result?.id) {
    return "create_user";
  } else if (!response?.result?.accounts?.length) {
    return "link_account";
  } else {
    return "nothing";
  }
};

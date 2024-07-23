export const userModelSchema = [
    {
        name: "Email",
        slug: "email",
        type: "emailInput",
        defaultValue: "",
        required: true,
        hidden: false,
        customClassName: ""
    },
      {
        name: "Password",
        slug: "password",
        type: "passwordInput",
        defaultValue: "",
        required: true,
        hidden: false,
        customClassName: ""
      }
]


export const profileModelSchema = [
    {
        name: "Name",
        slug: "name",
        type: "textInput",
        defaultValue: "",
        required: false,
        hidden: false,
        customClassName: ""
    },
    {
        name: "img",
        slug: "img",
        type: "fileInput",
        defaultValue: "",
        required: true,
        hidden: false,
        customClassName: ""
    },
]
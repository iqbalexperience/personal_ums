

export const prePath = "main"

export const allModels = [{
  name: "Field Test",
  model: "allFields",
  meta: {
    title: "name",
    description: "password",
  },
  fields: [
  {
    name: "Name",
    slug: "name",
    type: "textInput",
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
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Age",
    slug: "age",
    type: "numberInput",
    defaultValue: 0,
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Email",
    slug: "email",
    type: "emailInput",
    defaultValue: "",
    required: false,

    hidden: false,
    customClassName: ""
  },

  {
    name: "Phone Number",
    slug: "phone",
    type: "phoneInput",
    defaultValue: "",
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Text Area",
    slug: "content",
    type: "textareaInput",
    defaultValue: "",
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Date",
    slug: "date",
    type: "dateInput",
    defaultValue: new Date(),
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Switch",
    slug: "switch",
    type: "switchInput",
    defaultValue: true,
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    type: "checkboxInput",
    defaultValue: true,
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "Select",
    slug: "select",
    type: "selectInput",
    defaultValue: "1",
    options: ["1", "2", "3"],
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "Multi Select",
    slug: "multiSelect",
    type: "msSelectInput",
    defaultValue: ["1", "2"],
    options: ["1", "2", "3"],
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "Radio",
    slug: "radio",
    type: "radioInput",
    defaultValue: "1",
    options: ["1", "2", "3"],
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "Toogle",
    slug: "toogle",
    type: "toogleInput",
    defaultValue: "1",
    options: ["1", "2", "3"],
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "Multi Toogle",
    slug: "lists",
    type: "mstoogleInput",
    defaultValue: ["1", "3"],
    options: ["1", "2", "3"],
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "Markdown",
    slug: "markdown",
    type: "markdownInput",
    defaultValue: "",
    required: false,

    hidden: false,
    customClassName: ""
  },
  {
    name: "URL",
    slug: "url",
    type: "urlInput",
    defaultValue: "",
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "File",
    slug: "file",
    type: "fileInput",
    defaultValue: "",
    required: false,
    hidden: false,
    customClassName: ""
  },
  {
    name: "Redirect Button",
    slug: "redirectButton",
    type: "redirectButton",
    defaultValue: "https://google.com",
    required: false,
    hidden: false,
    redirectLink: "",
    customClassName: ""
  },
]}]


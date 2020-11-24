import inquirer from "inquirer"
import {DbConnection} from "./database.js";
import {createUser} from "./authentication.js";

// Connect to db
const db = new DbConnection()

const questions = [
    {type: 'input', name: 'username', message: "Username:"},
    {type: 'password', name: 'password', message: "Password:"}
]

inquirer.prompt(questions).then(answers => {
    console.log(`Adding user ${answers.username}...`)

    createUser(answers.username, answers.password, db)
        .then(() => console.log("Added user!"))
        .catch(e => console.error(e))
})

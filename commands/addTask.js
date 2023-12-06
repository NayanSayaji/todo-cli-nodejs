import inquirer from "inquirer";
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Todos from "../schema/TodoSchema.js";
import ora from "ora";
import chalk from "chalk";

async function input(){
    const answers = await inquirer.prompt([
        { name: 'name', message: 'Enter name of the task:', type: 'input' },
        { name: 'detail', message: 'Enter the details of the task:', type: 'input' },
    ])

    return answers
}
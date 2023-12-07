// Importing packages and functions
import inquirer from "inquirer";
import Todos from '../schema/TodoSchema.js'
import {connectDB, disconnectDB} from '../db/connectDB.js'
import ora from "ora";
import chalk from "chalk";



// we will define an asynchronous function called getTaskCode(). 
// The role of this function is to prompt the user to enter the code of the todo they want to delete using inquirer. 
// The function then trims the code entered by the user using the trim() method and returns the trimmed code. 
// The trimming process is necessary to remove the leading or trailing whitespace which the code might contain.

export async function getTaskCode(){
    try {
        // Prompting the user to enter the todo code
        const answers = await inquirer.prompt([
            {name: 'code', 'message': 'Enter the code of the todo: ', type: 'input'},
        ])

        // Trimming user's response so that the todo code does not contain any starting or trailing white spaces
        answers.code = answers.code.trim()

        return answers
    } catch (error) {
        console.log('Something went wrong...\n', error)
    }
}

// Now we will define the main function named deleteTask()
export default async function deleteTask(){
    try {
        // Obtaining the todo code provided by user
        const userCode = await getTaskCode()

        // Connecting to the database
        await connectDB()

        // Starting the spinner
        const spinner = ora('Finding and Deleting the todo...').start()

        // Deleting the task
        const response = await Todos.deleteOne({code: userCode.code})

        // Stopping the spinner
        spinner.stop()

        // Checking the delete operation
        if(response.deletedCount === 0){
            console.log(chalk.redBright('Could not find any todo matching the provided name. Deletion failed.'))
        } else {
            console.log(chalk.greenBright('Deleted Task Successfully'))
        }

        // Disconnecting from the database
        await disconnectDB()
    } catch (error) {
        // Error Handling
        console.log('Something went wrong, Error: ', error)
        process.exit(1)
    }
}


// Let's break down this code step-by-step:

// We obtain the response object which includes the todo code entered by the user by calling the getTaskCode() function defined above. We then assign this object to the userCode variable.
// We connect to the database using await connectDB().
// We start a spinner using ora to indicate that we're finding and deleting the todo.
// We use Todos.deleteOne({ code: userCode.code }) to search for and delete the todo with a matching code. The response will indicate if any document was deleted or not.
// After the operation is complete, we stop the spinner using spinner.stop().
// We use an if...else condition to check the deletedCount property in the response. If it's 0, we print a message indicating that the task with the provided code wasn't found and deletion failed. If deletedCount is greater than 0, we print a success message.
// We disconnect from the database using await disconnectDB().
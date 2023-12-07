import inquirer from "inquirer";
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Todos from "../schema/TodoSchema.js";
import ora from "ora";
import chalk from "chalk";


// create an asynchronous function called input() to gather the task's name and details from the user.
async function input(){
    const answers = await inquirer.prompt([
        { name: 'name', message: 'Enter name of the task:', type: 'input' },
        { name: 'detail', message: 'Enter the details of the task:', type: 'input' },
    ]);

    return answers;
}

// input() uses inquirer to ask the user for the task's name and details. The answers are then returned as an object.

// inquirer.prompt() It's a method in the inquirer package that asks questions and waits for responses.
// You provide an array of question objects, each containing details like the message to display to the user 
// and the type of question. The function returns a Promise, so we use await to wait for the user's answers 
// which get's returned as an object.


// To see how the above code works, you can add these 2 lines of code
// const output = await input()
// console.log(output)



// what if someone wants to add many tasks quickly? Doing it one by one isn't cool. There are two issues:

// If you have, say, 5 tasks in your mind, you'd have to type the create command 5 times—one for each task.
// After entering task details, you wait a bit because saving stuff to the database can take time, especially if the internet is slow.
// These problems aren't fun at all! To fix this, we need a way to add multiple tasks in one go. Here's how we'll do it:

// Now, let's create a function named askQuestions() to gather multiple tasks. This is how it looks:

const askQuestions = async() => {

    const todoArray = []
    let loop = false

    do{
        const userRes = await input()
        todoArray.push(userRes)
        const confirmQ = await inquirer.prompt([{ name: 'confirm', message: 'Do you want to add more tasks?', type: 'confirm' }])
        if(confirmQ.confirm){
            loop = true
        } else {
            loop = false
        }
    } while(loop)

    return todoArray
}

// In askQuestions(), we set up a loop that keeps asking for tasks until the user decides to stop. 
// We gather each task from the user by calling the input() function, and the returned user's response 
// gets pushed to the todoArray.
// const output = await askQuestions()
// console.log(output)



export default async function addTask() {
    try {
        // calling askQuestions() to get array of todo's
        const userResponse = await askQuestions()

        // connecting to the database
        await connectDB()

        // Displaying a spinner with the following text message using ora 
        let spinner = ora('Creating the todos...').start()

        // looping over every todo in the userResponse array
        // and saving each todo in the database
        for(let i=0; i<userResponse.length; i++){
            const response = userResponse[i]
            await Todos.create(response)
        }

        // Stopping the spinner and displaying the success message
        spinner.stop()
        console.log(
            chalk.greenBright('Created the todos!')
        )

        // disconnecting the database
        await disconnectDB()
    } catch (error) {
        // Error Handling
        console.log('Something went wrong, Error: ', error)
        process.exit(1)
    }
}

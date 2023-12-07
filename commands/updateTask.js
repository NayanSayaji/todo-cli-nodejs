// Importing packages and functions;
import {connectDB, disconnectDB} from '../db/connectDB.js';
import { getTaskCode } from './deleteTask.js';
import inquirer from 'inquirer';
import Todos from '../schema/TodoSchema.js';
import ora from 'ora';
import chalk from 'chalk';

// Before we start working on our updateTask() function, we will create a small function in the same file 
// named askUpdateQ(). The role of this function is to prompt the user to enter the updated values of the 
// task like the task name, description, and status. At the end, this function will return the response object.

async function askUpdateQ(todo){
    try {
        // Prompting the user to update the todo data
        const update = await inquirer.prompt([
            {name: 'name', message: 'Update the name?', type: 'input', default: todo.name},
            {name: 'detail', message: 'Update the Description?', type: 'input', default: todo.detail},
            {name: 'status', message: 'Update the status', type: 'list', choices: ['pending', 'completed'], default: todo.status}
        ])

        return update
    } catch (error) {
        console.log('Something went wrong... \n', error)
    }
}

// Two things are to be noted here:

// todo is the original task object (the task which the user wants to update). This will be passed to the askUpdateQ() function by the updateTask() function.
// Each question object within the array passed to inquirer.prompt() contains a default property set to the original values of the task. This ensures that if the user skips a question, the default value remains unchanged.


export default async function updateTask(){
    try {
        // Obtaining the task code entered by user by calling getTaskCode() method
        const userCode = await getTaskCode()

        // Connecting to the database
        await connectDB()

        // Starting the spinner
        const spinner = ora('Finding the todo...').start()

        // Finding the todo which the user wants to update
        const todo = await Todos.findOne({code: userCode.code})

        // Stopping the spinner
        spinner.stop()

        // Checking if the todo exists or not
        if(!todo){
            console.log(chalk.redBright('Could not find a Todo with the code you provided.'))
        } else{
            console.log(chalk.blueBright('Type the updated properties. Press Enter if you don\'t want to update the data.'))

            // Get the user's response of the updated data by calling askUpdateQ() method
            const update = await askUpdateQ(todo)

            // If user marked status as completed, we delete the todo else we update the data
            if(update.status === 'completed'){
                // Changing spinner text and starting it again
                spinner.text = 'Deleting the todo...'
                spinner.start()

                // Deleting the todo
                await Todos.deleteOne({_id : todo._id})

                // Stopping the spinner and display the success message
                spinner.stop()
                console.log(chalk.greenBright('Deleted the todo.'))
            } else {
                // Update the todo
                spinner.text = 'Updating the todo'
                spinner.start()
                await Todos.updateOne({_id: todo._id}, update, {runValidators: true})
                spinner.stop()
                console.log(chalk.greenBright('Updated the todo.'))
            }
        }
        // Disconnecting from the database
        await disconnectDB()
    } catch (error) {
        // Error Handling
        console.log('Something went wrong, Error: ', error)
        process.exit(1)
    }
}

// Here's a breakdown of the above code:

// Obtain the code of the task which the user wants to update. For this, we are utilizing the getTaskCode() function defined in the ./commands/deleteTask.js file. We simply call the function and assign the returned response object to the userCode variable.
// Connect to the database using await connectDB().
// Start a spinner to indicate that the code is finding the todo.
// Use Todos.findOne({ code: userCode.code }) to find the task the user wants to update and assign it to the todo variable. We are doing this because we will need the original values of the task.
// Stop the spinner.
// If no matching task is found, display a message using chalk indicating that the task wasn't found.
// If the task is found, prompt the user to input updated properties by calling the askUpdateQ() function and pass the todo object (original task) in the function. Assign the returned object to update variable.
// If the user marks the status as "completed," the task is deleted from the database using deleteOne(). If marked as "pending," the task's name and description are updated using updateOne().

// updateOne() method takes in 3 parameters – Query Object, Update Object, and the Options object. Here, {_id: todo._id} is the Query Object. Mongoose searches the entire collection for a task whose id property matches with todo_.id. On finding the task, it replaces the task with the update object, that is update in our case. The third parameter, { runValidators: true }, ensures that Mongoose validates the update object against the schema's rules before executing it. If the validation fails, the update will be rejected, and you'll receive an error. If the validation is successful, the document will be updated successfully in the database.

// Both in case of the Delete and Update Operation, we change the text of the spinner using spinner.text and start it before performing the operation and once the operation is completed, we stop the spinner.
// Display appropriate success messages in the console based on the operation performed.
// Disconnect from the database using await disconnectDB().
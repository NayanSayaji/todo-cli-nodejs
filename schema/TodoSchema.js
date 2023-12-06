import mongoose from "mongoose"; // mongoose.Schema() method to create our Schema.
import { nanoid } from "nanoid"; //nanoid to make short and unique IDs for each task.

const TodoSchema = new mongoose.Schema(
  {
    // name: This is a short title for the task.
    name: {
      type: String,
      required: true, // required: true specifies that we have to provide this when creating a task 
      trim: true, // trim: true specifies that any extra spaces at the beginning or at the end of the task's name will be removed before saving it in the database.
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["completed", "pending"], // status: This shows if the task is done or not. The enum: ['completed', 'pending']
      default: "pending", // default: 'pending' property specifies that if you do not 
                          // set the status property while creating the task, it is assumed to be pending.
      trim: true,
    },
    code: {
      //code: This is a short and unique ID for the task
      type: String,
      required: true,
      default: "code",
      trim: true,
    },
  },
  { timestamps: true }
);


TodoSchema.pre('save', function(next){
    this.code = nanoid(10)
    next()
});
/*
->  TodoSchema.pre('save', function(){....}) helps us defining a pre-save hook/function which runs every time 
    before a task gets saved in the database.

    Inside the function, we use nanoid(10) to create a unique, 10 character long ID for the task and put this 
    generated id in the code field of the task (we can actually access any property/field of the task using the 
    this keyword).

    next() basically tells the computer that we are done and it can finally save the document now. With this, 
    we generate a unique ID for every single task created using the nanoid package.
    */


// Todos model using this TodoSchema blueprint and export it. This is how:
const Todos = mongoose.model('Todos', TodoSchema)
export default Todos
//express for providing api servises for beggineers


//using express
const express =require('express');

const mongoose = require('mongoose');
const cors =require('cors')


//Define an instance of express
const app = express();
///use middle ware for teach this is json data so
app.use(express.json())
app.use(cors())


//connect mongoose
mongoose.connect('mongodb://localhost:27017/todoDB')
.then(()=>{
    console.log('DB connected!')
})
.catch((err)=>{
    console.log(err)

})

//create schema
const todoschema = new mongoose.Schema({
    title:{
        required: true,
        type:String
    },
    description:String
})

//creating model
const todomodel = mongoose.model('Todo',todoschema);


//create a new todo item
app.post('/todos',async (req,res) =>{
    const {title,description} = req.body;


    //ithu asinkuranice operation athu nalla saftyku try case
    try {
        const newTodo =new todomodel({title,description});
        await newTodo.save();
        //201 code is not random code its work some perpous
        res.status(201).json(newTodo);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
        
    }

});

//get all items
app.get('/todos',async (req,res) =>{
    try {
        const todos = await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
    
})

//update a todo item and one more think id is a parameter
app.put("/todos/:id" ,async (req,res)=>{
    try {
        const {title,description} = req.body;
    const id = req.params.id;
    const updatedTodo = await todomodel.findByIdAndUpdate(
        id,
        { title , description},
        { new:true}
    )
    if(!updatedTodo){
        return res.status(404).json({message:"Todo not found"})
    }
    res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
    

})

//delete a todo item
app.delete("/todos/:id",async (req,res) =>{
    try {
        const id = req.params.id;
    await todomodel.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
    

})



//Start the server
const port = 786;
app.listen(port,() =>{
    console.log("Server is listening to port"+port);
})
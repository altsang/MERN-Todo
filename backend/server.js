const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = 4000;

let Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://mern-todo-mongo:27017/mern-todo", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

todoRoutes.route("/").get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    if (err) {
      console.log(err);
    } else {
      res.json(todo);
    }
  });
});

todoRoutes.route("/add").post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save((err, todo) => {
    if (err) {
      console.log(err);
      res.status(400).send("adding new todo failed");
    } else {
      res.status(200).json({ todo: "todo added successfully" });
    }
  });
});

todoRoutes.route("/update/:id").put(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo)
      res.status(404).send("data is not found");
    else {
      console.log("Received update for Todo ID:", req.params.id);
      console.log("Update data:", req.body);
      todo.todoDesc = req.body.todoDesc;
      todo.todoResponsible = req.body.todoResponsible;
      todo.todoPriority = req.body.todoPriority;
      todo.todoCompleted = req.body.todoCompleted === 'true' || req.body.todoCompleted === true;

      todo.save().then(todo => {
        console.log('Todo updated in database:', todo);
        // Additional logging to confirm the updated state of the todo item
        console.log('Updated todo item:', {
          id: todo._id,
          description: todo.todoDesc,
          responsible: todo.todoResponsible,
          priority: todo.todoPriority,
          completed: todo.todoCompleted
        });
        res.json(todo); // Send back the updated todo item
      })
      .catch(err => {
        console.log('Error updating todo:', err);
        res.status(400).send("Update not possible");
      });
    }
  });
});

todoRoutes.route("/delete/:id").delete((req, res) => {
  Todo.findByIdAndDelete(req.params.id)
    .then(() => res.json('Todo deleted.'))
    .catch(err => res.status(400).send('Delete not possible'));
});

app.use("/todos", todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = process.env.PORT || 5473;

let Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://172.17.0.2:27017/todos", { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("mongoDB connection successful");
});

todoRoutes.route("/").get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      // Ensure all todos have the necessary fields
      const sanitizedTodos = todos.map(todo => ({
        _id: todo._id,
        description: todo.todoDesc || "",
        responsible: todo.todoResponsible || "",
        priority: todo.todoPriority || "",
        completed: todo.todoCompleted || false,
        __v: todo.__v
      }));
      res.json(sanitizedTodos);
    }
  });
});

todoRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    if (err) {
      console.log(err);
    } else {
      // Ensure the todo has the necessary fields
      const sanitizedTodo = {
        _id: todo._id,
        description: todo.todoDesc || "",
        responsible: todo.todoResponsible || "",
        priority: todo.todoPriority || "",
        completed: todo.todoCompleted || false,
        __v: todo.__v
      };
      res.json(sanitizedTodo);
    }
  });
});

todoRoutes.route("/add").post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save((err, todo) => {
    if (err) {
      console.log(err);
      res.status(400).send("adding todo failed");
    } else {
      res.status(200).json({ todo: "todo added successfully" });
    }
  });
});

todoRoutes.route("/delete/:id").post(function(req, res) {
  Todo.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      console.log(err);
      res.status(400).send("deleting todo failed");
    } else {
      res.status(200).json({ todo: "todo deleted successfully" });
    }
  });
});

todoRoutes.route("/update/:id").post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) {
      res.status(404).send("todo not found");
    } else {
      todo.todoDesc = req.body.description;
      todo.todoResponsible = req.body.responsible;
      todo.todoPriority = req.body.priority;
      todo.todoCompleted = req.body.completed;
      todo.save().then(todo => {
        res.json('Todo updated!');
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
    }
  });
});

app.use("/todos", todoRoutes);

app.listen(PORT, '0.0.0.0', function() {
  console.log("Server running on PORT: " + PORT);
});

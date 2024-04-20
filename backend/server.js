const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = process.env.PORT || 5000;

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
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;
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

app.listen(PORT, function() {
  console.log("Server running on PORT: " + PORT);
});

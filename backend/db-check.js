const mongoose = require('mongoose');
const Todo = require('./todo.model');

// MongoDB connection string
const mongoURI = 'mongodb://172.17.0.2:27017/todos';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', function() {
  console.log('Connected to the Database.');

  Todo.findById('66235e49a6125c07bf23713d', function(err, todo) {
    if (err) {
      console.log('Error finding Todo:', err);
    } else {
      console.log('Todo:', todo);
    }
    mongoose.connection.close();
  });
});

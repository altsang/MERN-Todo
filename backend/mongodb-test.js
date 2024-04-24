const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URL || 'mongodb://mongodb-service:27017/todos';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful'))
  .catch(err => console.error('Connection to MongoDB failed', err));

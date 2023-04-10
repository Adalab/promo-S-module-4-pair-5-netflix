const mongoose = require('mongoose');

const dbConnect = () => {
  const user = 'netflix';
  const pass = 'EdBbSPRssPi7z7Wq';
  const dbName = 'Netflix';

  const uri = `mongodb+srv://${user}:${pass}@cluster0.48fvfpt.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('conectado a mongodb'))
    .catch((e) => console.log('error de conexión', e));
};
module.exports = dbConnect;
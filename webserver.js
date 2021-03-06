const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/callback', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(4000);
app.addListener('error',(err)=>{
  console.log(err);
});
console.log("Genrify server started.")
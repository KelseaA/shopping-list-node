var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.put = function(name, id){
  var changed = false;
  var changedIndex;
    for(var i = 0; i < this.items.length; i++){
        if(id == this.items[i].id){
            this.items[i].name = name;
            changed = true;
            changedIndex = this.items[i];
        }
    }
    if(!changed){
        return this.add(name);
    }
  return changedIndex;
};

Storage.prototype.remove = function(id){
  var index;
    for(var i = 0; i < this.items.length; i++){
        if(id == this.items[i].id){
            index = i;
        }
    }
  if(!index){
    return false; 
  } 
  return this.items.splice(index, 1);
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
  res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  var item = storage.add(req.body.name);
  res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  var item = storage.put(req.body.name, req.params.id);
  res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
  var item = storage.remove(req.params.id);
  if (item) {
    res.status(200).json(item);
  } else {
    res.status(400).json({"error": "no item found"});
  }
});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;
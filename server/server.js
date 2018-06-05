var express = require("express");
var bodyParser = require("body-parser");
var { ObjectID } = require("mongodb");

var { Todo } = require("./models/todo");
var { User } = require("./models/user");
var { mongoose } = require("./db/mongoose");

var app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then( doc => {
        res.send(doc);
    }, e => {
        res.status(400).send();
    });
});

app.get("/todos", (req, res) => {
    Todo.find().then( todos => {
        res.send({todos});
    }, e => {
        res.status(404).send();
    });
});

app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({error: "Id is not valid."});
    }

    Todo.findById(id).then( todo => {

        if (!todo) {
            return res.status(404).send({error: "Todo not found."});
        }

        res.send({todo});
    }, e => {
        res.status(404).send();
    });
});

app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({error: "Id is not valid"});
    }

    Todo.findByIdAndRemove(id).then( todo => {

        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }, e => {
        res.status(404).send();
    });
});

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});

module.exports = { app };
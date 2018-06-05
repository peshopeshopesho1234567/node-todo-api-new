const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

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

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body =_.pick(req.body, ["text", "completed"]);
    console.log(body);

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then( todo => {
        if (!todo) {
            return res.status(404).send();
        }
        console.log(todo);
        res.send({todo});
    }).catch( e => res.status(400).send());
});

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});

module.exports = { app };
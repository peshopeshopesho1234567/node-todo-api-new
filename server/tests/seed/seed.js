const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: "grigor.penev@verint.com",
        password: "Hasanmiumiun123",
        tokens: [
            {
                access: "auth",
                token: jwt.sign({ _id: userOneId, access: "auth"}, "abc123").toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: "gen@example.com",
        password: "userTwoPass",
        tokens: [
            {
                access: "auth",
                token: jwt.sign({ _id: userTwoId, access: "auth"}, "abc123").toString()
            }
        ]
    }
];

const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo",
        _creator: userOneId
    }, {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 777,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]).then(() => done());
    });
};

module.exports = { todos, populateTodos, users, populateUsers };
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGODB_CONNECTION_URL)

const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    lists: Array,
})
const UserModel = mongoose.model("ToDoList", UserSchema)

app.get("/login", async (request, response) => {
    console.log(request.query)

    UserModel.find({ email: request.query.email })
        .then((res) => {
            console.log(res)
            if (res.length > 0) {
                console.log(res[0])
                res[0].password == request.query.password
                    ? response.send(res[0])
                    : response.send({ message: "Incorrect password" })
            } else {
                response.send({ message: "email is not registered" })
            }
        })
        .catch((error) => response.send(error))
})

app.post("/register", async (request, response) => {
    console.log(request.body)
    const data = request.body
    console.log(data.username, data.email, data.password, Array())
    UserModel.create({
        username: data.username,
        email: data.email,
        password: data.password,
        lists: Array(),
    })
        .then(response.send("registered!"))
        .catch((error) => response.send(error))
})

app.patch("/logout/:email", async (request, response) => {
    const filter = { email: request.params.email }
    const update = { lists: request.body.lists }
    console.log(filter, update)
    UserModel.findOneAndUpdate(filter, update)
        .then((res) => console.log(res))
        .catch((error) => console.log(error))
    response.send("loged out")
})

app.listen(process.env.PORT || 8000, () =>
    console.log(`App available on http://localhost:8000`)
)

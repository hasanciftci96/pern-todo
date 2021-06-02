const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db") //asagidaki pool.query database'imize bagliyor kodumuzu

//process.env --- below is everthing needed for heroku deployment until the comment with middleware
const path = require("path")
const PORT = process.env.PORT || 5000
//process.env.Node_ENV => production or undefined

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))
  //Or you can do this by just saying (outside the if statement) as app.use(express.static("./client/build")) because remember index.js's relative path to the build folder is like that
}

//middleware
app.use(cors())
app.use(express.json())

//Routes// mutlaka postman'i acip paralel bir sekilde incele
//postman url for get all = http://localhost:5000/todos

//create a todo
app.post("/todos", async (req, res, next) => {
  //request respond
  try {
    //ikinci arguman [description] musterinin yolladigi json objesindeki description key'sinin valuesini placeholder olan $1'in yerine koy demek
    const { description } = req.body //just basic destructuring to get the value of description, daha fazla ilgi icin put'daki comment'i oku
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *", //VALUES($1) is a placeholder for this description
      [description] //RETURNING * is used whenever we are inserting data, updating or deleting data
      //It returns the data, send a post in postman with and without returning to see the difference
    )

    res.json(newTodo.rows[0]) //because we dont want to see all the other useless things in the json data of 200 status response
  } catch (err) {
    console.log(err.message)
  }
}) //galiba herif description'i second argument olarak gecirerek description json key'si ile table'daki description column'unu sync ediyor

//get all todos

app.get("/todos", async (req, res, next) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo")
    res.json(allTodos.rows)
  } catch (err) {
    console.log(err.message)
  }
})

//get a todo

app.get("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
    res.json(todo.rows[0])
  } catch (err) {
    console.log(err.message)
  }
})

//update a todo

app.put("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { description } = req.body
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2", //unutma "" icindeki description ve todo_id table'imizda column isimleri
      [description, id]
    ) // burda $1 arrayde ilk sirada description oldugu icin description ile eslesiyor ve $2 array'de ikinci sirada id oldugu icin id ile eslesiyor
    res.json(req.body.description)
  } catch (err) {
    console.log(err.message)
  }
})

//delete a todo

app.delete("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ])
    res.json(`element with id: ${id} was deleted`)
  } catch (err) {
    console.log(err.message)
  }
})

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"))
})

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`)
})

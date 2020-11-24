import app from "./express.js"
import {login} from "./authentication.js";
import {DbConnection} from "./database.js";

const PORT = 8000

// Login page
app.post('/login', login)

// Connect to db
const db = new DbConnection()
db.getDb().then(() => {
    console.log("Connected to db")})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
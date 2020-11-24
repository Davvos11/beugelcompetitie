import app from "./express.js"
import {login} from "./authentication.js";
import {DbConnection} from "./database.js";
import {getLeaderboard} from "./leaderboard.js";

const PORT = 8000

// Connect to db
const db = new DbConnection()

// Login page
app.post('/login', ((req, res) => login(req, res, db)))

// Get leaderboard
app.get('/leaderboard', ((req, res) => getLeaderboard(req, res, db)))

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})
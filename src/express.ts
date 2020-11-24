import express from "express"
import morgan from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import path from "path"
import cookieParser from 'cookie-parser'
import session from 'express-session'
import crypto from 'crypto'

// Settings
const SESSION_KEY_NAME = 'user_sid'
const SESSION_EXPIRY = 600000

// Initialise Express
const app = express()

// Add logging
app.use(morgan('dev'));
// Add cors
app.use(cors());
// Add body-parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Add cookie parser
app.use(cookieParser())

// Add session management
app.use(session({
    name: SESSION_KEY_NAME,
    secret: crypto.randomBytes(20).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESSION_EXPIRY
    }
}));

// Check if the user still has a session cookie but is not set as logged in (happens after a server restart)
app.use((req, res, next) => {
    if (req.cookies[SESSION_KEY_NAME] && !req.session.username) {
        res.clearCookie(SESSION_KEY_NAME);
    }
    next();
});

// middleware function to check for logged-in users
export const sessionChecker = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.username && req.cookies[SESSION_KEY_NAME]) {
        // If the user is logged in, continue
        next()
    } else {
        // Otherwise return unauthorised
        res.status(401).send("Please login first")
    }
};

// Serve the static files from the React app
app.use(express.static(path.join(path.dirname('..'), 'client/build')));

export default app;
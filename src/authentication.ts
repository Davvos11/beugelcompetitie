import express from "express"
import crypto from "crypto"
import random from "random"
import {DbConnection} from "./database.js";

const SALT_LENGTH = 20
const HASH_ITERATION_RANGE = [1000, 100000]
const HASH_ALGORITHM = 'md5'

/**
 * POST function to authenticate a user and create a session
 * @param req
 * @param res
 * @param db
 */
export async function login(req: express.Request, res: express.Response, db: DbConnection) {
    const username = req.body.username
    const password = req.body.password

    if (username === undefined || password === undefined) {
        return res.status(400).send("Please provide a username and password")
    }

    if (await authenticateUser(username, password, db)) {
        // If secret is correct, add session
        req.session.username = username
        return res.send(204)
    } else {
        return res.status(401).send("Authentication failed")
    }
}

export async function createUser(username: string, password: string, db: DbConnection) {
    const generatedHash = generateHash(password)
    return db.addUser(username, generatedHash.hash, generatedHash.iterations, generatedHash.salt)
}

async function authenticateUser(username: string, password: string, db: DbConnection) {
    // Get information from database
    const cr = await db.getCredentials(username)
    // Hash the provided password
    const hashed = hash(password, cr.salt, cr.iterations)

    // Check if the hashed provided password matches the hashed password from the database
    return hashed === cr.password;
}

/**
 * Generate salt, amount of iterations and a hash (using the salt and iterations) for the provided text
 * @param password the text to hash
 */
function generateHash(password: string) {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex')
    const iterations = random.int(HASH_ITERATION_RANGE[0], HASH_ITERATION_RANGE[1])

    return {input: password, hash: hash(password, salt, iterations), salt, iterations}
}

/**
 * Hash the provided text + salt n times
 * @param text the text to hash
 * @param salt the salt to add
 * @param iterations the amount of times to hash
 */
function hash(text: string, salt: string, iterations: number) {
    let hashedString = salt + text
    for (let i = 0; i < iterations; i++) {
        hashedString = crypto.createHash(HASH_ALGORITHM).update(hashedString).digest('hex');
    }
    return hashedString
}
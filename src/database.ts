import sqlite3 from "sqlite3"
import {Database, open} from 'sqlite'
import path from "path";
import util from "util";
import fs from "fs";
import {ISqlite} from "sqlite/build/interfaces";

sqlite3.verbose();

// Database location
const DB_LOCATION = path.join(path.dirname('..'), 'database.db')
const SQL_SCRIPT_LOCATION = path.join(path.dirname('..'), 'create-tables.sql')

const readFile = util.promisify(fs.readFile);

export type sortOptions = "time" | "timestamp" | "name"

export class DbConnection {
    private db: Database | undefined;
    private dbLocation: string;

    constructor(location: string = DB_LOCATION) {
        this.dbLocation = location
    }

    private static async openDb () {
        return open({
            filename: DB_LOCATION,
            driver: sqlite3.Database
        })
    }

    private async createTables() {
        const db = await this.getDb()
        // Read create-tables.sql and execute it
        return db.exec(await readFile(SQL_SCRIPT_LOCATION, 'utf8'))
    }

    /**
     * Get the db object, or connect to it and (if needed) create tables if it is undefined
     */
    async getDb() {
        if (this.db === undefined) {
            // Connect to database
            this.db = await DbConnection.openDb()
            // Create tables
            await this.createTables()
        }
        return this.db
    }

    async addUser(username: string, password: string, iterations: number, serverSalt: string) {
        const db = await this.getDb()
        return db.run("INSERT INTO users VALUES (?, ?, ?, ?)",
            username, password, iterations, serverSalt)
    }

    async getCredentials(username: string) {
        const db = await this.getDb()
        const query = db.get("SELECT password, hash_iterations, server_salt FROM users WHERE username = ?", username)

        return query.then(r => {
            return {password: r.password, iterations: r.hash_iterations, salt: r.server_salt}})
    }

    async getTimes(maxAmount?: number, names?: string[], fromTime?: number, toTime?: number,
                   sortBy: sortOptions = "name", sortDescending = false) {
        const db = await this.getDb()
        let query = "SELECT * FROM leaderboard"
        const args = []

        // Add filters
        if (names) {
            // Add condition to query to filter on names
            query = filterQuery(query, `name in (${names.map(() => '?')})`)
            // Add names to argument list
            names.forEach(n => args.push(n))
        }
        if (fromTime) {
            query = filterQuery(query, "timestamp >= ?")
            args.push(fromTime)
        }
        if (toTime) {
            query = filterQuery(query, "timestamp <= ?")
            args.push(toTime)
        }

        // Add sorting
        query += ` ORDER BY ${sortBy} COLLATE NOCASE ${sortDescending ? 'DESC' : 'ASC'}`

        // Add amount limit
        if (maxAmount && maxAmount >= 0) {
            query += " LIMIT ?"
            args.push(maxAmount)
        }

        // Return mapped result
        return db.all(query, args).then(rs => {
            return rs.map(r => {
                return {name: r.name, timestamp: r.timestamp, time: r.time, decimals: r.decimals}
            })
        })
    }

    async addTime(name: string, timestamp: number, time: number, decimals?: number) {
        const db = await this.getDb()
        return db.run("INSERT INTO leaderboard VALUES (?, ?, ?, ?)",
            name, timestamp, time, decimals)
    }
}

/**
 * Adds "AND condition" or "WHERE condition" to the end of an sql query.
 * THIS IS VERY BEUN, IT WON'T WORK IF YOU HAVE MULTIPLE WHERE STATEMENTS IN A QUERY
 * @private
 */
function filterQuery(query: ISqlite.SqlType, condition: string) {
    if (query.toString().toLowerCase().includes(" where ")) {
        return `${query.toString()} AND ${condition}`
    } else {
        return `${query.toString()} WHERE ${condition}`
    }
}
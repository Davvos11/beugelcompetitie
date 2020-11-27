import express from "express";
import {DbConnection, sortOptions} from "./database.js";

export async function getLeaderboard(req: express.Request, res: express.Response, db: DbConnection) {
    const maxAmount = (req.query.amount ? Number(req.query.amount) : undefined)
    const names = (req.query.names ? req.query.names.toString().split(',') : undefined)
    const fromTime = (req.query.from ? Number(req.query.from) : undefined)
    const toTime = (req.query.to ? Number(req.query.to) : undefined)
    const sortBy = req.query.sort_by as sortOptions
    const sortDesc = req.query.sort_descending !== 'false'
    const onlyHighScore = req.query.only_highscore !== 'false'

    // Validate provided variables
    if (maxAmount && (isNaN(maxAmount) || maxAmount < 0 || !Number.isInteger(maxAmount))) {
        return res.status(400).send("'amount' should be a positive integer")
    } else if (fromTime && isNaN(fromTime)) {
        return res.status(400).send("Please provide a valid timestamp for 'from'")
    } else if (toTime && isNaN(toTime)) {
        return res.status(400).send("Please provide a valid timestamp for 'to'")
    }

    try {
        // Retrieve results and send
        const results = await db.getTimes(maxAmount, names, fromTime, toTime, sortBy, sortDesc, onlyHighScore)
        return res.send(results)
    } catch (e) {
        return res.status(500).send("Error retrieving the leaderboard")
    }
}

export async function addToLeaderboard(req: express.Request, res: express.Response, db: DbConnection) {
    const name = req.body.name
    const time = Number(req.body.time)
    let decimals = Number(req.body.decimals)
    let timestamp = req.body.timestamp

    // Validate provided variables
    if (name === undefined || name.trim() === "") {
        return res.status(400).send("Please provide a valid name")
    } else if (isNaN(time) || time <= 0) {
        return res.status(400).send("Please provide time as a positive number")
    }
    if (isNaN(decimals)) {
        // Count the decimals if they are not provided
        decimals = countDecimals(time)
    } else if (decimals < 0 || Number.isInteger(decimals)) {
        return res.status(400).send("Please provide decimals as a positive integer")
    }
    if (isNaN(timestamp)) {
        // Set the timestamp to the current timestamp if it is not provided
        timestamp = Date.now()
    }

    try {
        // Update db and send
        await db.addTime(name, timestamp, time, decimals)
        return res.sendStatus(204)
    } catch (e) {
        return res.status(500).send("Error updating the leaderboard")
    }
}

function countDecimals(value: number) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
}
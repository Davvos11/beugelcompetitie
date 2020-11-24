import express from "express";
import {DbConnection} from "./database.js";

export async function getLeaderboard(req: express.Request, res: express.Response, db: DbConnection) {
    const maxAmount = Number(req.query.amount)
    const names = (req.query.names ? req.query.names.toString().split(',') : undefined)
    const fromTime = Number(req.query.from)
    const toTime = Number(req.query.to)

    const results = await db.getTimes(maxAmount, names, fromTime, toTime)

    return res.send("")
}
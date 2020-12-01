import fetch from 'node-fetch'
import {dateRangeType} from "./GraphSettings";

const LOGIN_URL = '/login'
const LEADERBOARD_URL = '/leaderboard'
const USER_COOKIE = 'user_sid'

export type sortType = "name"|"time"|"timestamp"

function createUrl(path: string, params: {[index: string]: any}) {
    const url = new URL(path, new URL(window.location.href).origin)
    // Add parameters to URL
    Object.keys(params).forEach((key: any) => url.searchParams.append(key, params[key]))

    return url
}

export async function getLeaderboard(sortBy: sortType = "time", descending = true) {
    const url = createUrl(LEADERBOARD_URL, {sort_by: sortBy, sort_descending: descending})

    return fetch(url, {
        method: "GET"
    }).then(async r => {
        if (r.ok) {
            return r.json()
        } else {
            throw Error(await r.text())
        }
    })
}

export async function getAllTimes(sortBy: sortType = "timestamp", descending = true, names?: string[], dateRange?: dateRangeType) {
    const url = createUrl(LEADERBOARD_URL, {
        sort_by: sortBy,
        sort_descending: descending,
        names: names ? names?.join(',') : '',
        only_highscore: false,
        from: dateRange ? dateRange?.from.getTime() : undefined,
        to: dateRange ? dateRange?.to.getTime() : undefined
    })

    return fetch(url, {
        method: "GET"
    }).then(async r => {
        if (r.ok) {
            return r.json()
        } else {
            throw Error(await r.text())
        }
    })
}

export async function addTime(name: string, time: number, timestamp?: number) {
    const url = new URL(LEADERBOARD_URL, new URL(window.location.href).origin)
    const body = {name, time, timestamp}

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
}

export async function login(username: string, password: string) {
    const url = new URL(LOGIN_URL, new URL(window.location.href).origin)
    const body = {username, password}

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
}

export function isLoggedIn() {
    return Boolean(document.cookie.match(/^(.*;)?\s*/+USER_COOKIE+/\s*=\s*[^;]+(.*)?$/))
}
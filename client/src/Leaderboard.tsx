import React from "react";
import {dataType} from "./App";

type sortBy = "name"|"time"|"timestamp"
type propType = { sortBy: sortBy, descending: boolean, data: dataType}

export class Leaderboard extends React.Component<propType, {}> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
    }

    render() {
        return <table id="leaderboard" className="table">
            <thead>
                <tr>
                    <th>Naam</th>
                    <th>Tijd</th>
                    <th>Datum</th>
                </tr>
            </thead>
            <tbody>
            {this.props.data.map((entry, i) => {
                return <LeaderboardEntry name={entry.name} time={entry.time} timestamp={entry.timestamp} key={i} />
            })}
            </tbody>
        </table>;
    }
}

function timestampToDate(timestamp: number) {
    return new Date(timestamp).toLocaleString('en-NL',
        {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"})
}

class LeaderboardEntry extends React.Component<{name: string, timestamp: number, time: number}, {}>{
    render() {
        return <tr>
            <td>{this.props.name}</td>
            <td>{this.props.time}</td>
            <td>{timestampToDate(this.props.timestamp)}</td>
        </tr>;
    }
}
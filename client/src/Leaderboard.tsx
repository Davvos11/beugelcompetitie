import React from "react";
import {getLeaderboard} from "./api";

type sortBy = "name"|"time"|"timestamp"

export class Leaderboard extends React.Component<{sortBy: sortBy, descending: boolean},{data: {name: string, timestamp: number, time: number}[]}> {
    constructor(props: { sortBy: sortBy; descending: boolean; } | Readonly<{ sortBy: sortBy; descending: boolean; }>) {
        super(props);
        this.state = {
            data: []
        };
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
            {this.state.data.map((entry, i) => {
                return <LeaderboardEntry name={entry.name} time={entry.time} timestamp={entry.timestamp} key={i} />
            })}
            </tbody>
        </table>;
    }

    componentDidMount() {
        getLeaderboard(this.props.sortBy, this.props.descending).then(r => {
            this.setState({data: r})
        })
    }
}

function timestampToDate(timestamp: number) {
    return new Date(timestamp).toLocaleString()
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
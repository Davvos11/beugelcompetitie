import React from "react";
import "tablesorter"
import $ from 'jquery'

export class Leaderboard extends React.Component<{}, {data: {name: string, timestamp: number, time: number}[]}> {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            data: [
                {name: "aaa",timestamp: 1606416064847,time: 5.8},
                {name: "test",timestamp: 1606414153475,time: 10.685},
                {name: "Dovat",timestamp: 1606414137579,time: 10.986}
            ]
        };
    }

    render() {
        return <table id="leaderboard" className="table tablesorter">
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
        const elem = $('#leaderboard')
        if (elem !== null)
            elem.tablesorter()
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
            <td data-sort={this.props.timestamp}>{timestampToDate(this.props.timestamp)}</td>
        </tr>;
    }
}
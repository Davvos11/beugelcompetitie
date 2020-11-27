import React from "react";
import {dataType} from "./App";
import {Button} from "react-bootstrap";
import {LeaderboardEntry} from "./LeaderboardEntry";

type sortBy = "name"|"time"|"timestamp"
type propType = { data: dataType[]}

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

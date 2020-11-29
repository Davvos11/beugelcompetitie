import React from "react";
import {dataType, sortBy} from "./App";
import {LeaderboardEntry} from "./LeaderboardEntry";
import {Button} from "react-bootstrap";

export type sortType = {sortBy: sortBy, sortDesc: boolean, onSortChange: (by: sortBy, desc: boolean)=>void} | false

type propType = { data: dataType[], clickable?: boolean, sort: sortType}
type stateType ={sortBy: sortBy, sortDesc: boolean}

export class Leaderboard extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        if (this.props.sort) {
            this.state = {
                sortBy: this.props.sort.sortBy,
                sortDesc: this.props.sort.sortDesc
            }
        } else {
            this.state = {
                sortBy: "time", sortDesc: false
            }
        }
    }

    changeSort = (by: sortBy) => {
        if (this.props.sort) {
            let desc
            // If we already sorted by this, change from descending to ascending (or vice versa)
            if (this.state.sortBy === by) {
                desc = !this.state.sortDesc
            } else {
                desc = false
            }
            // Change sortBy state
            this.setState({sortBy: by, sortDesc: desc})
            // Update parent
            this.props.sort.onSortChange(by, desc)
        }
    }

    sortButton = (title: string, value: sortBy) => {
        if (this.props.sort) {
            return <Button variant="link" onClick={() => this.changeSort(value)} style={{padding: 0, border: 0}}>
                {value === this.state.sortBy ? <b>{title}</b> : title}
            </Button>
        } else {
            return <span>{title}</span>
        }
    }

    render() {
        return <table id="leaderboard" className="table">
            <thead>
                <tr>
                    <th>{this.sortButton("Naam", "name")}</th>
                    <th>{this.sortButton("Tijd", "time")}</th>
                    <th>{this.sortButton("Datum", "timestamp")}</th>
                </tr>
            </thead>
            <tbody>
            {this.props.data.map((entry, i) => {
                return <LeaderboardEntry name={entry.name} time={entry.time}timestamp={entry.timestamp}
                                         key={i} clickable={this.props.clickable}/>
            })}
            </tbody>
        </table>;
    }
}

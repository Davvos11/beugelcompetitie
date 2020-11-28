import React from "react";
import {Button} from "react-bootstrap";
import {PersonalList} from "./PersonalList";

type propType = {name: string, timestamp: number, time: number}
type stateType = {overlay: JSX.Element | undefined}

export class LeaderboardEntry extends React.Component<propType, stateType>{
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            overlay: undefined
        }
    }

    render() {
        return <tr>
            <td><Button variant="link" onClick={() => this.showOverlay(this.props.name)} style={{padding: 0, border: 0}}>
                {this.props.name}</Button>
            </td>
            <td>{this.props.time}</td>
            <td>{timestampToDate(this.props.timestamp)}</td>
            <td>{this.state.overlay ? this.state.overlay : ''}</td>
        </tr>;
    }

    showOverlay = (name: string) => {
        this.setState({overlay: <PersonalList name={name} onClose={this.resetOverlay}/>})
    }

    resetOverlay = () => {
        this.setState({overlay: undefined})
    }
}

function timestampToDate(timestamp: number) {
    return new Date(timestamp).toLocaleString('en-NL',
        {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"})
}
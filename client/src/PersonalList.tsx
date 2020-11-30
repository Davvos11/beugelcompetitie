import React from "react";
import {getAllTimes, sortType} from "./api";
import {dataType} from "./App";
import {Button, Modal} from "react-bootstrap";
import {Leaderboard} from "./Leaderboard";

type propType = {name: string, onClose: ()=>void}
type stateType = {sortBy: sortType, sortDesc: boolean, data: dataType[], show: boolean}

export class PersonalList extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            sortBy: "timestamp", sortDesc: true, data: [], show: true
        }
    }

    close = () => {
        this.setState({show: false})
        this.props.onClose()
    }

    render() {
        return <Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>Tijden van {this.props.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Leaderboard data={this.state.data} sort={false}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.close}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    }

    componentDidMount() {
        getAllTimes(this.state.sortBy, this.state.sortDesc, [this.props.name]).then(r => {
            this.setState({data: r})
        })
    }
}
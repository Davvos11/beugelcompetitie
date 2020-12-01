import React from "react";
import {getAllTimes, sortType} from "./api";
import {dataType} from "./App";
import {Alert, Button, Modal, Spinner} from "react-bootstrap";
import {Leaderboard} from "./Leaderboard";

type propType = {name: string, onClose: ()=>void}
type stateType = {sortBy: sortType, sortDesc: boolean, data: dataType[], show: boolean, loading: boolean, error: string}

export class PersonalList extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            sortBy: "timestamp", sortDesc: true, data: [], show: true,
            loading: true, error: ""
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
                <div style={{width: "100%", display: (this.state.loading ? "initial" : "none")}}>
                    <Spinner animation="border" role="status" style={{margin: "auto 100px"}}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>

                <div style={{width: "100%", display: (this.state.error ? "initial" : "none")}}>
                    <Alert variant="danger" dismissible onClose={()=>this.setState({error: ""})}>{this.state.error}</Alert>
                </div>

                <div style={{width: "100%", display: (this.state.loading ? "none" : "initial")}}>
                    <Leaderboard data={this.state.data} sort={false}/>
                </div>
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
            this.setState({data: r, loading: false})
        }).catch(e => {
            this.setState({error: e.message, loading: false})
        })
    }
}
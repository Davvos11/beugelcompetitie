import React from "react";
import {Alert, Button, Col, Form} from "react-bootstrap";
import {addTime} from "./api";

export class AddTime extends React.Component<{}, {error: JSX.Element, name: string, time: number, timestamp: number | undefined}> {
    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            error: <span/>,
            name: '', time: 0, timestamp: undefined
        }
    }

    submitTime = (event: React.SyntheticEvent) => {
        event.preventDefault();
        // Send to backend
        addTime(this.state.name, this.state.time, this.state.timestamp).then(r => console.log(r.status))
    }

    updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Write to state
        this.setState({name: event.target.value});
    }
    updateTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get value
        const val = Number(event.target.value)

        // Check if it is a positive number
        let error = <span />
        if (isNaN(val) || val <= 0)
            error = <Alert>De tijd moet een positief getal zijn</Alert>

        // Write to state
        this.setState({error})
        this.setState({time: val});
    }

    render() {
        return <Form onSubmit={this.submitTime}>
            <Form.Row>
                <Form.Group as={Col}>
                    <Form.Label>Naam:</Form.Label>
                    <Form.Control type="text" placeholder="Naam" onChange={this.updateName}/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Tijd (in secondes):</Form.Label>
                    <Form.Control type="number" min={0} placeholder="Tijd" step={0.001} onChange={this.updateTime}/>
                </Form.Group>
            </Form.Row>
            {this.state.error}
            <Button variant="primary" type="submit">
                Toevoegen
            </Button>
        </Form>
    }
}
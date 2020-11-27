import React from "react";
import {Alert, Button, Col, Form, Spinner} from "react-bootstrap";
import {addTime} from "./api";

export class AddTime extends React.Component<{afterSubmit: ()=>void}, {error: string, loading: boolean, name: string, time: number,timestamp: number | undefined}> {
    constructor(props: {afterSubmit: ()=>void} | Readonly<{afterSubmit: ()=>void}>) {
        super(props);
        this.state = {
            error: '', loading: false,
            name: '', time: 0, timestamp: undefined,
        }
    }

    submitTime = (event: React.SyntheticEvent) => {
        event.preventDefault();
        // Show loading icon
        this.setState({loading: true})
        // Send to backend
        addTime(this.state.name, this.state.time, this.state.timestamp).then(async r => {
            // Check status
            if (r.ok) {
                // Reload leaderboard
                this.props.afterSubmit()
                // Clear state
                this.setState({name: '', time: 0, timestamp: undefined})
            } else {
                // Show error
                this.setState({error: await r.text()})
            }
            // Hide loading icon
            this.setState({loading: false})
        })
    }

    updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Write to state
        this.setState({name: event.target.value});
    }
    updateTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get value
        const val = Number(event.target.value)

        // Check if it is a positive number
        let error = ''
        if (isNaN(val) || val <= 0)
            error = "De tijd moet een positief getal zijn"

        // Write to state
        this.setState({error})
        this.setState({time: val});
    }

    render() {
        if (this.state.loading) {
            return <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        }

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
            {this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : ''}
            <Button variant="primary" type="submit">
                Toevoegen
            </Button>
        </Form>
    }
}
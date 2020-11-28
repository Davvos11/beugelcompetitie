import React from "react";
import {Alert, Button, Col, Form, Spinner} from "react-bootstrap";
import {addTime} from "./api";
import {Autocomplete} from "./Autocomplete";

type propType = {afterSubmit: ()=>void, names: string[]}
type stateType = {
    error: string, loading: boolean,
    name: string, time: number,
    date: Date | undefined, timeString: string | undefined
    showDateTime: boolean
}

export class AddTime extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            error: '', loading: false,
            name: '', time: 0,
            date: undefined, timeString: undefined,
            showDateTime: false
        }
    }

    submitTime = (event: React.SyntheticEvent) => {
        event.preventDefault();
        // Show loading icon
        this.setState({loading: true})

        let timestamp

        // Check if we need to send the timestamp
        if (this.state.showDateTime) {
            try {
                // Check if date and time are set
                if (!this.state.timeString || !this.state.date) {
                    throw SyntaxError("Please provide a valid date and time")
                }

                // Add time to date
                const date = parseTime(this.state.timeString, this.state.date)
                // Set timestamp
                timestamp = date.getTime()
                console.log(date, date.getTime())
            } catch (e) {
                // Show error
                this.setState({error: "Please provide a valid time and date"})
                // Hide loading icon
                this.setState({loading: false})
                return
            }
        }

        // Send to backend
        addTime(this.state.name, this.state.time, timestamp).then(async r => {
            // Check status
            if (r.ok) {
                // Reload leaderboard
                this.props.afterSubmit()
                // Clear state
                this.setState({name: '', time: 0, timeString: undefined, date: undefined, showDateTime: false})
            } else {
                // Show error
                this.setState({error: await r.text()})
            }
            // Hide loading icon
            this.setState({loading: false})
        })
    }

    updateName = (value: string) => {
        // Write to state
        this.setState({name: value});
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
    updateCustomTimeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({showDateTime: event.target.checked})
        if (!this.state.showDateTime) {
            this.setState({date: undefined})
        }
    }
    updateDateTimestamp = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get value
        const val = new Date(event.target.value)

        // Check if it is a valid date
        let error = ''
        if (isNaN(val.getDate()))
            error = "De datum is incorrect"
        console.log('Date', val, val.getTime())

        // Write to state
        this.setState({error})
        this.setState({date: val});
    }
    updateTimeTimestamp = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Write to state
        this.setState({timeString: event.target.value});
    }

    private timestampInput =
        <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>Datum:</Form.Label>
                <Form.Control type="date" placeholder="Datum" onChange={this.updateDateTimestamp}/>
            </Form.Group>
            <Form.Group as={Col}>
                <Form.Label>Tijdstip:</Form.Label>
                <Form.Control type="time" placeholder="Tijd" onChange={this.updateTimeTimestamp}/>
            </Form.Group>
        </Form.Row>

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
                    <Autocomplete items={this.props.names} placeholder="Naam" onChange={this.updateName}/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Tijd (in secondes):</Form.Label>
                    <Form.Control type="number" min={0} placeholder="Tijd" step={0.001} onChange={this.updateTime}/>
                </Form.Group>
            </Form.Row>

            <Form.Group>
                <Form.Check type="checkbox" id="date-check" label="Custom datum / tijd" onChange={this.updateCustomTimeCheck}/>
            </Form.Group>

            {this.state.showDateTime ? this.timestampInput : ''}

            {this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : ''}
            <Button variant="primary" type="submit">
                Toevoegen
            </Button>
        </Form>
    }
}

function parseTime( t: string, d: Date ) {
    const time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
    if (time) {
        // tslint:disable-next-line:radix
        d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
        // tslint:disable-next-line:radix
        d.setMinutes( parseInt( time[2]) || 0 );
    } else {
        throw SyntaxError("Invalid time")
    }
    return d;
}
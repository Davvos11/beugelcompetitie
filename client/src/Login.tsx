import React, {SyntheticEvent} from "react";
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {login} from "./api";

type propType = {
    afterLogin: ()=>void
}
type stateType = {
    loading: boolean
    error: string
    username: string
    password: string
}

export class Login extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            loading: false,
            error: '',
            username: '',
            password: ''
        }
    }


    render() {
        if (this.state.loading) {
            return <div style={{width: "100%", display: (this.state.loading ? "block" : "none")}}>
                <Spinner animation="border" role="status" style={{margin: "100px auto", display: "block"}}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        }

        return <Form onSubmit={this.submitForm}>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>
                    Username
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="text" placeholder="Username" onChange={event => {
                        this.setState({username: event.target.value})
                    }}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>
                    Wachtwoord
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="password" placeholder="Wachtwoord" onChange={event => {
                        this.setState({password: event.target.value})
                    }}/>
                </Col>
            </Form.Group>
            <Alert variant="secondary">Deze site gebruikt cookies om in te loggen, trek ad</Alert>
            {this.state.error ? <Alert variant="danger">{this.state.error}</Alert> : ''}
            <Form.Group as={Row}>
                <Col>
                    <Button type="submit">Log in</Button>
                </Col>
            </Form.Group>
        </Form>
    }

    submitForm = (event: SyntheticEvent) => {
        event.preventDefault();
        // Show loading icon
        this.setState({loading: true})

        // Send to backend
        login(this.state.username, this.state.password).then(() => {
            // Hide login
            this.props.afterLogin()
            // Clear state
            this.setState({username: '', password: ''})
        }).catch(e => {
            // Show error
            this.setState({error: e})
        }).then(() => {
            // Hide loading icon
            this.setState({loading: false})
        })
    }
}
import React from "react";
import {Button, Modal} from "react-bootstrap";
import styles from "./Pasapas.module.css"

type propType = {
    onClose: ()=>void
}
type stateType = {
    show: boolean
}

export class Pasapas extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            show: true
        }
    }

    close = () => {
        this.setState({show: false})
        this.props.onClose()
    }

    render() {
        return <Modal show={this.state.show} onHide={this.close} dialogClassName={styles.pasapas}>
                <Modal.Header closeButton>
                    <Modal.Title>Pasapas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <video style={{width: "100%", height: "70vh"}} controls autoPlay >
                        <source src={process.env.PUBLIC_URL + "pasapas.mp4"} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
    }
}
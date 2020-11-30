import React from "react";
import {ButtonGroup, Col, Dropdown, FormControl, InputGroup, Row, ToggleButton} from "react-bootstrap";
import {sortBy} from "./App";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownMenu from "react-bootstrap/DropdownMenu";

export type modeValue = "all" | "best"
export type modeType = { value: modeValue, name: string }
export type sortType = { value: sortBy, name: string}

type propType = {
    mode: modeValue, modes: modeType[], onModeChange: (mode: modeValue)=>void,
    dateRange: dateRangeType, onDateChange: (range: dateRangeType)=>void
}
type stateType = {
    currentMode: string
    currentRange: dateRangeType
}
export type dateRangeType = {from: Date, to: Date}

export class GraphSettings extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            currentMode: this.props.mode,
            currentRange: this.props.dateRange
        }
    }


    render() {
        return <Row>
            <Col><ButtonGroup toggle>
                    {this.props.modes.map((mode, i) => (
                        <ToggleButton
                            value={mode.value} key={i}
                            checked={this.props.mode === mode.value}
                            type="radio"
                            onChange={(e) => this.props.onModeChange(e.currentTarget.value as modeValue)}
                        >
                            {mode.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup></Col>
            <Col><InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Van</InputGroup.Text></InputGroup.Prepend>
                    <FormControl type="date"
                                 onChange={(e)=> {
                                     this.setState({currentRange: {from: new Date(e.target.value), to: this.state.currentRange.to}})
                                 }}/>
            </InputGroup></Col>
            <Col><InputGroup>
                <InputGroup.Prepend><InputGroup.Text>Tot</InputGroup.Text></InputGroup.Prepend>
                <FormControl type="date"
                             onChange={(e)=> {
                                 this.setState({currentRange: {from: this.state.currentRange.from, to: new Date(e.target.value)}})
                             }}/>
            </InputGroup></Col>
        </Row>;
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Check if range updated
        if (this.state.currentRange !== prevState.currentRange) {
            this.props.onDateChange(this.state.currentRange)
        }
    }
}
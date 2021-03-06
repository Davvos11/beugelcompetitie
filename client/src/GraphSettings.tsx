import React, {ChangeEvent} from "react";
import {ButtonGroup, Col, Dropdown, Form, FormControl, InputGroup, Row, ToggleButton} from "react-bootstrap";
import {sortBy} from "./App";

export type modeValue = "all" | "best"
export type modeType = { value: modeValue, name: string }
export type sortType = { value: sortBy, name: string}

type propType = {
    mode: modeValue, modes: modeType[], onModeChange: (mode: modeValue)=>void,
    dateRange: dateRangeType, onDateChange: (range: dateRangeType)=>void,
    names: string[], onNameChange: (names: Set<string>)=>void
}
type stateType = {
    currentMode: string
    currentRange: dateRangeType
    enabledNames: Set<string>
    filterDropdown: boolean
}
export type dateRangeType = {from: Date, to: Date}

export class GraphSettings extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            currentMode: this.props.mode,
            currentRange: this.props.dateRange,
            enabledNames: new Set(this.props.names),
            filterDropdown: false
        }
    }


    render() {
        const colClassNames = "mb-2"

        return <Row style={{justifyContent: "space-around"}} >
            <Col xs="auto" md={8} xl={4} className={colClassNames}>
                <div className="mx-xl-auto" style={{display: "table"}}>
                    <ButtonGroup toggle>
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
                    </ButtonGroup>
                </div>
            </Col>
            <Col xs="auto" md={4} xl={2} className={colClassNames}>
                <div className="ml-auto mx-xl-auto" style={{display: "table"}}>
                    <Dropdown show={this.state.filterDropdown} onToggle={isOpen => this.setState({filterDropdown: isOpen})}>
                        <Dropdown.Toggle>Filter</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.props.names.map((value, index) => (
                                <Form.Check type="checkbox" id={`name-check${index}`} key={index}
                                            label={value} defaultChecked={this.state.enabledNames.has(value)}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => this.onNameCheck(event, value)}/>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Col>
            <Col xs={12} sm={6} md={6} xl={3} className={colClassNames}>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Van</InputGroup.Text></InputGroup.Prepend>
                    <FormControl type="date"
                                 onChange={(e)=> {
                                     this.setState({currentRange: {from: new Date(e.target.value), to: this.state.currentRange.to}})
                                 }}/>
              </InputGroup>
            </Col>
            <Col xs={12} sm={6} md={6} xl={3} className={colClassNames}>
                <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>Tot</InputGroup.Text></InputGroup.Prepend>
                    <FormControl type="date"
                                 onChange={(e)=> {
                                     this.setState({currentRange: {from: this.state.currentRange.from, to: new Date(e.target.value)}})
                                 }}/>
                </InputGroup>
            </Col>
        </Row>;
    }

    onNameCheck = (event: ChangeEvent<HTMLInputElement>, name: string) => {
        if (event.target.checked) {
            // Add to enabled names
            this.state.enabledNames.add(name)
        } else {
            // Remove from enabled names
            this.state.enabledNames.delete(name)
        }
        this.props.onNameChange(this.state.enabledNames)
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Check if range updated
        if (this.state.currentRange !== prevState.currentRange) {
            this.props.onDateChange(this.state.currentRange)
        }
    }
}
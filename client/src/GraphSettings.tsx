import React from "react";
import {ButtonGroup, ToggleButton} from "react-bootstrap";

export type modeValue = "all" | "best"
export type modeType = { value: modeValue, name: string }

type propType = {modes: modeType[], onModeChange: (mode: modeValue)=>void, mode: modeValue}
type stateType = {currentMode: string}

export class GraphSettings extends React.Component<propType, stateType> {
    constructor(props: propType | Readonly<propType>) {
        super(props);
    }


    render() {
        return <div>
            <ButtonGroup toggle>
                {this.props.modes.map((modeButton, i) => (
                    <ToggleButton
                        value={modeButton.value} key={i} checked={this.props.mode === modeButton.value}
                        type="radio"
                        onChange={(e) => this.props.onModeChange(e.currentTarget.value as modeValue)}
                    >
                        {modeButton.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </div>;
    }
}
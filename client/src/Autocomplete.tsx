import ReactAutocomplete from "react-autocomplete";
import React from "react";

type propsType = {items: string[], placeholder: string, onChange: (val: string)=>void};
type stateType = {value: string};

export class Autocomplete extends React.Component<propsType, stateType>{
    constructor(props: propsType | Readonly<propsType>) {
        super(props);
        this.state = {
            value: ''
        }
    }

    render() {
        return <ReactAutocomplete
            value={this.state.value}
            getItemValue={(item) => item}
            items={this.props.items}
            shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}

            renderItem={(item, isHighlighted) =>
                <div style={{background: isHighlighted ? 'lightgray' : 'white', border: "none"}} className="form-control">
                    {item}
                </div>
            }
            renderInput={props => {
                return <input className="form-control" {...props} type="text" placeholder={this.props.placeholder}/>
            }}

            wrapperStyle={{
                display: "block"
            }}
            menuStyle={{
                borderRadius: '3px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 0',
                fontSize: '90%',
                position: 'fixed',
                overflow: 'auto',
                maxHeight: '50%',
                zIndex: 20
            }}


            onChange={e => {
                const value = e.target.value
                this.setState({value})
                this.props.onChange(value)
            }}
            onSelect={value => {
                this.setState({value})
                this.props.onChange(value)
            }}
        />
    }
}
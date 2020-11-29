import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import React from "react";
import {dataType} from "./App";
import {getAllTimes} from "./api";

type propType = {names: string[]}
type stateType = {enabledNames: string[], data: dataType[], names: string[], lines: dataType[][]}

const fromT = Date.now() - 1000*60*60*24*14
const colours = ["red", "green", "blue", "yellow", "purple", "black", "cyan"]

export class Graph extends React.Component<propType, stateType> {

    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.state = {
            names: this.props.names, enabledNames: this.props.names, data: [], lines: []
        }
    }

    render() {
        return <LineChart width={600} height={300} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            {this.state.lines.map((line, i) => {
                return <Line type="monotone" data={line} name={line[0].name} dataKey="time" stroke={colours[i]}/>
            })}
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="timestamp" domain={[fromT, Date.now()]} />
            <YAxis />
            <Tooltip />
            <Legend />
        </LineChart>
    }

    updateChart = (enableNames = false) => {
        getAllTimes().then(r => {
            // Get list of names (to be used by autocomplete)
            let names = r.map((item: dataType) => item.name)
            // Remove duplicates
            names = [...new Set(names)];

            // Generate lines
            const lines = generateLines(r)

            // Save in state
            this.setState({data: r, names, lines})
            if (enableNames) {
                this.setState({enabledNames: names})
            }
        })
    }

    componentDidMount() {
        this.updateChart()
    }

}

function generateLines(data: dataType[]) {
    const result: { [key: string]: dataType[] } = {}


    data.forEach(item => {
        // Check if it falls within the time range
        // if (item.timestamp < fromT) return

        // Check if this name is already in the results
        if (result.hasOwnProperty(item.name)) {
            // Add this entry to the results of that name
            result[item.name].push(item)
        } else {
            // Add the name to the results together with this entry
            result[item.name] = [item]
        }
    })

    // Add an entry with the current timestamp for all lines (so that it will flow until the end)
    const currentTime = Date.now()
    console.log(currentTime)
    for (const name in result) {
        if (!result.hasOwnProperty(name)) continue
        const list = result[name]

        // Get last time
        const lastTime = list[list.length - 1].time
        // Add to the list with current timestamp
        list.push({name, time: lastTime, timestamp: currentTime})
        result[name] = list
    }

    console.log(result)
    return Object.values(result)
}
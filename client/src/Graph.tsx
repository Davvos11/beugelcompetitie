import React from "react";
import {dataType} from "./App";
import {getAllTimes} from "./api";
import { ResponsiveLine } from '@nivo/line'
import dateformat from 'dateformat'

type propType = {data: dataType[]}
type stateType = {
    enabledNames: string[], names: string[],
    lines: line[]
}

type line = { id: string, data: { x: string, y: number }[]}

const fromT = Date.now() - 1000*60*60*24*14
const colours = ["red", "green", "blue", "yellow", "purple", "black", "cyan"]

export class Graph extends React.Component<propType, stateType> {

    constructor(props: propType | Readonly<propType>) {
        super(props);
        this.processData()

        this.state = {
            names: [], enabledNames: [], lines: []
        }
    }

    processData = () => {
        // Get list of names (to be used by autocomplete)
        let names = this.props.data.map((item: dataType) => item.name)
        // Remove duplicates
        names = [...new Set(names)];

        // Generate lines
        const lines = generateLines(this.props.data)

        // Save in state
        if (true) {
            this.setState({enabledNames: names})
        }

        this.setState({names, lines})
    }

    render() {
        return <div style={{height: "500px"}}>
            <ResponsiveLine
                data={this.state.lines}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                    type: "time",
                    format: "%Y-%m-%d %H:%M"
                }}
                xFormat="time:%Y-%m-%d %H:%M"
                yScale={{
                    type: "linear",
                    min: 0,
                    max: "auto",
                    stacked: false,
                    reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisLeft={{
                    orient: "left",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Tijd (seconden)",
                    legendOffset: -40,
                    legendPosition: "middle"
                }}
                axisBottom={{
                    format: "%d %b",
                    // tickValues: "every 2 days",
                    // tickRotation: -90,
                    legend: "time scale",
                    legendOffset: -12
                }}
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemBackground: "rgba(0, 0, 0, .03)",
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Check if props have changed
        if (this.props !== prevProps)
            this.processData()
    }
}

function generateLines(data: dataType[]) {
    const result: {[key: string]: line } = {}


    data.forEach(item => {
        // Create data object
        const newData = {x: formatDate(new Date(item.timestamp)), y: item.time}

        // Check if this name is already in the results
        if (result.hasOwnProperty(item.name)) {
            // Add this entry to the results of that name
            result[item.name].data.push(newData)
        } else {
            // Add the name to the results together with this entry
            result[item.name] = {id: item.name, data: [newData]}
        }
    })

    console.log(result)
    return Object.values(result)
}

function formatDate(date: Date) {
    return dateformat(date, "yyyy-mm-dd HH:MM")
}
import React from "react";
import {dataType} from "./App";
import { ResponsiveLine } from '@nivo/line'
import dateformat from 'dateformat'
import {dateRangeType, GraphSettings, modeType, modeValue} from "./GraphSettings";

type propType = {
    data: dataType[],
    mode: modeValue,
}
type stateType = {
    enabledNames: string[], names: string[],
    lines: line[],
    lowestTime: number
}

type line = { id: string, data: { x: string, y: number }[]}

const marginBottom = 4

export class Graph extends React.Component<propType, stateType> {

    constructor(props: propType | Readonly<propType>) {
        super(props);

        this.state = {
            names: [], enabledNames: [], lines: [], lowestTime: 0,
        }
    }
    processData = (enableAllNames = true) => {
        // Get list of names (to be used by autocomplete)
        let names = this.props.data.map((item: dataType) => item.name)
        // Remove duplicates
        names = [...new Set(names)];

        // Generate lines
        const {lines, lowestTime} = generateLines(this.props.data, this.props.mode)

        // Save in state
        if (enableAllNames) {
            this.setState({enabledNames: names})
        }

        this.setState({names, lines, lowestTime})
    }

    render() {
        return <div style={{height: "500px"}}>
            <ResponsiveLine
                data={this.state.lines}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{
                    type: "time",
                    format: "%Y-%m-%d %H:%M",
                    useUTC: false,
                }}
                xFormat="time:%Y-%m-%d %H:%M"
                yScale={{
                    type: "linear",
                    min: Math.max(0, this.state.lowestTime - marginBottom),
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
                    tickValues: "every 7 days",
                    // tickRotation: -90,
                    legend: "Datum",
                    legendPosition: "middle",
                    legendOffset: 40
                }}
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                enableCrosshair={false}
                enableSlices="x"
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

    componentDidMount() {
        this.processData()
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Check if props have changed
        if (this.props !== prevProps)
            this.processData()
    }
}

function generateLines(data: dataType[], graphMode: modeValue) {
    const result: {[key: string]: line } = {}
    let lowestTime = -1

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

        // Update lowest time value
        if (item.time < lowestTime || lowestTime === -1)
            lowestTime = item.time
    })

    // If we are on "best times" mode, remove all times that are not improvements
    if (graphMode === "best") {
        for (const name in result) {
            if (!result.hasOwnProperty(name)) continue
            let bestTime = -1
            // Loop over each entry
            result[name].data.forEach((entry, index) => {
                // If this entry is better than the current best time, keep it
                if (entry.y <= bestTime || bestTime === -1) {
                    bestTime = entry.y
                } else {
                    // Otherwise, discard this entry
                    result[name].data.splice(index, 1)
                }
            })
        }
    }

    // Add an entry with the current timestamp for all lines (so that it will flow until the end)
    const currentTime = formatDate(new Date())
    for (const name in result) {
        if (!result.hasOwnProperty(name)) continue
        const list = result[name].data

        // Get last time
        const lastTime = list[list.length - 1].y
        // Add to the list with current timestamp
        list.push({y: lastTime, x: currentTime})
        result[name].data = list
    }


    return {lines: Object.values(result), lowestTime}
}

function formatDate(date: Date) {
    return dateformat(date, "yyyy-mm-dd HH:MM")
}
import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'
import {Leaderboard} from "./Leaderboard";
import {AddTime} from "./AddTime";
import {getAllTimes, getLeaderboard} from "./api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faList, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Graph} from "./Graph";
import {dateRangeType, GraphSettings, modeType, modeValue} from "./GraphSettings";


export type dataType = {name: string, timestamp: number, time: number}
export type sortBy = "name"|"time"|"timestamp"

type propType = {}
type stateType = {
    data: dataType[],
    key: string, names: string[],
    sortBy: sortBy, sortDesc: boolean,
    graphData: dataType[],
    graphMode: modeValue
    graphDateRange: dateRangeType
    graphNames: string[]
}

const modes: modeType[] = [{name: "Alle tijden", value: "all"}, {name: "Alleen nieuwe records", value: "best"}]

class App extends React.Component<propType, stateType> {
    constructor(props: Readonly<propType>) {
        super(props);
        this.state = {
            data: [],
            names: [],
            key: 'leaderboard',
            sortBy: "time", sortDesc: false,
            graphData: [],
            graphMode: "best",
            graphDateRange: {from: new Date(), to: new Date()},
            graphNames: []
        }
    }

    setTab(key: string) {
        this.setState({key})
    }

    render() {
        const wordwrap = <span style={{width: "0px", display: "inline-block"}}> </span>

        return <Bootstrap.Container>
            <Bootstrap.Jumbotron>
                <h1 className="display-4">Beugel{wordwrap}competitie <b>Lit</b>terkerk{wordwrap}straat</h1>
                <p className="lead">Leaderboard voor de beugelcompetitie van de <b>Lit</b>terkerkstraat</p>

                <Bootstrap.Tabs activeKey={this.state.key} onSelect={(k) => this.setTab(k as string)}>
                    <Bootstrap.Tab eventKey="add"
                                   title={<span><FontAwesomeIcon icon={faPlus}/> Tijd toevoegen</span>}>
                        <AddTime names={this.state.names} afterSubmit={()=> {
                            // Todo go back to previous tab
                            // Show the leaderboard
                            this.setTab('leaderboard')
                            // Update this object
                            this.componentDidMount()
                        }}/>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="leaderboard"
                                   title={<span><FontAwesomeIcon icon={faList}/> Leaderboard</span>}>
                        <Leaderboard data={this.state.data} clickable={true}
                                     sort={{
                                         sortBy: this.state.sortBy, sortDesc: this.state.sortDesc,
                                         onSortChange: (by, desc) => {this.setState({sortBy: by, sortDesc: desc})}
                                     }}/>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="graph"
                                   title={<span><FontAwesomeIcon icon={faChartLine}/> Grafiek</span>}>
                        <GraphSettings
                            modes={modes} mode={this.state.graphMode}
                            onModeChange={(mode => this.setState({graphMode: mode}))}
                            dateRange={this.state.graphDateRange}
                            onDateChange={range => this.setState({graphDateRange: range})}
                            names={this.state.names}
                            onNameChange={names => this.setState({graphNames: Array.from(names)})}
                        />
                        <Graph
                            data={this.state.graphData}
                            mode={this.state.graphMode}
                        />
                    </Bootstrap.Tab>
                </Bootstrap.Tabs>

            </Bootstrap.Jumbotron>
        </Bootstrap.Container>
    }

    updateLeaderboard = () => {
        getLeaderboard(this.state.sortBy, this.state.sortDesc).then(r => {
            // Get list of names (to be used by autocomplete)
            const names = r.map((item: dataType) => item.name)
            // Set leaderboard and names
            this.setState({data: r, names})
        })
    }

    updateGraph = (resetDateRange = false) => {
        getAllTimes("timestamp", false,
            this.state.graphNames,
            (resetDateRange ? undefined : this.state.graphDateRange)).then(r => {
            // Set graph values
            this.setState({graphData: r})

            if (resetDateRange) {
                // Get oldest time
                let oldestTimestamp = Date.now()
                r.forEach((entry: dataType) => {
                    if (entry.timestamp < oldestTimestamp) {
                        oldestTimestamp = entry.timestamp
                    }
                })


                this.setState({graphDateRange: {from: new Date(oldestTimestamp), to: new Date()}})
            }
        })
    }

    componentDidMount() {
        this.updateLeaderboard()
        this.updateGraph(true)
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Check if sort values changed
        if (this.state.sortBy !== prevState.sortBy || this.state.sortDesc !== prevState.sortDesc)
            this.updateLeaderboard()
        // Check if date range or name list changed
        if (this.state.graphDateRange !== prevState.graphDateRange || this.state.graphNames !== prevState.graphNames) {
            this.updateGraph()
        }
    }
}

export default App;

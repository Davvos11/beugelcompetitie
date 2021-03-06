import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'
import {Leaderboard} from "./Leaderboard";
import {AddTime} from "./AddTime";
import {getAllTimes, getLeaderboard, isLoggedIn} from "./api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faList, faPlay, faPlus, faVideo} from "@fortawesome/free-solid-svg-icons";
import {Graph} from "./Graph";
import {dateRangeType, GraphSettings, modeType, modeValue} from "./GraphSettings";
import {Alert, Spinner} from "react-bootstrap";
import {Login} from "./Login";
import {Pasapas} from "./Pasapas";


export type dataType = {name: string, timestamp: number, time: number}
export type sortBy = "name"|"time"|"timestamp"

type propType = {}
type stateType = {
    data: dataType[],
    key: string,
    previousKey: string,
    names: string[],
    sortBy: sortBy, sortDesc: boolean,
    graphData: dataType[],
    graphMode: modeValue
    graphDateRange: dateRangeType
    graphNames: string[]
    loading: boolean
    error: string
    loggedIn: boolean
}

const modes: modeType[] = [{name: "Alle tijden", value: "all"}, {name: "Alleen nieuwe records", value: "best"}]

class App extends React.Component<propType, stateType> {
    constructor(props: Readonly<propType>) {
        super(props);
        this.state = {
            data: [],
            names: [],
            key: 'leaderboard',
            previousKey: 'leaderboard',
            sortBy: "time", sortDesc: false,
            graphData: [],
            graphMode: "best",
            graphDateRange: {from: new Date(), to: new Date()},
            graphNames: [],
            loading: true,
            error: "",
            loggedIn: false
        }
    }

    setTab(key: string) {
        const currentKey = this.state.key
        this.setState({key, previousKey: currentKey})
    }

    loading(loading: boolean) {
        if (this.state.loading !== loading)
            this.setState({loading})
    }

    render() {
        const wordwrap = <span style={{width: "0px", display: "inline-block"}}> </span>
        const imageMask = "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.04) 90%, rgba(0,0,0,0))"

        return <Bootstrap.Container>
            <Bootstrap.Jumbotron style={{position: "relative", minHeight: "600px"}}>
                <div style={{position: "absolute", width: "100%", padding: "0 2rem"}}>
                    <img src={process.env.PUBLIC_URL + '/grolsch.webp'} alt=""
                         style={{
                             marginLeft: "auto", display: "block",
                             maskImage: imageMask, WebkitMaskImage: imageMask
                         }}/>
                </div>

                <div style={{position: "relative", zIndex: 2}}>
                    <div style={{background: "linear-gradient(135deg, rgba(233,236,239,1) 0%,  rgba(255,255,255,0) 100%)", display: "table"}}>
                        <h1 className="display-4">
                            Beugel{wordwrap}competitie <b>Lit</b>terkerk{wordwrap}straat
                        </h1>
                        <p className="lead">
                            Leaderboard voor de beugelcompetitie van de <b>Lit</b>terkerkstraat
                        </p>
                    </div>

                    <div style={{width: "100%", display: (this.state.loading ? "block" : "none")}}>
                        <Spinner animation="border" role="status" style={{margin: "100px auto", display: "block"}}>
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>

                    <div style={{width: "100%", display: (this.state.error ? "initial" : "none")}}>
                        <Alert variant="danger" dismissible onClose={()=>this.setState({error: ""})}>{this.state.error}</Alert>
                    </div>

                    <div style={{display: (this.state.loading ? "none" : "initial")}}>
                    <Bootstrap.Tabs activeKey={this.state.key}
                                    onSelect={(k) => this.setTab(k as string)}>
                        <Bootstrap.Tab eventKey="add"
                                       title={<span><FontAwesomeIcon icon={faPlus}/> Tijd toevoegen</span>}>
                            <div style={{display: (this.state.loggedIn ? "none" : "initial")}}>
                                <Login afterLogin={async ()=>this.setState({loggedIn: await isLoggedIn()})} />
                            </div>

                            <div style={{display: (this.state.loggedIn ? "initial" : "none")}}>
                                <AddTime names={this.state.names} afterSubmit={()=> {
                                    // Show the leaderboard
                                    this.setTab(this.state.previousKey)
                                    // Update this object
                                    this.componentDidMount()
                                }} beforeSubmit={this.checkLogin}/>
                            </div>
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
                        <Bootstrap.Tab eventKey="pasapas"
                                       title={<span><FontAwesomeIcon icon={faPlay}/> Pasapas</span>}>
                            {this.state.key === "pasapas" ?
                                <Pasapas onClose={()=>this.setTab(this.state.previousKey)}/> :
                                <span/>}
                        </Bootstrap.Tab>
                    </Bootstrap.Tabs>
                    </div>

                </div>
            </Bootstrap.Jumbotron>
        </Bootstrap.Container>
    }

    setError = (error: Error) => {
        console.error(error)
        this.setState({error: error.message})
    }

    updateLeaderboard = async () => {
        try {
            const r = await getLeaderboard(this.state.sortBy, this.state.sortDesc)
            // Get list of names (to be used by autocomplete)
            const names = r.map((item: dataType) => item.name)
            // Set leaderboard and names
            this.setState({data: r, names})
        } catch (e) {
            this.setError(e)
        }
    }

    updateGraph = async (resetDateRange = false) => {
        try {
            const r = await getAllTimes("timestamp", false,
                this.state.graphNames,
                (resetDateRange ? undefined : this.state.graphDateRange))

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
        } catch (e) {
            this.setError(e)
        }
    }

    checkLogin = async () => {
        return isLoggedIn().then(loggedIn => {
            this.setState({loggedIn})
            return loggedIn
        })
    }

    componentDidMount() {
        const promises: Promise<any>[] = []
        promises.push(this.updateLeaderboard())
        promises.push(this.updateGraph(true))
        promises.push(this.checkLogin())

        Promise.all(promises).then(() => {
            this.loading(false)
        })
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Ignore if only loading changed
        if (this.state.loading !== prevState.loading)
            return

        const promises: Promise<any>[] = []

        this.loading(true)

        // Check if sort values changed
        if (this.state.sortBy !== prevState.sortBy || this.state.sortDesc !== prevState.sortDesc)

            promises.push(this.updateLeaderboard())
        // Check if date range or name list changed
        if (this.state.graphDateRange !== prevState.graphDateRange || this.state.graphNames !== prevState.graphNames) {
            promises.push(this.updateGraph())
        }

        Promise.all(promises).then(() => {
            this.loading(false)
        })
    }
}

export default App;

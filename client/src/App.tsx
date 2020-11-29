import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'
import {Leaderboard} from "./Leaderboard";
import {AddTime} from "./AddTime";
import {getLeaderboard} from "./api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faList, faPlus} from "@fortawesome/free-solid-svg-icons";


export type dataType = {name: string, timestamp: number, time: number}
export type sortBy = "name"|"time"|"timestamp"

type propType = {}
type stateType = {data: dataType[], key: string, names: string[], sortBy: sortBy, sortDesc: boolean}

class App extends React.Component<propType, stateType> {
    constructor(props: Readonly<propType>) {
        super(props);
        this.state = {
            data: [],
            names: [],
            key: 'leaderboard',
            sortBy: "time", sortDesc: false
        }
    }

    setTab(key: string) {
        this.setState({key})
    }

    render() {
        return <Bootstrap.Container>
            <Bootstrap.Jumbotron>
                <h1 className="display-4">Beugelcompetitie <b>Lit</b>terkerkstraat</h1>
                <p className="lead">Leaderboard voor de beugelcompetitie van de <b>Lit</b>terkerkstraat</p>

                <Bootstrap.Tabs activeKey={this.state.key} onSelect={(k) => this.setTab(k as string)}>
                    <Bootstrap.Tab eventKey="add"
                                   title={<span><FontAwesomeIcon icon={faPlus}/> Tijd toevoegen</span>}>
                        <AddTime names={this.state.names} afterSubmit={()=> {
                            // Show the leaderboard
                            this.setTab('leaderboard')
                            // Update the leaderboard
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
                        Graph
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

    componentDidMount() {
        this.updateLeaderboard()
    }

    componentDidUpdate(prevProps: Readonly<propType>, prevState: Readonly<stateType>, snapshot?: any) {
        // Check if sort values changed
        if (this.state.sortBy !== prevState.sortBy || this.state.sortDesc !== prevState.sortDesc)
            this.updateLeaderboard()
    }
}

export default App;

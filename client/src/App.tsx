import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'
import {Leaderboard} from "./Leaderboard";
import {AddTime} from "./AddTime";
import {getLeaderboard} from "./api";

const sortBy = "time"
const sortDesc = false

export type dataType = {name: string, timestamp: number, time: number}

type propType = {}
type stateType = {data: dataType[], key: string, names: string[]}

class App extends React.Component<propType, stateType> {
    constructor(props: Readonly<propType>) {
        super(props);
        this.state = {
            data: [],
            names: [],
            key: 'leaderboard'
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
                    <Bootstrap.Tab eventKey="add" title="Tijd toevoegen">
                        <AddTime names={this.state.names} afterSubmit={()=> {
                            // Show the leaderboard
                            this.setTab('leaderboard')
                            // Update the leaderboard
                            this.componentDidMount()
                        }}/>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="leaderboard" title="Leaderboard">
                        <Leaderboard data={this.state.data} clickable={true}/>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="graph" title="Graph">
                        Graph
                    </Bootstrap.Tab>
                </Bootstrap.Tabs>

            </Bootstrap.Jumbotron>
        </Bootstrap.Container>
    }

    componentDidMount() {
        getLeaderboard(sortBy, sortDesc).then(r => {
            // Get list of names (to be used by autocomplete)
            const names = r.map((item: dataType) => item.name)
            // Set leaderboard and names
            this.setState({data: r, names})
        })
    }
}

export default App;

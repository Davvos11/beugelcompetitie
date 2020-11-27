import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'
import {Leaderboard} from "./Leaderboard";
import {AddTime} from "./AddTime";
import {getLeaderboard} from "./api";

const sortBy = "time"
const sortDesc = false

export type dataType = {name: string, timestamp: number, time: number}[]

class App extends React.Component<{}, {data: dataType, key: string}> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            data: [],
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
                        <AddTime afterSubmit={()=> {
                            // Show the leaderboard
                            this.setTab('leaderboard')
                            // Update the leaderboard
                            this.componentDidMount()
                        }}/>
                    </Bootstrap.Tab>
                    <Bootstrap.Tab eventKey="leaderboard" title="Leaderboard">
                        <Leaderboard sortBy="time" descending={false} data={this.state.data}/>
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
            this.setState({data: r})
        })
    }
}

export default App;

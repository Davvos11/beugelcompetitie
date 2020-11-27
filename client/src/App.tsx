import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'
import {Leaderboard} from "./Leaderboard";
import {AddTime} from "./AddTime";

function App() {
  return (
      <Bootstrap.Container>
          <Bootstrap.Jumbotron>
              <h1 className="display-4">Beugelcompetitie <b>Lit</b>terkerkstraat</h1>
              <p className="lead">Leaderboard voor de beugelcompetitie van de <b>Lit</b>terkerkstraat</p>
              <Bootstrap.Tabs defaultActiveKey="leaderboard">
                  <Bootstrap.Tab eventKey="add" title="Tijd toevoegen">
                      <AddTime />
                  </Bootstrap.Tab>
                  <Bootstrap.Tab eventKey="leaderboard" title="Leaderboard">
                      <Leaderboard sortBy="time" descending={false}/>
                  </Bootstrap.Tab>
                  <Bootstrap.Tab eventKey="graph" title="Graph">
                      Graph
                  </Bootstrap.Tab>
              </Bootstrap.Tabs>
          </Bootstrap.Jumbotron>
      </Bootstrap.Container>
  );
}

export default App;

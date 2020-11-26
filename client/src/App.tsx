import React from 'react';
import './App.css';
import * as Bootstrap from 'react-bootstrap'

function App() {
  return (
      <Bootstrap.Container>
          <Bootstrap.Jumbotron>
              <h1 className="display-4">Beugelcompetitie <b>Lit</b>terkerkstraat</h1>
              <p className="lead">Leaderboard voor de beugelcompetitie van de <b>Lit</b>terkerkstraat</p>
              <Bootstrap.Tabs defaultActiveKey="leaderboard">
                  <Bootstrap.Tab eventKey="leaderboard" title="Leaderboard">
                      Leaderboard
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

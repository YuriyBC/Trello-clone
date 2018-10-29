import React, { Component } from 'react';
import Main from './pages/BoardPage'
import BoardContent from './pages/BoardContentPage'
import { HeaderComponent } from './components/header/HeaderComponent'
import './App.css';
import Particles from 'react-particles-js';
import backgroundConfig from './utils/particlesjs-config.json'

import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'

export default function App () {
    return (
        <Router>
          <div className="App">
              <Particles className="AppBackround"
                         params={backgroundConfig}
                         style={{
                             background: '#232741'
                         }} />
            <HeaderComponent></HeaderComponent>
              <Route exact path="/" component={Main} />
              <Route exact path="/:boardId" component={BoardContent} />
          </div>
        </Router>
    );
}

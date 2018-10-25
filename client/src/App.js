import React, { Component } from 'react';
import Main from './pages/BoardPage'
import BoardContent from './pages/BoardContentPage'
import { HeaderComponent } from './components/header/HeaderComponent'
import './App.css';
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
            <HeaderComponent></HeaderComponent>
              <Route exact path="/" component={Main} />
              <Route exact path="/:boardId" component={BoardContent} />
          </div>
        </Router>
    );
}

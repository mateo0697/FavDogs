import React from 'react'
import './App.css';
import { Route } from 'react-router-dom';
import Log from "./components/Log.js"
import Home from "./components/Home.js"
import Data from "./components/Data.js"
import AddDog from "./components/AddDog.js"

function App() {
  return (
    <div className="App">
      <Route exact path="/">
        <Log/>
      </Route>
      <Route path="/home">
        <Home/>
      </Route>
      <Route path="/data/:id" component={Data}/>
      <Route path="/addDog">
        <AddDog/>
      </Route>


    </div>
  );
}

export default App;

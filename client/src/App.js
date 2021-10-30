import React from 'react'
import './App.css';
import { Route } from 'react-router-dom';
import Log from "./components/Log.js"
import Home from "./components/Home.js"
import Data from "./components/Data.js"
import AddDog from "./components/AddDog.js"
import { connect } from "react-redux";
import {getDogs} from "./actions/index.js"

function App(props) {
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

const mapStateToProps = (state) => {
    return {dogs: state};
};

export default connect(mapStateToProps,{getDogs})(App);;

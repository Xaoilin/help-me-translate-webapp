import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import About from "./components/about/About";
import Home from "./components/home/Home";
import HMTNavbar from "./components/navbar/Navbar";
import MarkupTranslation from "./components/translation/MarkupTranslation";

function App() {
    return (
        <Router>

            <HMTNavbar />
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
                <Route path="/about">
                    <About/>
                </Route>
                <Route path="/markup-translation">
                    <MarkupTranslation/>
                </Route>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;

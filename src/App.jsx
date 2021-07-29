import React, { Component } from 'react'
import { Button } from 'antd';
import './App.css';
import { BrowserRouter, Route, Switch,Redirect } from 'react-router-dom';

import Login from './pages/Login'
import Admin from './pages/Admin'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>{/*只匹配其中一个*/}
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Admin}></Route>
                    <Redirect to="/login"/>
                </Switch>
            </BrowserRouter>
        )
    }
}

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { createFilter } from '../src/Search/Search';
import { createSorter  } from '../src/Search/Sort';

class App extends Component {

    state = {
        filters:this.props.filters,
        sorters: this.props.sorters,
        stats: ""
    }
    handleCange = e => this.setState({ stats: e.target.value });
    damageCalc = () => console.log(this.state.stats);
   
    static defaultProps = { 
      
        filters: [{
            property: '﻿Serial',
            value: 'METER000001'
        }],

        sorters: [{
            property: 'Serial'
        }, {
                property: 'ReadingDateTimeUTC'
        }]
    }  
    componentWillMount() {
        fetch('http://localhost:4000/./rms.json')
            .then(res => res.json())
            .then(this.onLoad);
    }
    parseData(data) {
        const { sorters } = this.state;

        if (data && data.length && Array.isArray(sorters) && sorters.length) {
            data.sort(createSorter(...sorters));
        }
        return data;
    }
    onLoad = (data) => {
        this.setState({
            data: this.parseData(data)
        });
    }
    render() {
        const { data } = this.state;

        return data ?
            <div>
                 <header className="App-header">
                    <img src={logo} className="App-logo" width="100" height="1000" alt="logo" />
                    <label> RMS Assessment</label>
                     </header>
                <h3>Retrieve Data</h3>

            
                <div className='button_container'>
                    <button className='button' onClick={this.handleCange}>
                        Search Meter Serial
                        </button>
                    <label>  : </label>
                    <form>
                        <input type="text" id="filters" placeholder="Search for Serial Number..." ref={input => this.filters = input} onChange={(value) => this.setState({ value })} value={this.state.filters.value} />
                    </form>
                <table id='rms' className="rms">
                    <tbody>
                      <tr>  {this.renderTableHeader()}</tr>
                        {this.renderData(data)}
                    </tbody>
                    </table>
                    </div>
            </div> :
           this.renderLoading();
    }
    renderTableHeader() {
        let header = Object.keys(this.state.data[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }
    renderData(data) {
        if (data && data.length > 0) {
            const { filters } = this.state;

            if (Array.isArray(filters) && filters.length) {
                data = data.filter(createFilter(...filters));
            }
            return data.map((item, index) => {

                let col = Object.keys(item)
                return (            
                    <tr key={item.Serial}>
                            {col.map((val, index) => {
                                return <td key={index}>{item[col[index]]}</td>
                            })}
                        </tr>                  
                );
            })
        }
        else {
            return <div>No items found</div>;
        }
    }
    renderLoading() {
        return <div>Loading...</div>;
    }
}
    export default App;
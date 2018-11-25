import React, { Component } from 'react';
import categories from './categories';
import MultiSelect from './MultiSelect/MultiSelect';
import './App.scss';

class App extends Component {
    state = {
        options: categories,
        selectedOptions: [],
    };

    onChangeSelect = this.onChangeSelect.bind(this);

    onChangeSelect(selectedOptions) {
        this.setState({ selectedOptions });
    }

    render() {
        var selectedNames = this.state.selectedOptions.map(function(tag) {
            return <li key={tag.value}>{tag.label}</li>
        });

        return (
            <div className="App">
                <div className="Modal">
                    <form>
                        <div className="FormGroup MultiSelect">
                            <label>Categories</label>
                            <MultiSelect
                                isDisabled={false}
                                showListOnFocus={false}
                                options={this.state.options}
                                onChange={this.onChangeSelect}
                                selected={this.state.selectedOptions}
                                placeholder='Search'
                            />
                        </div>
                        <label>Selected</label>
                        <ul>
                            {selectedNames}
                        </ul>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;

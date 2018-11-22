import React, { Component } from 'react';
import categories from './categories';
import MultiSelect from './MultiSelect';
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
                        <div className="FormGroup">
                            <label>Categories</label>
                            <MultiSelect
                                onChange={this.onChangeSelect}
                                options={this.state.options}
                                selectedOptions={this.state.selectedOptions}
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

import React, { Component } from 'react';
import './MultiSelect.scss';
import TokenInput from './TokenInput';
import ComboboxOption from './ComboboxOption';
import { uniq, without } from 'lodash-node';


export default class MultiSelect extends Component {
    state = {
        input: '',
        loading: false,
        selected: this.props.selectedOptions,
        options: this.props.options
    };

    handleChange = (value) => {
        this.setState({
            selected: value
        })
    };

    handleRemove = (value) => {
        var selectedOptions = uniq(without(this.state.selected,value))
        this.handleChange(selectedOptions)
    };

    handleSelect = (value, combobox) => {
        if(typeof value === 'string') {
            value = {value: value, label: value};
        }

        var selected = uniq(this.state.selected.concat([value]))
        this.setState({
            selected: selected,
            selectedToken: null
        })

        this.handleChange(selected)
    };

    handleInput = (userInput) => {
        this.setState({
            input: userInput,
            loading: true,
            options: []
        })
        setTimeout(function () {
            this.filterTags(this.state.input)
            this.setState({
                loading: false
            })
        }.bind(this), 500)
    };

    filterTags = (userInput) => {
        if (userInput === '')
            return this.setState({options: []});
        var filter = new RegExp('^'+userInput, 'i');
        var filteredNames = this.props.options.filter((state) => {
            return filter.test(state.label); // || filter.test(state.value);
        }).filter((state) => {
            return this.state.selected
                .map(function(value) { return value.label })
                .indexOf(state.label) === -1
        });
        this.setState({
            options: filteredNames
        });
    };

    renderComboboxOptions = () => {
        return this.state.options.map((name) => {
            return (
                <ComboboxOption
                    key={name.value}
                    value={name}
                    isFocusable={name.label.length > 1}
                >{name.label}</ComboboxOption>
            );
        });
    };

    render() {
        var options = this.state.options.length ?
            this.renderComboboxOptions() : [];

        const loadingComponent = (
            <img src='spinner.gif' />
        )

        return (
            <div className="MultiSelect">
                <TokenInput
                    isLoading={this.state.loading}
                    loadingComponent={loadingComponent}
                    menuContent={options}
                    onChange={this.handleChange}
                    onInput={this.handleInput}
                    onSelect={this.handleSelect}
                    onRemove={this.handleRemove}
                    selected={this.state.selected}
                    placeholder='Enter tokens here'
                />
            </div>
        );
    }
}

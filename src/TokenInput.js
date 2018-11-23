import React, { Component } from 'react';
import { uniq, without } from 'lodash-node';
import classnames from 'classnames';
import Combobox from './Combobox';
import ComboboxOption from './ComboboxOption';
import Token from './Token';
import loadingGif from './spinner.gif';

import './MultiSelect.scss';

export default class TokenInput extends Component {
    state = {
        input: '',
        loading: false,
        options: this.props.options,
        selectedToken: null
    };

    handleClick = () => {
        this.comboLi.querySelector('input').focus();
    };

    handleFocus = () => {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    };

    handleRemoveLast = () => {
        this.handleRemove(this.props.selected[this.props.selected.length - 1]);
    };

    ///
    handleRemove = (value) => {
        var selectedOptions = uniq(without(this.props.selected, value))
        this.props.onChange(selectedOptions)
    };

    handleSelect = (value, combobox) => {
        if (typeof value === 'string') {
            value = { value: value, label: value };
        }

        var selected = uniq(this.props.selected.concat([value]))
        this.setState({
            selectedToken: null
        })

        this.props.onChange(selected)
    };

    handleInput = (userInput) => {
        this.setState({
            input: userInput,
            loading: true,
            options: []
        });
        setTimeout(() => {
            this.filterTags(this.state.input)
            this.setState({
                loading: false
            })
        }, 500)
    };

    filterTags = (userInput) => {
        if (userInput === '')
            return this.setState({ options: [] });
        var filter = new RegExp('^' + userInput, 'i');
        var filteredNames = this.props.options.filter((state) => {
            return filter.test(state.label);
        }).filter((state) => {
            return this.props.selected
                .map(function (value) {
                    return value.label
                })
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
                    className="ic-tokeninput-option"
                    isFocusable={name.label.length > 1}
                >{name.label}</ComboboxOption>
            );
        });
    };

    ///

    render() {
        var isDisabled = this.props.isDisabled;
        var tokens = this.props.selected.map((token) => {
            return (
                <Token
                    tokenAriaFunc={this.props.tokenAriaFunc}
                    onFocus={this.handleFocus}
                    onRemove={this.handleRemove}
                    value={token}
                    name={token.label}
                    key={token.value} />
            );
        });

        var classes = classnames('ic-tokens flex', {
            'ic-tokens-disabled': isDisabled
        });

        var options = this.state.options.length ?
            this.renderComboboxOptions() : [];

        const loadingComponent = (
            <img src={loadingGif} />
        )

        return (
            <ul className={classes} onClick={this.handleClick}>
                {tokens}
                <li className="inline-flex" ref={e => this.comboLi = e}>
                    <Combobox
                        id={this.props.value}
                        aria-label={this.props['combobox-aria-label']}
                        showListOnFocus={this.props.showListOnFocus}
                        ariaDisabled={isDisabled}
                        onFocus={this.handleFocus}
                        onInput={this.handleInput}
                        onSelect={this.handleSelect}
                        onRemoveLast={this.handleRemoveLast}
                        value={this.state.selectedToken}
                        isDisabled={isDisabled}
                        autocomplete="inline"
                        placeholder={this.props.placeholder}>
                        {options}
                    </Combobox>
                </li>
                {this.state.loading && <li className="ic-tokeninput-loading flex">
                    {loadingComponent}
                </li>}
            </ul>
        );
    }
}

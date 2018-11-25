import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without } from 'lodash-node';
import cn from 'classnames';
import Combobox from '../Combobox/Combobox';
import ComboboxOption from '../ComboboxOption/ComboboxOption';
import Token from '../Token/Token';
import loadingGif from '../spinner.gif';
import './MultiSelect.scss'

export default class MultiSelect extends Component {
    static propTypes = {
        selected: PropTypes.array.isRequired,
        showListOnFocus: PropTypes.bool,
        placeholder: PropTypes.string,
        isDisabled: PropTypes.bool,
        options: PropTypes.any,
        onChange: PropTypes.func
    };


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

    handleRemove = (value) => {
        if (typeof value === 'undefined') {
            return;
        }
        const input = this.comboLi.querySelector('input');
        input.focus();
        const options = this.state.options.map((state) => {
            if (state.value === value.value) {
                state.isSelected = false;
            }
            return state;
        });
        const selectedOptions = uniq(without(this.props.selected, value));
        this.props.onChange(selectedOptions);
        this.setState({ options });
    };

    handleSelect = (value) => {
        const options = this.state.options.map((state) => {
            if (state.value === value.value) {
                state.isSelected = true;
            }
            return state;
        });
        const selected = uniq(this.props.selected.concat([value]));
        this.setState({
            selectedToken: null,
            options
        });

        this.props.onChange(selected)
    };

    handleInput = (userInput) => {
        this.setState({
            input: userInput,
            loading: true,
            options: []
        });
        setTimeout(() => {
            this.filterTags(this.state.input);
            this.setState({
                loading: false
            })
        }, 500)
    };

    filterTags = (userInput) => {
        if (userInput === '')
            return this.setState({ options: [] });
        const filter = new RegExp('^' + userInput, 'i');
        const filteredNames = this.props.options.filter((state) => {
            return filter.test(state.label);
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
        const isDisabled = this.props.isDisabled;
        const tokens = this.props.selected.map((token) => {
            return (
                <Token
                    onFocus={this.handleFocus}
                    onRemove={this.handleRemove}
                    value={token}
                    name={token.label}
                    isDisabled={isDisabled}
                    key={token.value} />
            );
        });

        const options = this.state.options.length ?
            this.renderComboboxOptions() : [];

        const loadingComponent = (
            <img src={loadingGif} />
        );

        return (
            <ul className={cn('tokens', {
                'tokens-disabled': isDisabled
            })} onClick={this.handleClick}>
                {tokens}
                <li className="inline-flex" ref={e => this.comboLi = e}>
                    <Combobox
                        id={this.props.value}
                        showListOnFocus={this.props.showListOnFocus}
                        ariaDisabled={isDisabled}
                        onFocus={this.handleFocus}
                        onInput={this.handleInput}
                        onSelect={this.handleSelect}
                        onRemoveLast={this.handleRemoveLast}
                        value={this.state.selectedToken}
                        isDisabled={isDisabled}
                        placeholder={this.props.placeholder}>
                        {options}
                    </Combobox>
                </li>
                {this.state.loading && <li className="combobox-loading">
                    {loadingComponent}
                </li>}
            </ul>
        );
    }
}

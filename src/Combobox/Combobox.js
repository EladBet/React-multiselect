import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import ComboboxOption from '../ComboboxOption/ComboboxOption';
import './Combobox.scss'

var k = function () {
};
var guid = 0;

export default class Combobox extends Component {
    static propTypes = {
        onFocus: PropTypes.func,
        onInput: PropTypes.func,
        onSelect: PropTypes.func,
        placeholder: PropTypes.string
    };

    static defaultProps = {
        autocomplete: 'both',
        onFocus: k,
        onInput: k,
        onSelect: k,
        value: null,
        showListOnFocus: false
    };

    componentWillMount() {
        this.setState({ menu: this.makeMenu(this.props.children) });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            menu: this.makeMenu(newProps.children)
        }, () => {
            if (newProps.children.length && (this.isOpen || document.activeElement === this.input)) {
                if (!this.state.menu.children.length) {
                    return
                }
                this.setState({
                    isOpen: true
                }, () => {
                    this.list.scrollTop = 0;
                })
            } else {
                this.hideList();
            }

        });
    }

    makeMenu = (children) => {
        let activedescendant;
        let isEmpty = true;
        const _children = React.Children.map(children, (child, index) => {
            if (child.type !== ComboboxOption || !child.props.isFocusable) {
                // allow random elements to live in this list
                return child;
            }
            isEmpty = false;
            const props = child.props;
            const newProps = {};
            if (this.state.value === child.props.value) {
                // need an ID for WAI-ARIA
                newProps.id = props.id || 'combobox-selected-' + (++guid);
                newProps.isSelected = true;
                activedescendant = props.id;
            }
            newProps.onBlur = this.handleOptionBlur;
            newProps.onClick = this.selectOption.bind(this, child);
            newProps.onFocus = this.handleOptionFocus;
            newProps.onKeyDown = this.handleOptionKeyDown.bind(this, child);
            newProps.onMouseEnter = this.handleOptionMouseEnter.bind(this, index);

            return React.cloneElement(child, newProps);
        });

        return {
            children: _children,
            activedescendant: activedescendant,
            isEmpty: isEmpty
        };
    };

    /**
     * When the user begins typing again we need to clear out any state that has
     * to do with an existing or potential selection.
     */
    clearSelectedState = (cb) => {
        this.setState({
            focusedIndex: null,
            inputValue: null,
            value: null,
            activedescendant: null
        }, cb);
    };

    handleInputChange = () => {
        const value = this.input.value;
        this.clearSelectedState(() => {
            this.props.onInput(value);
        });
    };

    handleInputFocus = () => {
        this.props.onFocus();
        this.maybeShowList();
    };

    handleInputClick = () => {
        this.maybeShowList();
    };

    maybeShowList = () => {
        if (this.props.showListOnFocus) {
            this.showList()
        }
    };

    handleInputBlur = () => {
        const focusedAnOption = this.state.focusedIndex != null;
        if (focusedAnOption)
            return;
        this.hideList();
    };

    handleOptionBlur = () => {
        // don't want to hide the list if we focused another option
        this.blurTimer = setTimeout(this.hideList, 0);
    };

    handleOptionFocus = () => {
        // see `handleOptionBlur`
        clearTimeout(this.blurTimer);
    };

    handleButtonClick = () => {
        this.state.isOpen ? this.hideList() : this.showList();
        this.focusInput();
    };

    showList = () => {
        if (!this.state.menu.children.length) {
            return
        }
        this.setState({ isOpen: true })
    };

    hideList = () => {
        this.setState({
            isOpen: false,
            focusedIndex: null
        });
    };

    hideOnEscape = (event) => {
        this.hideList();
        this.focusInput();
        event.preventDefault();
    };

    focusInput = () => {
        this.input.focus();
    };

    selectInput = () => {
        this.input.select();
    };

    inputKeydownMap = {
        8: 'removeLastToken', // delete
        13: 'selectOnEnter', // enter
        27: 'hideOnEscape', // escape
        38: 'focusPrevious', // up arrow
        40: 'focusNext' // down arrow
    };

    optionKeydownMap = {
        13: 'selectOption',
        27: 'hideOnEscape',
        38: 'focusPrevious',
        40: 'focusNext'
    };

    handleKeydown = (event) => {
        const handlerName = this.inputKeydownMap[event.keyCode];
        if (!handlerName)
            return;
        this.setState({ usingKeyboard: true });
        return this[handlerName].call(this, event);
    };

    handleOptionKeyDown = (child, event) => {
        const handlerName = this.optionKeydownMap[event.keyCode];
        if (!handlerName) {
            // if the user starts typing again while focused on an option, move focus
            // to the input, select so it wipes out any existing value
            this.selectInput();
            return;
        }
        event.preventDefault();
        this.setState({ usingKeyboard: true });
        this[handlerName].call(this, child);
    };

    handleOptionMouseEnter = (index) => {
        if (this.state.usingKeyboard)
            this.setState({ usingKeyboard: false });
        else
            this.focusOptionAtIndex(index);
    };

    selectOnEnter = (event) => {
        event.preventDefault();
    };

    selectOption = (child, options) => {
        options = options || {};
        this.props.onSelect(child.props.value, child);
        this.hideList();
        this.clearSelectedState();
        if (options.focus !== false)
            this.selectInput();
        this.input.value = '';
    };

    selectText = () => {
        var value = this.input.value;
        if (!value) return;
        this.props.onSelect(value);
        this.clearSelectedState();
        this.input.value = '';
    };

    focusNext = (event) => {
        if (event.preventDefault) event.preventDefault();
        if (this.state.menu.isEmpty) return;
        const index = this.nextFocusableIndex(this.state.focusedIndex);
        this.focusOptionAtIndex(index);
    };

    removeLastToken = () => {
        if (this.props.onRemoveLast && !this.input.value) {
            this.props.onRemoveLast()
        }
        return true
    };

    focusPrevious = (event) => {
        if (event.preventDefault) event.preventDefault();
        if (this.state.menu.isEmpty) return;
        const index = this.previousFocusableIndex(this.state.focusedIndex)
        this.focusOptionAtIndex(index);
    };

    focusSelectedOption = () => {
        let selectedIndex = -1;
        React.Children.forEach(this.props.children, (child, index) => {
            if (child.props.value === this.state.value)
                selectedIndex = index;
        });
        this.showList();
        this.setState({
            focusedIndex: selectedIndex
        }, this.focusOption);
    };

    findInitialInputValue = () => {
        let inputValue = '';
        React.Children.forEach(this.props.children, (child) => {
            if (child.props.value === this.props.value)
                inputValue = getLabel(child);
        });
        return inputValue;
    };

    clampIndex = (index) => {
        if (index < 0) {
            return this.props.children.length - 1
        } else if (index >= this.props.children.length) {
            return 0
        }
        return index
    };

    scanForFocusableIndex = (index, increment) => {
        if (index === null || index === undefined) {
            index = increment > 0 ? this.clampIndex(-1) : 0
        }
        let newIndex = index;
        while (true) {
            newIndex = this.clampIndex(newIndex + increment)
            if (newIndex === index ||
                this.props.children[newIndex].props.isFocusable) {
                return newIndex
            }
        }
    };

    nextFocusableIndex = (index) => {
        return this.scanForFocusableIndex(index, 1)
    };

    previousFocusableIndex = (index) => {
        return this.scanForFocusableIndex(index, -1)
    };

    focusOptionAtIndex = (index) => {
        if (!this.state.isOpen && this.state.value)
            return this.focusSelectedOption();
        this.showList();
        let length = this.props.children.length;
        if (index === -1)
            index = length - 1;
        else if (index === length)
            index = 0;
        this.setState({
            focusedIndex: index
        }, this.focusOption);
    };

    focusOption = () => {
        const index = this.state.focusedIndex;
        this.list.childNodes[index].focus();
    };

    state = {
        value: this.props.value,
        // the value displayed in the input
        inputValue: this.findInitialInputValue(),
        isOpen: false,
        focusedIndex: null,
        // this prevents crazy jumpiness since we focus options on mouseenter
        usingKeyboard: false,
        activedescendant: null,
        listId: 'combobox-list-' + (++guid),
        menu: {
            children: [],
            activedescendant: null,
            isEmpty: true
        }
    };

    render() {
        return (
            <div className={cn('combobox', {'combobox-is-open': this.state.isOpen})}>
                {this.props.value}
                {this.state.inputValue}
                <input
                    ref={e => this.input = e}
                    autoComplete="off"
                    spellCheck="false"
                    aria-label="Start typing to search. "
                    aria-expanded={this.state.isOpen + ''}
                    aria-haspopup="true"
                    aria-activedescendant={this.state.menu.activedescendant}
                    aria-autocomplete="list"
                    aria-owns={this.state.listId}
                    id={this.props.id}
                    disabled={this.props.isDisabled}
                    className="combobox-input"
                    onFocus={this.handleInputFocus}
                    onClick={this.handleInputClick}
                    onChange={this.handleInputChange}
                    onBlur={this.handleInputBlur}
                    onKeyDown={this.handleKeydown}
                    placeholder={this.props.placeholder}
                    role="combobox" />
                <span
                    aria-hidden="true"
                    className="combobox-button"
                    onClick={this.handleButtonClick}>
          ▾
                </span>
                <div
                    id={this.state.listId}
                    ref={e => this.list = e}
                    className="combobox-list"
                    role="listbox">
                    {this.state.menu.children}
                </div>
            </div>
        );
    }
}

function getLabel(component) {
    return component.props.label || component.props.children;
}

function matchFragment(userInput, firstChildLabel) {
    userInput = userInput.toLowerCase();
    firstChildLabel = firstChildLabel.toLowerCase();
    if (userInput === '' || userInput === firstChildLabel)
        return false;
    if (firstChildLabel.toLowerCase().indexOf(userInput.toLowerCase()) === -1)
        return false;
    return true;
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addClass } from './AddClass.service';

export default class ComboboxOption extends Component {
    static propTypes = {
        value: PropTypes.any.isRequired,
        label: PropTypes.string,
        isFocusable: PropTypes.bool
    };

    static defaultProps = {
        role: 'option',
        tabIndex: '-1',
        className: 'ic-tokeninput-option',
        isSelected: false,
        isFocusable: true
    };

    render() {
        var data = Object.assign({}, this.props);
        if (data.isSelected) {
            data.className = addClass(this.props.className, 'ic-tokeninput-selected');
            data.ariaSelected = true;
        }
        return (
            <div {...data} />
        );
    }
}

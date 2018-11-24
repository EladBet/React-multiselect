import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addClass } from './AddClass.service';

export default class ComboboxOption extends Component {
    static propTypes = {

        /**
         * The value that will be sent to the `onSelect` handler of the
         * parent Combobox.
         */
        value: PropTypes.any.isRequired,

        /**
         * What value to put into the input element when this option is
         * selected, defaults to its children coerced to a string.
         */
        label: PropTypes.string,

        /**
         * Whether the element should be selectable
         */
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
        var props = this.props;
        if (props.isSelected) {
            props.className = addClass(props.className, 'ic-tokeninput-selected');
            props.ariaSelected = true;
        }
        return (
            <div {...props} />
        );
    }
}

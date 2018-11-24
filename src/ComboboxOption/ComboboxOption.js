import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ComboboxOption.scss';
import cn from 'classnames';

export default class ComboboxOption extends Component {
    static propTypes = {
        value: PropTypes.any.isRequired,
        label: PropTypes.string,
        isFocusable: PropTypes.bool,
        isSelected: PropTypes.bool
    };

    static defaultProps = {
        role: 'option',
        tabIndex: '-1',
        isFocusable: true
    };

    render() {
        var data = Object.assign({}, this.props);
        data.className = cn('combobox-option', {
            'combobox-option-selected': data.isSelected || data.value.isSelected
        });
        if (data.isSelected || data.value.isSelected) {
            data.ariaSelected = true;
        }
        return (
            <div {...data} />
        );
    }
}

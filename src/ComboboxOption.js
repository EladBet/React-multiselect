import React, { Component } from 'react';
import { addClass } from './AddClass.service';

export default class ComboboxOption extends Component {
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

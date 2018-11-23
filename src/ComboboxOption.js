import React, { Component } from 'react';
import { addClass } from './AddClass.service';

export default class ComboboxOption extends Component {
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

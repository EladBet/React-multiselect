import React, { Component } from 'react';

export default class Token extends Component {
    handleClick = () => {
        this.props.onRemove(this.props.value)
    };

    handleKeyDown = (key) => {
        var enterKey = 13;
        if (key.keyCode === enterKey) this.props.onRemove(this.props.value)
    };

    render() {
        return (
            <li className="ic-token inline-flex">
            <span className="ic-token-label">
              {this.props.name}
            </span>
            <span
                role="button"
                onClick={this.handleClick}
                onFocus={this.props.onFocus}
                onKeyDown={this.handleKeyDown}
                className="ic-token-delete-button"
                tabIndex={0}>
            ✕
            </span>
            </li>
        );
    }
}

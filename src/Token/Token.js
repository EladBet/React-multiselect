import React, { Component } from 'react';
import './Token.scss';

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
            <li className="token">
            <span className="token-label">
              {this.props.name}
            </span>
            <span
                role="button"
                onClick={!this.props.isDisabled && this.handleClick}
                onFocus={this.props.onFocus}
                onKeyDown={this.handleKeyDown}
                className="token-delete-button"
                tabIndex={0}>
            ✕
            </span>
            </li>
        );
    }
}

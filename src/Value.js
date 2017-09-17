import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Value extends React.Component {

	constructor(props) {
		super(props);

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.handleTouchEndRemove = this.handleTouchEndRemove.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.shouldShowRemoveIcon = this.shouldShowRemoveIcon.bind(this);
		this.getCustomClass = this.getCustomClass.bind(this);
	}

	handleMouseDown (event) {
		if (event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		if (this.props.onClick) {
			event.stopPropagation();
			this.props.onClick(this.props.value, event);
			return;
		}
		if (this.props.value.href) {
			event.stopPropagation();
		}
	}

	onRemove (event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onRemove(this.props.value);
	}

	handleTouchEndRemove (event){
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Fire the mouse events
		this.onRemove(event);
	}

	handleTouchMove (event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	}

	handleTouchStart (event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	}

	renderRemoveIcon () {
		if (this.props.disabled || !this.props.onRemove) return;
		return (
			<span className="Select-value-icon"
				aria-hidden="true"
				onMouseDown={this.onRemove}
				onTouchEnd={this.handleTouchEndRemove}
				onTouchStart={this.handleTouchStart}
				onTouchMove={this.handleTouchMove}>
				&times;
			</span>
		);
	}

	renderLabel () {
		let className = 'Select-value-label';
		return this.props.onClick || this.props.value.href ? (
			<a className={className} href={this.props.value.href} target={this.props.value.target} onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
				{this.props.children}
			</a>
		) : (
			<span className={className} role="option" aria-selected="true" id={this.props.id}>
				{this.props.children}
			</span>
		);
	}

	shouldShowRemoveIcon () {
		// if (this.props.value.type && ["_bracket_", "_operator_"].includes(this.props.value.type)) {
		// 	return false;
		// }
		return !this.props.isAdvancedModeOn;
	}

    getCustomClass () {
		const type = this.props.value.type;

        switch (type) {
            case '_bracket_':
                return "Select-value-bracket";
                break;

            case '_operator_':
                return "Select-value-operator";
                break;

            case '_equal_':
                return "Select-value-equal";
                break;

			default:
				return "";
        }
	}

	render () {
		return (
			<div className={classNames('Select-value', this.props.value.className, this.getCustomClass())}
				style={this.props.value.style}
				title={this.props.value.title}
				>
				{this.shouldShowRemoveIcon() && this.renderRemoveIcon()}
				{this.renderLabel()}
			</div>
		);
	}

};

Value.propTypes = {
	children: PropTypes.node,
	disabled: PropTypes.bool,               // disabled prop passed to ReactSelect
	id: PropTypes.string,                   // Unique id for the value - used for aria
	onClick: PropTypes.func,                // method to handle click on value label
	onRemove: PropTypes.func,               // method to handle removal of the value
	value: PropTypes.object.isRequired,     // the option object for this value
    isAdvancedModeOn: PropTypes.bool.isRequired
};

export default Value;

import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

const STATES = require('../data/states');

const testData = require('../utils/testdata.json');
const selectValueData = require('../utils/selectValueData.json');
const queryParser = require('../utils/queryParser');

var StatesField = createClass({
	displayName: 'StatesField',
	propTypes: {
		label: PropTypes.string,
		searchable: PropTypes.bool,
	},
	getDefaultProps () {
		return {
			label: 'States:',
			searchable: true,
		};
	},
	getInitialState () {
		return {
			country: 'AU',
			disabled: false,
			searchable: this.props.searchable,
			selectValue: 'new-south-wales',
			clearable: true,
			tests: testData.tests
		};
	},
	switchCountry (e) {
		var newCountry = e.target.value;
		console.log('Country changed to ' + newCountry);
		this.setState({
			country: newCountry,
			selectValue: null
		});
	},
	updateValue (newValue) {
	    const tests = queryParser(newValue, testData.tests);
	    console.log((Object.keys(tests).reduce(function (accum, each) {
	    	return !!tests[each] ? accum.concat([each]) : accum;
		}, [])).join(', '));
		this.setState({
			selectValue: newValue,
			passingTests: tests
			// tests: tests ||
		});
	},
	focusStateSelect () {
		this.refs.stateSelect.focus();
	},
	toggleCheckbox (e) {
		let newState = {};
		newState[e.target.name] = e.target.checked;
		this.setState(newState);
	},
	render () {
		var options = selectValueData;

		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>

				<div style={{ marginTop: 14 }}>
					<button type="button" onClick={this.focusStateSelect}>Focus Select</button>
					<label className="checkbox" style={{ marginLeft: 10 }}>
						<input type="checkbox" className="checkbox-control" name="searchable" checked={this.state.searchable} onChange={this.toggleCheckbox}/>
						<span className="checkbox-label">Searchable</span>
					</label>
					<label className="checkbox" style={{ marginLeft: 10 }}>
						<input type="checkbox" className="checkbox-control" name="disabled" checked={this.state.disabled} onChange={this.toggleCheckbox}/>
						<span className="checkbox-label">Disabled</span>
					</label>
					<label className="checkbox" style={{ marginLeft: 10 }}>
						<input type="checkbox" className="checkbox-control" name="clearable" checked={this.state.clearable} onChange={this.toggleCheckbox}/>
						<span className="checkbox-label">Clearable</span>
					</label>
				</div>
				<div className="checkbox-list">
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={this.state.country === 'AU'} value="AU" onChange={this.switchCountry}/>
						<span className="checkbox-label">Australia</span>
					</label>
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={this.state.country === 'US'} value="US" onChange={this.switchCountry}/>
						<span className="checkbox-label">United States</span>
					</label>
				</div>


				<Select
					options={options}
					multi
					onChange={this.updateValue}
					value={this.state.selectValue}
					isOptionUnique={e => true}
					advancedMode
				/>

				<br/>
				{this.state.tests.map(function (each) {
					return (<div>{each.title}</div>);
				})}
				<br/>

			</div>
		);
	}
});


module.exports = StatesField;

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
			tests: testData.tests,
            passingTests: Object.keys(testData.tests).reduce((accum, val, index) => {
                accum[index] = true;
                return accum;
            }, {})
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
		var passingTests = this.state.passingTests;

		return (
			<div className="section">

				<Select
					options={options}
					multi
					onChange={this.updateValue}
					value={this.state.selectValue}
					isOptionUnique={e => true}
					advancedMode
				/>

				<br/>

				{this.state.tests.map(function (each, index) {
					if (passingTests[index + 1]) {
						return (<div>{each.title}</div>);
					}

				})}

				<br/>

			</div>
		);
	}
});


module.exports = StatesField;

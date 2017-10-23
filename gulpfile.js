var gulp = require('gulp');
var initGulpTasks = require('react-component-gulp-tasks');

var taskConfig = {

	component: {
		name: 'Select',
		dependencies: [
			'classnames',
			'react-input-autosize',
			'react',
			'react-dom',
			'create-react-class',
			'prop-types'
		],
		less: {
			path: 'less',
			entry: 'default.less'
		}
	}
};

initGulpTasks(gulp, taskConfig);

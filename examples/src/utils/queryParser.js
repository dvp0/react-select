//( address-failure AND canceled-buyer-pass-on-offer ) OR balance-due OR ( canceled-fraud OR canceled-HVPD ) OR canceled-outdibbed

// var tags = [
//     {
//         //0
//         "value": "_(_",
//         "label": "(",
//         "type": "_bracket_",
//         "className": "hidden-option"
//     }, {
//         //1
//         "value": "address-failure",
//         "label": "address-failure"
//     }, {
//         //2
//         "value": "_AND_",
//         "label": "AND",
//         "type": "_operator_",
//         "className": "hidden-option"
//     }, {
//
//         //3
//         "value": "canceled-buyer-pass-on-offer",
//         "label": "canceled-buyer-pass-on-offer"
//     }, {
//         //4
//         "value": "_)_",
//         "label": ")",
//         "type": "_bracket_",
//         "className": "hidden-option"
//     }, {
//         //5
//         "value": "_OR_",
//         "label": "OR",
//         "type": "_operator_",
//         "className": "hidden-option"
//     }, {
//
//         //6
//         "value": "balance-due",
//         "label": "balance-due"
//     }, {
//         //7
//         "value": "_OR_",
//         "label": "OR",
//         "type": "_operator_",
//         "className": "hidden-option"
//     }, {
//         //8
//         "value": "_(_",
//         "label": "(",
//         "type": "_bracket_",
//         "className": "hidden-option"
//     }, {
//         //9
//         "value": "canceled-fraud",
//         "label": "canceled-fraud"
//     }, {
//         //10
//         "value": "_OR_",
//         "label": "OR",
//         "type": "_operator_",
//         "className": "hidden-option"
//     }, {
//         //11
//         "value": "canceled-HVPD",
//         "label": "canceled-HVPD"
//     }, {
//         //12
//         "value": "_)_",
//         "label": ")",
//         "type": "_bracket_",
//         "className": "hidden-option"
//     }, {
//         //13
//         "value": "_OR_",
//         "label": "OR",
//         "type": "_operator_",
//         "className": "hidden-option"
//     }, {
//         //14
//         "value": "canceled-outdibbed",
//         "label": "canceled-outdibbed"
//     }];

var operatorsMap = {
    "_OR_": "||",
    "_AND_": "&&"
};


var check = function (collection, tests) {
    var operatorsMapIndexWise = {};
    var brackets = 0;
    var subSets = [];
    var subSetStart = 0;
    var subSetEnd = 0;
    var createSubset = function () {
        if (subSetStart <= subSetEnd) {
            subSets.push({
                start: subSetStart,
                end: subSetEnd
            });
        }
        subSetStart = subSetEnd + 1;
    };

    // (one && two) || three
    // 0-4 6-6
    // one && two
    // 0-0 2-2

    collection.forEach(function (val, index) {

        if (val.value === '_(_') {

            brackets++;
            if (brackets === 1) {
                subSetStart = index + 1;
            }

        } else if (val.value === '_)_') {

            brackets--;
            if (brackets === 0) {
                subSetEnd = index - 1;
                createSubset();
            }

        } else if (val.type && val.type === '_operator_') {

            operatorsMapIndexWise[index] = operatorsMap[val.value];

            if (brackets === 0) {

                subSetEnd = index - 1;
                createSubset();

                if (index < collection.length - 1 && !!collection[index + 1]) {
                    subSetStart = index + 1;
                }
            }

        }

        if (index === collection.length - 1) {
            subSetEnd = index;
            createSubset();
        }

    });


    if (subSets.length === 1 && collection.length <= 2) {
        var properValue = collection.find(function (each) {
            return each.type !== '_bracket_';
        });

        var result = tests.reduce(function (accum, each, index) {
            accum[index + 1] = properValue ? (each.tags || []).includes(properValue.value) : true;
            return accum;
        }, {});

        return result;
    } else {
        var initialResultSet = {};

        tests.forEach(function (each, index) {
            initialResultSet[index + 1] = true;
        });

        var result = subSets.reduce(function (resultSet, eachSubSet) {
            var cloneCollection = collection.slice();
            var subCollection = cloneCollection.splice(eachSubSet.start, eachSubSet.start === eachSubSet.end ? 1 : eachSubSet.end - eachSubSet.start + 1);
            var subChecked = check(subCollection, tests);
            var nestedResult = {};

            Object.keys(subChecked).map(function (index) {
                var operator = operatorsMapIndexWise[eachSubSet.start - 1] || '&&';
                nestedResult[index] = eval(resultSet[index] + operator + subChecked[index]);
            });

            return nestedResult;

        }, initialResultSet);

        return result;
    }

};


module.exports = check;

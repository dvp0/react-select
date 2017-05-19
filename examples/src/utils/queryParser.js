var operatorsMap = {
    "_OR_": "||",
    "_AND_": "&&"
};

var check = function (passedCollection, tests) {
    var operatorsMapIndexWise = {};
    var brackets = 0;
    var subSets = [];
    var subSetStart = 0;
    var subSetEnd = 0;
    var collection = Array.from(passedCollection);
    // var collection = firstElementIsEqual ? collectionClone.splice(0, 1) : collectionClone;
    var createSubset = function () {
        if (subSetStart <= subSetEnd) {
            subSets.push({
                start: subSetStart,
                end: subSetEnd
            });
        }
        subSetStart = subSetEnd + 1;
    };

    if (passedCollection.length > 0 && passedCollection[0]['type'] === "_equal_") {
        collection.splice(0, 1);
    }

    // (one && two) || three
    // 1-3 6-6
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

        // if (subSets.length === 1 && collection.length > 1) {
        //     subSets = collection.reduce(function (accum, val, index) {
        //         return accum.concat([{start: index, end: index}]);
        //     }, []);
        // }

    });


    if (subSets.length === 1 && collection.length <= 2) {

        // BASE-CASE
        // if only actual tag/element to compare to, which might have pre-post bracket/operator so get the actual value
        // and return map of 0-x tests true/false

        var properValue = collection.find(function (each) {
            return !(['_bracket_', '_operator_', '_equal_'].includes(each.type));
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
            var spliceEnd = eachSubSet.start === eachSubSet.end ? 1 : eachSubSet.end - eachSubSet.start + 1;
            var subCollection = cloneCollection.splice(eachSubSet.start, spliceEnd);
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

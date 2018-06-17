/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */

/**
 * Написать реализацию метода .myFilter, который работает
 * аналогично оригинальному
 * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */

Array.prototype.myFilter = function myFilter(cb, context) {
    var that = this;
    var array = that.slice();
    var list = [];
    var i;
    var j;
    var cbResult;
    var callback = cb.bind(context);
    var e = new Error("callback is not function");

    if (typeof callback !== "function") {
        throw e;
    }
    for (i = 0; i < array.length; i++) {
        if (array[i]) {
            cbResult = callback(array[i], i, array);
            i++;
            break
        }
    }
    if (cbResult === false) {
        return list;
    }
    if (cbResult === true || typeof cbResult === "string") {
        for (j = 0; j < array.length; j++) {
            list.push(array[j]);
        }
        return list;
    }
    list.push(cbResult);
    for (i; i < array.length; i++) {
        if (array[i]) {
            cbResult = callback(array[i], i, array);
            if (cbResult) {
                list.push(array[i]);
            }
        }
    }
    return list;
};

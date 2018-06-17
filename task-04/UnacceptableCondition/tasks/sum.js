/* exported sum */
/**
 * Написать фукнцию сумматор, которая будет работать
 * var s = sum();
 * console.log(s); // 0
 * console.log(s(1)); // 1
 * console.log(s(1)(2)); //3
 * console.log(s(3)(4)(5)); // 12
 * Число вызовов может быть неограниченым
 */
function sum(){
    var count  = arguments[0] || 0;
    var testSum = function getTestSum (arg) {
        return sum((arg || 0) + testSum);
    };
    testSum.valueOf = function getValue () {
        return count;
    };
    return testSum
}

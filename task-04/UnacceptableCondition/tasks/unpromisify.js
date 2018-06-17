/* exported unpromisify */
/**
 * Написать фукнцию обратную promisify
 *
 * она принимает фукнцию, которая возвращает результат в виде promise
 * и возвращает обертку работающую на error-first коллбэке
 */

function unpromisify (promisify) {
    var promise = promisify;
    var callback;
    var args;
    return function getUnpromisify () {
        args = [].slice.call(arguments);
        if(typeof args[args.length -1] === "function") {
            callback = args[args.length - 1];
            args.pop();
            promise.apply(this, args).then( function setApply(data){
                callback(null, data)
            }, function setData (data) {
                callback(data)
            });
            return;
        }
        promise()

    }
}
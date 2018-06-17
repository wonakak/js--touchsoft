/**
 * Написать реализацию eventBus в соответствии с тестами
 */


function EventBus () {
    this.callback = {}
}

EventBus.prototype.trigger = function trigger (a, b) {
    var i;
    var args = [].slice.call(arguments);
    args.shift();
    if(this.callback[a]) {
        for(i = 0; i < this.callback[a].length; i++ ) {
            this.callback[a][i].apply(this, args);
        }
    }
    return b;
};

EventBus.prototype.on = function on (a, b) {
    if(typeof b !== "function") {
        return;
    }
    if(!this.callback[a]) {
        this.callback[a] = [];
    }
    this.callback[a].push(b)
};

EventBus.prototype.off = function off (a, b) {
    var i;
    if(this.callback[a]) {
        for(i = 0; i < this.callback[a].length; i++) {
            if(this.callback[a][i] === b) {
                this.callback[a].splice(i, 1);
                break;
            }
        }
    }
};
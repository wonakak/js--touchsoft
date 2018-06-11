/**
 * Функция bind фиксирует контекст, так что
 * var o = { name: 'Bob' }
 * var greet = function() { console.log(this.name); }
 * var oGreet = bind(greet, o);
 * oGreet(); // 'Bob'
 */

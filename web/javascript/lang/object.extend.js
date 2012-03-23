Object.extend = function (SubClass, SuperClass) {

    var superPrototype = SuperClass.prototype;

    // apply the properties in the superclass prototype to the subclass
    for (var propertyName in superPrototype) {
        if (superPrototype.hasOwnProperty(propertyName)) {
            SubClass.prototype[propertyName] = superPrototype[propertyName];
        }
    }

    // make the original prototype available through a superclass variable
    SubClass.prototype.superclass = superPrototype;

};
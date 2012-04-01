Object.extend = function (SubClass, SuperClass) {

    function F() {}
    F.prototype = SuperClass.prototype;
    SubClass.prototype = new F();

    // make the original prototype available through a superclass variable
    SubClass.prototype.superclass = SuperClass.prototype;

};

Object.extend = function (SubClass, SuperClass) {
    function F() {}

    F.prototype = SuperClass.prototype;
    SubClass.prototype = new F();
    SubClass.prototype.constructor = SubClass;
    
    SubClass.superclass = SuperClass.prototype;

};

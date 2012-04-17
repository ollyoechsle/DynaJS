//Because Safari 5.1 doesn't have Function.bind
if (typeof(Function.prototype.bind) == 'undefined') {
	Function.prototype.bind = function(context) {
		var oldRef = this;
		return function() {
			return oldRef.apply(context || null, Array.prototype.slice.call(arguments));
		};
	}
}

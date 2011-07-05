String.prototype.toNumber = function() {
	return parseFloat(this);
}
String.prototype.toInteger = function() {
	return parseInt(this);
}
String.prototype.printf = function() {
	var string = this, args = arguments, index = 0;
	for(let [code,func] in {
		'%': function() '%',
		's': function(arg) arg.toString(),
		'd': function(arg) arg.toInteger(),
		'f': function(arg) arg.toNumber()
	}) {
		string = string.replace('%'+code,function(m) {
			return func(args[index++]);
		},'g');
	}
	return string;
};
[
	'String',
	'Number',
	'Undefined',
	'Function',
	'Array',
	'Object',
].forEach(function(type) {
	Object['is'+type] = function(test) {
		return Object.prototype.toString.call(test) === '[object %s]'.printf(type);
	};
});
Object.extend = function(dest,src) {
	for(var prop in src) {
		dest[prop] = src[prop]
	}
	return dest;
};
Function.meta = function(func,methods) {
	function construct() {
		if(this instanceof construct) {
			return func.apply(this,arguments);
		} else {
			return func.apply(new construct,arguments);
		}
	}
	for(var prop in methods) {
		if(Object.isFunction(methods[prop])) {
			if(methods[prop].length === 0) {
				construct[prop] = methods[prop];
			}
		} else {
			construct[prop] = methods[prop];
		}
		construct.prototype[prop] = methods[prop];
	}
	return construct;
}
exports._ = function _(constructor, that, args, names) {
	var r = {}, i = 0, l = names.length, offset = 0,
	blank = function(){};
	blank.prototype = constructor.prototype;
	if(that instanceof constructor) {
		r[names[0]] = that;
	} else {
		r[names[0]] = constructor.apply(new blank,args[0]);
		offset = 1;
	}
	for(; i<l-1; ++i) {
		r[names[i+1]] = args[i+offset];
	}
	r.arguments = args;
	return r;
}
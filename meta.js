String.prototype.toNumber = function() {
	return parseFloat(this);
};
String.prototype.toInteger = function(radix) {
	return parseInt(this,radix);
};
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
	'Arguments'
].forEach(function(type) {
	Object['is'+type] = function(test) {
		return Object.prototype.toString.call(test) === '[object %s]'.printf(type);
	};
});
Object.extend = function(dest,src) {
	for(var prop in src) {
		dest[prop] = src[prop];
	}
	return dest;
};
Function.prototype.create = function(args) {
	if(!(Object.isArray(args) || Object.isArguments(args))) {
		throw new TypeError("Argument to Function.prototype.new must be an array");
	}
	function blank(){}
	blank.prototype = this.prototype;
	return this.apply(new blank,args);
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
};
exports._ = function _(construct, that, args, names) {
	var that = {}, l = names.length, offset = 0;
	if(that instanceof construct) {
		that[names[0]] = that;
	} else {
		that[names[0]] = construct.create(args[0]);
		offset = 1;
	}
	for(let i=0; i<l-1; ++i) {
		that[names[i+1]] = args[i+offset];
	}
	that.arguments = args;
	return that;
};
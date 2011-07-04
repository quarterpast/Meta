Sometimes you just don't know if you want to write ```javascript (new Hash({a:1})).set('b',2);``` or ```javascript Hash({a:1}).set('b',2);``` or even ```javascript Hash.set({a:1},'b',2);```
##meta.js
lets you write objects where you can do all three. For example:
```javascript
exports.Hash = Function.meta(
	function(obj) {
		this.keys = [];
		this.values = [];
		for(let [k,v] in Iterator(obj)) {
			this.keys.push(k);
			this.values.push(v);
		}
	}, {
		__iterator__: function() {
			for each(let [i,k] in this.keys) {
				yield [k,this.values[i]];
			}
		},
		forEach: function() {
			var self = _(Hash,this,arguments,['object','callback','context']);
			self.object.keys.forEach(function(key,index) {
				self.callback.apply(self.context,[key,self.object.values[index],self.object]);
			});
			return self.object;
		},
		map: function() {
			var self = _(Hash,this,arguments,['object','callback','context']);
			self.object.keys.forEach(function(key,index) {
				var out = self.callback.apply(self.context,[key,self.object.values[index],self.object]);
				self.object.keys[index] = Object.isUndefined(out.key) ? out[0] : out.key;
				self.object.values[index] = Object.isUndefined(out.value) ? out[1] : out.value;
			});
			return self.object;
		},
		set: function() {
			var self = _(Hash,this,arguments,['object','key','value']),
			c = false;
			for(var i = 0, l = self.object.keys.length; i < l; i++) {
				if(self.object.keys[i] === self.key) {
					if(Object.isUndefined(self.value)) {
						self.object.keys.splice(i,1);
						self.object.values.splice(i,1);
						return self.object;
					}
					self.object.values[i] = self.value;
					c = true;
				}
			}
			if(!c) {
				self.object.keys.push(self.key);
				self.object.values.push(self.value);
			}
			return self.object;
		},
		get: function() {
			var self = _(Hash,this,arguments,['object','key']);
			for(var i = 0, l = self.object.keys.length; i < l; i++) {
				if(self.object.keys[i] === self.key) {
					return self.object.values[i];
				}
			}
			return undefined;
		},
		contains: function() {
			var self = _(Hash,this,arguments,['object','key']);
			return Object.isUndefined(self.object.get(self.key));
		}
	}
);
```

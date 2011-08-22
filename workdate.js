/*  WorkDate JavaScript Library version 1.0.1
 *  (c) 2009 Deni Santos <denixsi@gmail.com>
 *
 *  Dual licensed under the:
 *  GPLv3 (http://www.opensource.org/licenses/gpl-3.0.html) and 
 *  MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 * 
 *  This library is based on the Prototype framework.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *  Simulated PHP's date function is based on Jacob Wright <jacwright@gmail.com> implementation.
 *  For details, see the Jacob web site: http://jacwright.com/projects/javascript/date_format
 *
 *--------------------------------------------------------------------------*/
Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

Methods = {};
Methods.String = {
	strip: function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	
	empty: function() {
		return this == '';
	},
	
	noZero: function() {
		if ((this.length > 1) && (this.substr(0,1) == "0")) return this.substr(1);
		return this;
	},
	
	yesZero: function() {
		if (this < 10) return "0" + this;
		return this;
	}
};

Object.extend(String.prototype, Methods.String);

WorkDate = {
	isUndefined: function(object) {
		return typeof object == "undefined";
	},
	
	isDateTime: function(string) {
		if (string.strip().empty()) return false;
		var pattern = /^(([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/[1-2][0-9]\d{2} ([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d)$/;
		if (pattern.test(string))
			return this._complementTestDate(string);
		else
			return false;
	},
	
	isDate: function(string) {
		if (string.strip().empty()) return false;
		var pattern = /^([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/([1-2][0-9]\d{2})$/;
		if (pattern.test(string))
			return this._complementTestDate(string);
		else
			return false;
	},
	
	isTime: function(string) {
		if (string.strip().empty()) return false;
		var pattern = /^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
		return pattern.test(string);
	},
	
	isLater : function(dataBase, dataTest) {
		return this.compareDate({baseDate: dataBase,testDate: dataTest,type: 'later'});
	},

	isEarlier : function(dataBase, dataTest) {
		return this.compareDate({baseDate: dataBase,testDate: dataTest,type: 'earlier'});
	},
	
	getDateTime : function(timestamp) {
		return this.getDateFormat('d/m/Y H:i:s', timestamp);
	},
	
	getDate: function(timestamp) {
		return this.getDateFormat('d/m/Y', timestamp);
	},
	
	getTime: function(timestamp) {
		return this.getDateFormat('H:i:s', timestamp);
	},
	
	RFC2822toTimeStamp: function(string) {
		var objDate = new Date(string);
		return (objDate.getTime() / 1000.0);
	},
	
	toTimeStamp : function(string) {
		string = string.strip() || '';
		if (!this.isDateTime(string.strip()))
			if (!this.isDate(string.strip()))
			 	return 0;
		
		var day =	 0;
		var month =	 0;
		var year =	 0;
		var hours =	 0;
		var minutes = 0;
		var seconds = 0;
		var hasTime = (string.indexOf(' ') != -1);
		if (hasTime) {
			var arrayString = string.split(' ');
			var arrayDate = arrayString[0].split('/');
			var arrayTime = arrayString[1].split(':');
		} else {
			var arrayDate = string.split('/');
		}
		day = 	parseInt(arrayDate[0].noZero());
		month = parseInt(arrayDate[1].noZero()) - 1;
		year = 	parseInt(arrayDate[2].noZero());
		if (hasTime) {
			hours =	 parseInt(arrayTime[0].noZero());
			minutes = parseInt(arrayTime[1].noZero());
			seconds = parseInt(arrayTime[2].noZero());
		}
		var objDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
		return (objDate.getTime() / 1000.0);
	},
	
	compareDate : function(options) {
		this.options = {
			baseDate: this.getDateTime(),
			testDate: this.getDateTime(),
			type:	  ''
		};
		Object.extend(this.options, options || { });
		switch (this.options.type) {
			case 'later':
				var operator = '>';
			break;
			case 'later-equal':
				var operator = '>=';
			break;
			case 'earlier':
				var operator = '<';
			break;
			case 'earlier-equal':
				var operator = '<=';
			break;
			default:
				var operator = '==';
			break;
		}
		return eval(this.toTimeStamp(this.options.testDate) + operator + this.toTimeStamp(this.options.baseDate));
	},
	
	findDate : function(options) {
		this.options = {
			baseDate:	this.getDateTime(),
			findType:	'future',
			returnType: 'datetime',
			qtyDay:		0,
			qtyMonth:	0,
			qtyYear:	0,
			qtyHours:	0,
			qtyMinutes:	0,
			qtySeconds:	0
		};
		Object.extend(this.options, options || { });
		var objDate = new Date(this.toTimeStamp(this.options.baseDate) * 1000.0);
		switch (this.options.type) {
			case 'past':
				var operator = '-';
			break;
			default:
			case 'future':
				var operator = '+';
			break;
		}
		if (this.options.qtyDay) 
			objDate.setDate(eval(objDate.getUTCDate() + operator + parseInt(this.options.qtyDay)));
		if (this.options.qtyMonth)
			objDate.setMonth(eval(objDate.getUTCMonth() + operator + parseInt(this.options.qtyMonth)));
		if (this.options.qtyYear) 
			objDate.setFullYear(eval(objDate.getUTCFullYear() + operator + parseInt(this.options.qtyYear)));
		if (this.options.qtyHours) 
			objDate.setHours(eval(objDate.getUTCHours() + operator + parseInt(this.options.qtyHours)));
		if (this.options.qtyMinutes) 
			objDate.setMinutes(eval(objDate.getUTCMinutes() + operator + parseInt(this.options.qtyMinutes)));
		if (this.options.qtySeconds) 
			objDate.setSeconds(eval(objDate.getUTCSeconds() + operator + parseInt(this.options.qtySeconds)));
		
		if(this.returnType == 'datetime') 
			return this.getDateTime(this.RFC2822toTimeStamp(objDate.toGMTString()));
		else
			return this.getDate(this.RFC2822toTimeStamp(objDate.toGMTString()));
	},
	
	dateDiff: function(options) {
		this.options = {
			baseDate: this.getDate(),
			testDate: this.getDate()
		};
		Object.extend(this.options, options || { });
		var objBaseDate = new Date(this.toTimeStamp(this.options.baseDate) * 1000.0);
		var objTestDate = new Date(this.toTimeStamp(this.options.testDate) * 1000.0);
		return Math.abs(Math.round((objBaseDate-objTestDate)/86400000));
	},
	
	/* 
	 * Based on Jacob Wright <jacwright@gmail.com> implementation.
	 * For details, see the Jacob web site: http://jacwright.com/projects/javascript/date_format
	 *--------------------------------------------------------------------------*/
	getDateFormat: function(format, timestamp) {
		if (this.isUndefined(timestamp))
			var objDate = new Date();
		else
			var objDate = new Date(timestamp * 1000);
		
		var returnStr = '';
		var replace = Date.replaceChars;
		for (var i = 0, qty = format.length; i < qty; i++) {
			var curChar = format.charAt(i);
			if (replace[curChar])
				returnStr += replace[curChar].call(objDate);
			else
				returnStr += curChar;
		}
		return returnStr;
	},
	
	_complementTestDate: function(string) {
		var pattern = /^([0-2]\d|[3][0-1])\/([0]\d|[1][0-2])\/([1-2][0-9]\d{2}).*$/;
		var monthLong = /^1|3|5|7|8|10|12$/;
		var monthShort = /^4|6|9|11$/;
		
		if (pattern.test(string)) {
			var date = string.split(pattern);
			var day = parseInt(date[1].noZero());
			var month = parseInt(date[2].noZero());
			var year = parseInt(date[3]);
			
			if (monthLong.test(month))
				return (day <= 31);
			else if (monthShort.test(month))
				return (day <= 30);
			else
				if (!(year % 4) || !(year % 100) || !(year % 400))
					return (day <= 29);
				else
					return (day <= 28);
		} else {
			return false;
		}
	}
};

/* 
 * Based on Jacob Wright <jacwright@gmail.com> implementation.
 * For details, see the Jacob web site: http://jacwright.com/projects/javascript/date_format
 *--------------------------------------------------------------------------*/
Date.replaceChars = {
	shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mar', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
	longMonths: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'October', 'Novembro', 'Dezembro'],
	shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
	longDays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
	
	// Day
	d: function() { return this.getDate().toString().yesZero(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { return "N/D"; },
	// Week
	W: function() { return "N/D"; },
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() + 1).toString().yesZero(); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { return "N/D"; },
	// Year
	L: function() { return "N/D"; },
	o: function() { return "N/D"; },
	Y: function() { return this.getFullYear(); },
	y: function() { return this.getFullYear().toString().substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return "N/D"; },
	g: function() { return this.getHours() == 0 ? 12 : (this.getHours() > 12 ? this.getHours() - 12 : this.getHours()); },
	G: function() { return this.getHours(); },
	h: function() { return (this.getHours() < 10 ? this.getHours() + 1 : this.getHours() - 12).toString().yesZero(); },
	H: function() { return this.getHours().toString().yesZero(); },
	i: function() { return this.getMinutes().toString().yesZero(); },
	s: function() { return this.getSeconds().toString().yesZero(); },
	// Timezone
	e: function() { return "N/D"; },
	I: function() { return "N/D"; },
	O: function() { return (this.getTimezoneOffset() < 0 ? '-' : '+') + (this.getTimezoneOffset() / 60 < 10 ? '0' : '') + (this.getTimezoneOffset() / 60) + '00'; },
	T: function() { return "N/D"; },
	Z: function() { return this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return "N/D"; },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
}

"use strict";

var styles = {};
if (process.env.KCOLOR === 'DISABLED') {
	styles = {
		'bold'          : ['',''],
		'italic'        : ['',''],
		'underline'     : ['',''],
		'inverse'       : ['',''],
		'strikethrough' : ['',''],
		'white'         : ['',''],
		'whitelight'    : ['',''],
		'grey'          : ['',''],
		'greylight'     : ['',''],
		'black'         : ['',''],
		'blacklight'    : ['',''],
		'blue'          : ['',''],
		'bluelight'     : ['',''],
		'cyan'          : ['',''],
		'cyanlight'     : ['',''],
		'green'         : ['',''],
		'greenlight'    : ['',''],
		'magenta'       : ['',''],
		'magentalight'  : ['',''],
		'red'           : ['',''],
		'redlight'      : ['',''],
		'yellow'        : ['',''],
		'yellowlight'   : ['','']
	};
} else {
	styles = {
		'bold'          : ['\u001b[1m',    '\u001b[22m'],
		'italic'        : ['\u001b[3m',    '\u001b[23m'],
		'underline'     : ['\u001b[4m',    '\u001b[24m'],
		'inverse'       : ['\u001b[7m',    '\u001b[27m'],
		'strikethrough' : ['\u001b[9m',    '\u001b[29m'],
		'white'         : ['\u001b[37m',   '\u001b[39m'],
		'whitelight'    : ['\u001b[1;37m', '\u001b[0;39m'],
		'grey'          : ['\u001b[90m',   '\u001b[39m'],
		'greylight'     : ['\u001b[1;90m', '\u001b[0;39m'],
		'black'         : ['\u001b[30m',   '\u001b[39m'],
		'blacklight'    : ['\u001b[1;30m', '\u001b[0;39m'],
		'blue'          : ['\u001b[34m',   '\u001b[39m'],
		'bluelight'     : ['\u001b[1;34m', '\u001b[1;39m'],
		'cyan'          : ['\u001b[36m',   '\u001b[39m'],
		'cyanlight'     : ['\u001b[1;36m', '\u001b[0;39m'],
		'green'         : ['\u001b[32m',   '\u001b[39m'],
		'greenlight'    : ['\u001b[1;32m', '\u001b[0;39m'],
		'magenta'       : ['\u001b[35m',   '\u001b[0;39m'],
		'magentalight'  : ['\u001b[1;35m', '\u001b[39m'],
		'red'           : ['\u001b[31m',   '\u001b[39m'],
		'redlight'      : ['\u001b[1;31m', '\u001b[0;39m'],
		'yellow'        : ['\u001b[33m',   '\u001b[39m'],
		'yellowlight'   : ['\u001b[1;33m', '\u001b[39m']
	};
}
for (var k in styles) { if (styles.hasOwnProperty(k)) {
	(function (c) {
		String.prototype.__defineGetter__(c, function () {
			return styles[c][0] + this + styles[c][1];;
		});
	})(k);
}}

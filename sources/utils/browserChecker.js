module.exports = {
	isIe: function () {
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		return isIE;
	}
};
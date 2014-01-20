/* jshint browser: true, node: true, devel: true */
/* global dom: true, obj: true, Scope: true, io: true    */
/* exported kprox */
//===================================================================
//                        kprox.js
/**!
 * @license Copyright 2014 - KUBIDE ADVANCE WEB DEVELOPMENT, S.L.
 * @fileoverview    kprox.js KProx client
 * @author          Pablo Almunia
 * @version         0.1
 */
//===================================================================
var KProx;


/**
 * property:
 * - {boolean} ready (readonly)
 * - {boolean} connected (readonly)
 * methods:
 * - on()
 * - off()
 * - fire()
 * - newDocument()
 * - newKProx()
 * events:
 * - ready          - parameters: kproxObject
 * - connect        -
 * - disconnect     -
 * - newDocument    -
 */

KProx = function (server, card, fnReady) {

    "use strict";


  
/**
 * Object with check of type
 * @namespace is
 */
var is = (function() {

    "use strict";

    /**
     * Check if value is undefined
     * @name is.undef
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isUndefined(value){
        return typeof value === 'undefined';
    }
    /**
     * Check if value is defined
     * @name is.def
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isDefined(value){
        return typeof value !== 'undefined';
    }

    /**
     * Check if value is an object
     * @name is.obj
     * @method
     * @public
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isObject(value){
        return value !== null && (typeof value === 'object' || typeof value === 'function');
    }

    /**
     * Check if value is an array
     * @name is.arr
     * @method
     * @public
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    /**
     * Check if value is an array or an object with length
     * @name is.arrlike
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isArrayLike(value) {
        if (value === null || typeof value === 'undefined') {
            return false;
        }
        var length = value.length;
        if (/*value.nodeType === 1 && */length) {
            return true;
        }
        return isArray(value) || !isFunction(value) && (length === 0 || typeof length === "number" && length > 0 && (length - 1) in value);
    }

    /**
     * Check if value is a function
     * @name is.func
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isFunction(value){
        return typeof value === 'function';
    }

    /**
     * Check if value is a string
     * @name is.str
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isString(value){
        return typeof value === 'string';
    }

    /**
     * Check if value is a number
     * @name is.num
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isNumber(value){
        return typeof value === 'number';
    }

    /**
     * Check if value is a boolean
     * @name is.bool
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isBoolean(value) {
        return typeof value === 'boolean';
    }

    /**
     * Check if vale is a date object
     * @name is.date
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isDate(value){
        return value instanceof Date;
    }

    /**
     *
     * @name is.validName
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isValidName(value) {
        return typeof value === 'string' && null !== value.match(/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[\x24A-Z\x5Fa-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC][\x240-9A-Z\x5Fa-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]*$/);
    }


    /**
     * Check if value is a RegExp object
     * @name is.reg
     * @method
     * @param {*} value - value to check
     * @returns {boolean}
     */
    function isRegExp(value) {
        return value instanceof RegExp;
    }

    function isElement(value){
        return (
            typeof HTMLElement === "object" ?
                value instanceof HTMLElement :
                value && typeof value === "object" && value !== null && value.nodeType === 1 && typeof value.nodeName === "string"
            );
    }


    // Public interface
    return {
        undef: isUndefined,
        def: isDefined,
        obj: isObject,
        str: isString,
        num: isNumber,
        date: isDate,
        arr: isArray,
        arrlike: isArrayLike,
        func: isFunction,
        reg: isRegExp,
        bool: isBoolean,
        validName: isValidName,
        element: isElement
    };
})();
  
/**
 * obj helper
 * @namespace obj
 */
var obj = (function() {

    /* global is: true */

    "use strict";

    /**
     * clone a object into other
     * @name obj.clone
     * @method
     * @param {Object|Array} origin
     * @returns {Object}
     * @example
     * var copy = obj.clone(obj)
     */
    function clone(origin){
        if (origin === null || typeof(origin) === 'undefined' || typeof(origin) !== 'object') {
            return origin;
        }
        var copy;
        /* jshint -W053 */
        switch(Object.prototype.toString.call(origin)) {
            case '[object Date]':
                copy = new Date(origin.getTime());
                break;
            case '[object String]':
                copy = new String(origin.toString());
                var isString = true;
                break;
            case '[object Number]':
                copy = new Number(origin.toString());
                break;
            case  '[object Boolean]':
                copy = new Boolean(origin.toString());
                break;
            case '[object RegExp]':
                copy = new RegExp(origin.toString());
                break;
            case '[object Error]':
                copy = new Error(origin);
                break;
            default:
                copy = origin.constructor();
                if (typeof copy === 'undefined') {
                    copy = new origin.constructor();
                }
        }
        /* jshint +W053 */
        for(var key in origin) {
            if (origin.hasOwnProperty(key) && !(isString && !isNaN(parseInt(key, 10)))) {
                copy[key] = clone(origin[key]);
            }
        }
        if (origin[0] !== copy[0]) {
            copy[0] = origin[0];
        }
        return copy;
    }


    /**
     * extend an object with other
     * @name obj.extend
     * @method
     * @param {Object|Array} target
     * @param {Object|Array} origin
     * @returns {Object}
     * @example
     * var copy = obj.clone(obj)
     */
    function extend(target, origin){
        if (origin === null || typeof(origin) !== 'object') {
            return target;
        }
        for(var key in origin) {
            if (origin.hasOwnProperty(key)) {
                if (typeof origin[key] === 'object') {
                    target[key] = clone(origin[key]);
                } else {
                    target[key] = origin[key];
                }
            }
        }
        if (origin[0] !== target[0]) {
            target[0] = origin[0];
        }
        return target;
    }

    /**
     * Check the differences between origin and target object and return and array with the differences
     * @name obj.diff
     * @method
     * @param {object} origin
     * @param {object} target
     * @param {string} path
     * @returns {array} of objects with the structure
     * {
     *   'event': event, // 'add' or 'del' or 'edt'
     *   'key': path,    // path into the origin object
     *   'prv': prvdata, // previous data
     *   'lst': lstdata  // last data
     *  }
     *
     */
    function difference(origin, target, path) {
        var key, diff = [];
        if (typeof path === 'undefined') {
            path = '';
        }
        if (typeof origin !== typeof target || Object.prototype.toString.call(origin) !== Object.prototype.toString.call(target)) {
            if (typeof origin === 'undefined') {
                diff.push({'event': 'add', 'key': normalizeName(path), 'prv': origin, 'lst': target});
            } else if (typeof target === 'undefined') {
                diff.push({'event': 'del', 'key': normalizeName(path), 'prv': origin, 'lst': target});
            } else {
                diff.push({'event': 'edt', 'key': normalizeName(path), 'prv': origin, 'lst': target});
            }
            return diff;
        } else {
            if (origin instanceof Date && target instanceof Date) {
                if (origin.getTime() !== target.getTime() && !(isNaN(origin.getTime()) && isNaN(target.getTime()))) {
                    diff.push({'event': 'edt', 'key': normalizeName(path), 'prv': origin, 'lst': target});
                }
                return diff;
            } else if (origin instanceof Function && target instanceof Function) {
                if (origin.toString() !== target.toString()) {
                    diff.push({'event': 'edt', 'key': normalizeName(path), 'prv': origin, 'lst': target});
                }
                return diff;
            } else if (typeof origin !== 'object' || typeof target !== 'object') {
                if (origin !== target) {
                    diff.push({'event': 'edt', 'key': normalizeName(path), 'prv': origin, 'lst': target});
                }
            } else {
                /* jshint forin: false */
                for (key in origin) {
                    diff = diff.concat(difference(origin[key], target[key], path ? path + '.' + key : key));
                }
                for (key in target) {
                    if (!(key in origin)) {
                        diff.push({'event': 'add', 'key': normalizeName(path ? path + '.' + key : key), 'prv': origin[key], 'lst': target[key]});
                    }
                }
                /* jshint forin: true */
            }
        }
        return diff;
    }

    /**
     * loof for each for array and object
     * @name obj.forEach
     * @method
     * @param collection
     * @param fnCallback
     * @param [localThis]
     * @returns {*}
     */
    function forEach(collection, fnCallback, localThis) {
        var cKey;
        if (!collection || !fnCallback) {
            return collection;
        }
        if (collection.forEach) {
            collection.forEach(fnCallback, localThis);
        } else if (is.arrlike(collection)) {
            for (cKey = 0; cKey < collection.length; cKey++) {
                fnCallback.call(localThis, collection[cKey], cKey);
            }
        } else {
            for (cKey in collection) {
                if (collection.hasOwnProperty(cKey)) {
                    fnCallback.call(localThis, collection[cKey], cKey);
                }
            }
        }
        return collection;
    }

    /**
     * Normalize a deep object reference and convert dot notation to array notation when some reference has an invalid name
     * @name obj.normalizeName
     * @method
     * @param {string} path - deep object reference
     * @returns {string} - reference normalized
     * @public
     */
    function normalizeName(path) {
        if (!path) {
            return '';
        }
        var tags = path.replace(/\]|\"|\'/g,'').split(/\[|\./),
            normalized = '';
        for (var i = 0; i < tags.length; i++) {
            if (is.validName(tags[i])) {
                normalized += (normalized ? '.' : '') + tags[i];
            } else {
                normalized += '[' + (isNaN(parseInt(tags[i], 10)) ? '"' + tags[i] + '"' : tags[i])  + ']';
            }
        }
        return normalized;
    }

    /**
     * Set a value into an object with a path reference
     * @name obj.setDepth
     * @method
     * @param {object} origin
     * @param {string}path
     * @param {*} value
     * @return {*}
     * @public
     */
    function setDepth(origin, path, value) {
        if (!path) {
            return;
        }
        var tags = path.replace(/^\[|\]|\"|\'/g,'').split(/\[|\./),
            len = tags.length - 1;
        for (var i = 0; i < len; i++) {
            origin = origin[tags[i]] = origin[tags[i]] || {};
        }
        origin[tags[len]] = value;
        return origin[tags[len]];
    }
    /**
     * Get a value from an object with a path reference
     * @name obj.getDepth
     * @method
     * @param {object} obj
     * @param {string} path
     */
    function getDepth(obj, path) {
        return path.replace(/^\[|\]|\"|\'/g,'').split(/\[|\./).reduce(function(a,b) {
            return a[b];
        }, obj);
    }

    /**
     * Set a value into an object with a path reference
     * @name obj.setDepth
     * @method
     * @param {object} origin
     * @param {string}path
     * @return {*}
     * @public
     */
    function delDepth(origin, path) {
        if (!path) {
            return;
        }
        var tags = path.replace(/^\[|\]|\"|\'/g,'').split(/\[|\./),
            len = tags.length - 1;
        for (var i = 0; i < len; i++) {
            origin = origin[tags[i]];
        }
        delete origin[tags[len]];
    }

    return {
        clone: clone,
        diff: difference,
        extend: extend,
        forEach: forEach,
        delDepth: delDepth,
        setDepth: setDepth,
        getDepth: getDepth,
        normalizeName: normalizeName
    };
})();
  
/**
 * Created by palmun on 4/11/13.
 */
function Scope(initialData) {

    /* global obj: true */

    "use strict";

    var data = {};
    var events = {'change': [], 'edt': [], 'add': [], 'del': [], 'open': []};

    /**
     *
     * @param eventName
     * @param [fnCallback]
     */
    function on(eventName, fnCallback) {
        if (fnCallback) {
            // Add new event type
            if (!events[eventName]) {
                events[eventName] = [];
            }
            // Add event handler
            events[eventName].push(fnCallback);
            return scope;
        } else {
            return events[eventName];
        }
    }

    /**
     *
     * @param eventName
     * @param fnCallback
     */
    function off(eventName, fnCallback) {
        if (!fnCallback && events[eventName]) {
            events[eventName] = [];
        } else {
            for (var i = 0; i < events[eventName].length; i++) {
                if (events[eventName][i].toString() === fnCallback.toString()) {
                    events[eventName].splice(i, 1);
                    return scope;
                }
            }
        }
        return scope;
    }

    function fire() {
        var eventName = Array.prototype.shift.apply(arguments);
        var parameters = arguments;
        scope(function (model) {
            if (events[eventName]) {
                for (var i = 0; i < events[eventName].length; i++) {
                    events[eventName][i].apply(model, parameters);
                }
            }
        });
    }

    /**
     *
     * @param initialData
     */
    function init(initialData) {
        data = obj.clone(initialData);
    }

    function toString() {
        return '[object Scope]';
    }

    /**
     *
     * @param {function} fn
     * @param {*} [extra]
     */
    var copy;
    function scope(fn, extra) {
        copy = obj.clone(data);
        var returnValue;
        /* jshint validthis: true */
        returnValue = fn.call(this, data);
        /* jshint validthis: false */
        flush(extra);
        return returnValue;
    }
    function flush(extra) {
        var changes = obj.diff(copy, data);
        copy = obj.clone(data);
        for (var n = 0; n < changes.length; n++) {
            changes[n].extra = extra || {};
            fire('change', changes[n]);
            fire(changes[n].event, changes[n]);
        }
    }
    scope.init = init;
    scope.on = on;
    scope.off = off;
    scope.fire = fire;
    scope.scope = scope;
    scope.flush = flush;
    scope.toString = toString;

    init(initialData || {});

    return scope;
}
  
/**
 * dom helper functions
 */
var dom = (function () {

    /* global obj: true */

    "use strict";

    //=============================================================================
    // Private methods
    //=============================================================================

    function offset(element) {
        var docElem, win,
            elem = element,
            box = { top: 0, left: 0 },
            doc = elem && elem.ownerDocument;

        if ( !doc ) {
            return;
        }

        docElem = doc.documentElement;

        if ( typeof elem.getBoundingClientRect !== 'undefined') {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
//        console.log('box.top = ' + box.top);
//        console.log('win.pageYOffset = ' + win.pageYOffset);
//        console.log('docElem.clientTop = ' + docElem.clientTop);
//        console.log('box.left = ' + box.left);
//        console.log('win.pageXOffset = ' + win.pageXOffset);
//        console.log('docElem.clientLeft = ' + docElem.clientLeft);
//        console.log('box.bottom = ' + box.bottom);
//        console.log('win.pageYOffset = ' + win.pageYOffset);
//        console.log('docElem.clientTop = ' + docElem.clientTop);
//        console.log('box.right = ' + box.right);
//        console.log('win.pageXOffset = ' + win.pageXOffset);
//        console.log('docElem.clientLeft = ' + docElem.clientLeft);
//        console.log('box.right = ' + box.right);
//        console.log('box.left = ' + box.left);
//        console.log('box.bottom = ' + box.bottom);
//        console.log('box.top = ' + box.top);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft,
            bottom: box.bottom + win.pageYOffset - docElem.clientTop,
            right: box.right + win.pageXOffset - docElem.clientLeft,
            width: box.right - box.left,
            height: box.bottom - box.top
        };
    }
    function getWindow( elem ) {
        return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
    }
    function isWindow( obj ) {
        return obj !== null && obj === obj.window;
    }

    /**
     * return the element with querySelector
     * @private
     * @param selector
     * @returns {*}
     */
    function getElement(selector) {
        if (typeof selector === 'string') {
            try {
                return document.querySelector(selector);
            } catch(e) {
                return undefined;
            }
        } else {
            return selector;
        }
    }

    //=============================================================================
    /**
     * create a html element
     * @private
     * @param {string} html
     * @returns {HTMLElement}
     */
    //=============================================================================
    function createElements(html) {
        var div = document.createElement('div');
        div.innerHTML = '<div>&#160;</div>' + html;
        div.removeChild(div.firstChild);
        return div;
    }

    //=============================================================================
    /**
     * get the value from all types of form's element: input, select, textarea
     * @private
     * @param element
     * @returns {*}
     */
    //=============================================================================
    function getValue(element){
        var result = [];
        if (element.nodeName === 'SELECT' && element.multiple) {
            for (var i = 0; i < element.options.length; i++) {
                var option = element.options[i];
                if (option.selected) {
                    result.push(option.value || option.text);
                }
            }
            return result.length === 0 ? '' : result.length === 1 ? result[0] : result;
        } else if (element.nodeName === 'INPUT' && element.getAttribute('type') === 'checkbox') {
            return element.checked;
        } else if (element.nodeName === 'INPUT' && element.getAttribute('type') === 'radio') {
            var radios = document.getElementsByName(element.getAttribute('name'));
            radios = radios.length > 0 ? radios : element;
            if (radios.length) {
                for (var n = 0; n < radios.length; n++) {
                    var radio = radios[n];
                    if (radio.checked) {
                        return radio.value;
                    }
                }
                return undefined;
            } else {
                return element.checked ? element.value : undefined;
            }
        }
        return element.value;
    }

    //=============================================================================
    /**
     * set the value from all types of form's element: input, select, textarea
     * @private
     * @param element
     * @param value
     * @returns {*}
     */
    //=============================================================================
    function setValue(element, value) {
        if (element.nodeName === 'SELECT' && element.multiple) {
            for (var i = 0; i < element.options.length; i++) {
                var option = element.options[i];
                //TODO: Da un error en el select con un sólo valor
                //      no he conseguido reproducirlo
                if (value.indexOf(option.value) !== -1) {
                    if (!option.selected) {
                        option.selected = true;
                    }
                } else if (option.selected) {
                    option.selected = false;
                }
            }
        } else if (element.nodeName === 'INPUT' && element.getAttribute('type') === 'checkbox') {
            if (value && !element.checked) {
                element.checked = true;
            } else if (!value && element.checked) {
                element.checked = false;
            }
        } else if (element.nodeName === 'INPUT' && element.getAttribute('type') === 'radio') {
            var radios = document.getElementsByName(element.getAttribute('name'));
            radios = radios.length > 0 ? radios : element;
            /* jshint eqeqeq: false */
            if (radios.length) {
                for (var n = 0; n < radios.length; n++) {
                    var radio = radios[n];
                    if (radio.value == value && !radio.checked) {
                        radio.checked = true;
                    } else if (radio.value != value && radio.checked) {
                        radio.checked = false;
                    }
                }
            } else {
                if (element.value == value && !element.checked) {
                    element.checked = true;
                } else if (element.value != value && element.checked) {
                    element.checked = false;
                }
            }
            /* jshint eqeqeq: true */
        } else {
            element.value = value;
        }
        return element;
    }

    //=============================================================================
    // Public methods
    //=============================================================================

    //=============================================================================
    /**
     * navigate for all children of an elements and run the callback function
     * @param element
     * @param fn
     */
    //=============================================================================
    function treeEach(element, fn) {
        fn.call(element, element);
        obj.forEach(element.children, function(oElement) {
            treeEach(oElement, fn);
        });
    }

    //=============================================================================
    /**
     * add html element into the end of an element
     * @param element
     * @param html
     */
    //=============================================================================
    function append(element, html) {
        var elementRef = getElement(element);
        if (elementRef === null) {
            return null;
        }
        if (elementRef.nodeType === 1 || elementRef.nodeType === 11) {
            var newnodes = createElements(html);
            while (newnodes.childNodes.length) {
                elementRef.appendChild(newnodes.firstChild);
            }
        }
        return elementRef;
    }

    //=============================================================================
    /**
     * add html element into the first position to an element
     * @param elementRef
     * @param html
     */
    //=============================================================================
    function prepend(element, html) {
        var elementRef = getElement(element);
        if (elementRef === null) {
            return null;
        }
        if (elementRef.nodeType === 1) {
            var firstnode = elementRef.firstChild;
            var newnodes = createElements(html);
            while (newnodes.childNodes.length) {
                elementRef.insertBefore(newnodes.firstChild, firstnode);
            }
        }
        return elementRef;
    }


    //=============================================================================
    /**
     * get or set the value of a form element: input, select, textarea
     * This function check the parameters and call to getValue and setValue
     * @param element
     * @param value
     * @returns {*}
     */
    //=============================================================================
    function val(element, value) {
        var elementRef = getElement(element);
        if (elementRef === null) {
            return undefined;
        }
        if (typeof value === 'undefined') {
            return getValue(elementRef);
        } else {
            return setValue(elementRef, value);
        }
    }

    //=============================================================================
    /**
     * add an event handler for form's element fired when its value is changed
     * @param element
     * @param fnCallback
     */
    //=============================================================================
    function onChange(element, fnCallback) {
        if (element.tagName === 'SELECT') {
            element.addEventListener('change', fnCallback);
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            var msie = +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

            // type=radio or type=checkbox
            if (element.getAttribute('type') === 'radio' || element.getAttribute('type') === 'checkbox') {
                element.addEventListener('click', fnCallback);

            // IE9
            } else if (msie === 9) {
                element.addEventListener('change', fnCallback);
                element.addEventListener('keydown', function () {
                    var that = this;
                    setTimeout(function () {
                        fnCallback.apply(that);
                    }, 10);
                });
                element.addEventListener('paste', function () {
                    var that = this;
                    setTimeout(function () {
                        fnCallback.apply(that);
                    }, 10);
                });
                element.addEventListener('cut', function () {
                    var that = this;
                    setTimeout(function () {
                        fnCallback.apply(that);
                    }, 10);
                });

            // IE10 and IE11 with type=range
            } else if ((document.documentMode === 10 ||document.documentMode === 11) && element.getAttribute('type') === 'range') {
                element.addEventListener('change', fnCallback);

            // All elements
            } else {
                element.addEventListener('input', fnCallback);
            }
        }
    }

    /**
     *
     * @param element
     * @param fnCallback
     * @returns {*}
     */
    function onAttrModified(element, fnCallback) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (MutationObserver) {
            var options = {
                subtree: false,
                attributes: true
            };
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
                    fnCallback.call(e.target, e.attributeName);
                });
            });
            return observer.observe(element, options);
        } else {
            return element.addEventListener('DOMAttrModified', function(e) {
                fnCallback.call(this, e.attrName);
            });
        }
    }

    //=============================================================================
    /**
     * load dynamically javascript file
     * @name dom.loadScript
     * @param {string}    url      javascript file
     * @param {function}  callback  function execute when the script is loaded
     */
    //=============================================================================
    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (callback) {
            script.onload = function _loadscript_onload() {
                script.onload = null;
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    // End of loadScript

    //=============================================================================
    /**
     * return the url from a script is loaded
     * @name dom.pathScript
     * @param {string}    scriptName    javascript file
     */
        //=============================================================================
    function isLoadedScript(scriptName) {
        return document.querySelector('script[src*="' + scriptName + '"]') !== null;
    }
    // end of isLoadedScript

    //=============================================================================
    /**
     * return the url from a script is loaded
     * @name dom.pathScript
     * @param {string}    scriptName    javascript file
     */
    //=============================================================================
    function pathScript(scriptName) {
        var jsElement = document.querySelector('script[src*="' + scriptName + '"]'),
            jsFile = null;
        if (jsElement) {
            jsFile = jsElement.getAttribute('src');
            return jsFile.substring(0, jsFile.lastIndexOf('/')+1);
        }
        return null;
    }
    // end of pathScript

    //=============================================================================
    /**
     * return the absolute url from a href
     * @name dom.pathScript
     * @param {string}    href   url for absolute path
     */
        //=============================================================================
    function getLocation(href) {
        var link = document.createElement("a");
        link.href = href;
        link.href = link.href; // fix for IE
        return {
            hash: link.hash,
            host: link.host,
            hostname: link.hostname,
            href: link.href,
            pathname: link.pathname,
            port: link.port,
            protocol: link.protocol,
            search: link.search,
            toString: function() {
                return this.href;
            }
        };
    }
    // end of absolutePath

    //=============================================================================
    // Public elements
    //=============================================================================
    return {
        offset: offset,
        getLocation: getLocation,
        append: append,
        isLoadedScript: isLoadedScript,
        loadScript: loadScript,
        onChange: onChange,
        onAttrModified: onAttrModified,
        pathScript: pathScript,
        prepend: prepend,
        treeEach: treeEach,
        val: val
    };
})();

    // Configuration variable
    var kproxconfig = kproxconfig || {};
    kproxconfig.server = kproxconfig.server || 'localhost';
    kproxconfig.port = kproxconfig.port || 3000;


    // Errors
    var ERROR_record_locked_by_you = -1,
        ERROR_record_locked = -2,
        ERROR_parent_record_locked = -3,
        ERROR_child_record_locked = -4,
        ERROR_key_not_locked = -5;

    //=========================================================================
    // Parameters
    //=========================================================================
    if (typeof card === 'function') {
        fnReady = card;
        card = {name: 'anonymous'};
    }

    //=========================================================================
    // Private members
    //=========================================================================

    // socket-io reference
    var socketio = null;

    // Connection
    var kproxsrv = null;

    // Events
    var events = {'ready': [], 'connect': [], 'disconnect': [], 'newDocument': [], 'error': []};

    if (fnReady) {
        events.ready.push(fnReady);
    }

    // documents
    var docs = {};

    //=========================================================================
    /**
     * configure the unready state and launch the 'unready' event handlers
     * @param {boolean} initial     if it's true the event is not launch
     *                              because is a initial status
     * @param {string} problem
     */
    //=========================================================================
    function disconnected(problem) {
        Object.defineProperty(kproxObject, 'connected', { value: false, writable: false, enumerable: true, configurable: true });
        fire('disconnect', problem);
    }
    // End of unready()

    /**
     * configure the ready state and launch the 'ready' event handlers
     */
    function connected() {
        Object.defineProperty(kproxObject, 'connected', { value: true, writable: false, enumerable: true, configurable: true });
        fire('connect');
    }
    // End of ready()

    /**
     * configure the ready state and launch the 'ready' event handlers
     */
    function ready() {
        Object.defineProperty(kproxObject, 'ready', { value: true, writable: false, enumerable: true, configurable: true });
        fire('ready');
    }
    // End of ready()

    /**
     * Connect to the server
     */
    function connect() {

//        //TODO: gestionar el nombre del servidor al que nos queremos conectar
//        var serverPath = {hostname: 'localhost'};
//        if (typeof window !== 'undefined') {
//            serverPath = dom.getLocation(document.querySelector('script[src*="socket.io.min.js"]').getAttribute('src'));
//        }
//        kproxsrv = io.connect('http://' + serverPath.hostname + ':' + 3000, {'force new connection': true});

        kproxsrv = socketio.connect(server || ('http://' + kproxconfig.server + ':' + kproxconfig.port), {'flash policy port': 3000, 'force new connection': true});

        kproxsrv.on('connect', function(){
            // fire connected
            ready();
            connected();
            kproxsrv.on('disconnect', function(reason){
                // Ready property
                disconnected('disconnect: ' + reason);
            });
            kproxsrv.on('open', function (doc, card) {
                docs[doc].fire('open', card);
            });
            kproxsrv.on('add', function (doc, key, data, card) {
                docs[doc](function(model) {
                    obj.setDepth(model, key, data);
                }, {remote: true, card: card});
            });
            kproxsrv.on('edt', function (doc, key, data, card) {
                docs[doc](function(model) {
                    obj.setDepth(model, key, data);
                }, {remote: true, card: card});
            });
            kproxsrv.on('del', function (doc, key, card) {
                docs[doc](function(model) {
                    obj.delDepth(model, key);
                }, {remote: true, card: card});
            });
            kproxsrv.on('lock', function (doc, key, card) {
                docs[doc].lock(key, null, {remote: true, card: card});
                docs[doc].fire('lock', key, card);
            });
            kproxsrv.on('unlock', function (doc, key, card) {
                docs[doc].unlock(key, null, {remote: true, card: card});
                docs[doc].fire('unlock', key, card);
            });
            kproxsrv.on('msgerror', function(error) {
                if (docs[error.doc]) {
                    docs[error.doc].fire('error', error);
                }
            });
        });
        kproxsrv.on('disconnect', function() {
            disconnected();
        });
        kproxsrv.on('reconnect', function() {
            // Update documents
            for (var d in docs) {
                if (docs.hasOwnProperty(d)) {
                    docs[d].init();
                }
            }
            // Try to lock
        });
    }
    // End of connect()

    //=========================================================================
    // Public members
    //=========================================================================

    // Public object
    var kproxObject = {};

    // kprox.ready
    Object.defineProperty(kproxObject, 'ready', { value: false, writable: false, enumerable: true, configurable: true });

    // kprox.connected
    Object.defineProperty(kproxObject, 'connected', { value: false, writable: false, enumerable: true, configurable: true });

    // kprox.docs
    Object.defineProperty(kproxObject, 'docs', { get: function () {
        return docs;
    }, enumerable: true, configurable: true });

    /**
     * add a new event handler
     * @param   {string}    eventName    name of the event
     * @param   {function}  [fnCallback] event handler
     * @returns {boolean}
     */
    function on(eventName, fnCallback) {
        if (fnCallback) {
            if (!events[eventName]) {
                throw new Error('bad event name');
            }
            events[eventName].push(fnCallback);
            if ((eventName === 'ready' && kproxObject.ready) || (eventName === 'connect' && kproxObject.connected)) {
                fnCallback();
            }
            return true;
        } else {
            return events[eventName];
        }
    }
    // End of on()

    /**
     *
     * @param {string} eventName    name of the even
     * @param {function} fnCallback event handler
     * @returns {boolean}
     */
    function off(eventName, fnCallback) {
        if (!fnCallback && events[eventName]) {
            events[eventName] = [];
            return true;
        } else {
            for (var i = 0; i < events[eventName].length; i++) {
                if (events[eventName][i].toString() === fnCallback.toString()) {
                    events[eventName].splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }
    // End of off()

    /**
     * launch the event handler associated with an event
     * @param {...string} eventName    name of the event
     * @param {...*}   arguments    argument passed to the handler
     */
    function fire() {
        var eventName = Array.prototype.shift.apply(arguments);
        // fix for IE
        var parameters = arguments;
        for (var i = 0; i < events[eventName].length; i++) {
            events[eventName][i].apply(kproxObject, parameters);
        }
    }
    // End of fire()

    /**
     * create a new document
     * Encapsulates and extends the Scope class
     * @param {string}      name        name of the document
     * @param {object}      data        initial data for the document
     * @param {function}    fnCallback  function called when the document is created and sent to the server
     * @returns {Scope}
     */
    function newDocument(name, data, fnCallback) {
        var scope = new Scope(data);
        var locks = {};
        function open(dataOpen) {
            kproxsrv.emit('open', name, dataOpen || {}, card, function(dataUpdate) {
                scope(function (dataPrv) {
                    obj.extend(dataPrv, dataUpdate);
                }, {remote: true});
                if (fnCallback) {
                    scope(fnCallback);
                }
            });
        }
        scope.close = function() {
            Object.defineProperty(docs, name, {writable: true});
            delete docs[name];
            kproxsrv.emit('close', name, card);
        };
        var initOriginal = scope.init;
        scope.init = function(data) {
            if (data) {
                initOriginal(data);
                open(data);
            } else {
                scope(function (data) {
                    open(data);
                });
            }
        };

        /**
         *
         * @param {string} key          string with the key
         * @param {function} [fnCallback] function called when the lock is confirmed
         */
        scope.lock = function (key, fnCallback, extra) {
            if (extra && extra.remote) {
                locks[key] = extra.card;
            } else {
                scope.flush();
                kproxsrv.emit('lock', name, key, function (error) {
                    if (!error) {
                        locks[key] = 'me';
                    } else if (!fnCallback) {
                        if (scope.on('error')) {
                            scope.fire('error', error);
                        } else {
                            kproxObject.fire('error', error);
                        }
                    }
                    if (fnCallback) {
                        scope(function (model) {
                            fnCallback.call(model, error);
                        });
                    }
                });
            }
        };
        /**
         * 
         * @param key
         * @param fnCallback
         */
        scope.unlock = function (key, fnCallback, extra) {
            if (extra && extra.remote) {
                locks[key] = extra.card;
            } else {
                scope.flush();
                kproxsrv.emit('unlock', name, key, function (error) {
                    if (error) {
                        scope.fire('error', error);
                    } else {
                        delete locks[key];
                    }
                    if (fnCallback) {
                        scope(function (model) {
                            fnCallback.call(model, error);
                        });
                    }
                });
            }
        };
        /**
         *
         * @param {string} key  string with the key
         * @return {booelan}    true if this key is locked
         */
        scope.isLock = function (key) {
            return locks[key];
        };
        /**
         * return true if this key is locked by me
         * @param {string} key  string with the key
         * @return {boolean}    true if this key is locked by the current user
         */
        scope.isLockByMe = function (key) {
            return locks[key] === 'me';
        };
        /**
         * obtain the list of locked keys
         * @return {Array}  list of key locked and the user than lock each
         */
        scope.getLocks = function () {
            return obj.clone(locks);
        };
        scope.on('change', function (event) {
            switch(event.event) {
                case 'edt':
                    if (!event.extra.remote) {
                        kproxsrv.emit('edt', name, event.key, event.lst, card);
                    }
                    break;
                case 'del':
                    if (!event.extra.remote) {
                        kproxsrv.emit('del', name, event.key, card);
                    }
                    break;
                case 'add':
                    if (!event.extra.remote) {
                        kproxsrv.emit('add', name, event.key, event.lst, card);
                    }
                    break;
            }
        });
        Object.defineProperty(docs, name, { value: scope, writable: false, enumerable: true, configurable: true });

        if (data) {
            open(data);
        }
        scope.kprox = kproxObject;
        return scope;
    }
    // End of newDocument()

    function close() {
        for (var d in docs) {
            if (docs.hasOwnProperty(d) && p) {
                docs[d].close();
            }
        }
        try {
            kproxsrv.disconnect();
        } catch (e) {
            //nothing
        }
        for (var p in kproxObject) {
            if (kproxObject.hasOwnProperty(p) && p !== 'ready') {
                delete kproxObject[p];
            }
        }
        Object.defineProperty(kproxObject, 'ready', { value: false, writable: false, enumerable: true, configurable: true });
    }

    //=========================================================================
    // Constructor
    //=========================================================================

    // Load dependency of socket.io and init the object
    if (typeof window !== 'undefined') {
        if (!dom.isLoadedScript('socket.io.min.js')) {
            dom.loadScript('../src/socket.io/socket.io.min.js', function() {
                socketio = io;
                connect();
            });
        } else {
            socketio = io;
            connect();
        }
    } else {
        if (typeof window === 'undefined' && typeof io === 'undefined') {
            socketio = require('../test/node_modules/socket.io-client');
        }
        connect();
    }

    // Return public object
    kproxObject.newDocument = newDocument;
    kproxObject.on = on;
    kproxObject.off = off;
    kproxObject.fire = fire;
    kproxObject.close = close;
    kproxObject.version = '0.0.1';

    return kproxObject;

};

if (typeof exports !== 'undefined') {
    module.exports = KProx;
}

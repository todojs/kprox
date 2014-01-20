/* jshint strict: true, node: true */
//===================================================================
//                        kproxsrv.js
/**!
 * @license Copyright 2014 - KUBIDE ADVANCE WEB DEVELOPMENT, S.L.
 * @fileoverview	kproxsrv.js	KProx server
 * @author          Pablo Almunia
 * @version         0.1
 */
//===================================================================
"use strict";

//----------------------------------------------------------
// Previous
//----------------------------------------------------------

// colors for console
require('./kcolors');

// Remove console
if (process.env.KCONSOLE === 'DISABLED') {
    console.log2 = console.log;
    console.log = function() {};
    console.dir2 = console.dir;
    console.dir = function() {};
}

// Error management
process.on('uncaughtException', function(err) {
    console.log('KPROXSRV - '.magenta + 'Caught exception: '.red + err);
    console.log(err.stack);
});

// Init msg
console.log('KPROXSRV - '.magenta + 'starting'.green);

//----------------------------------------------------------
// Modules
//----------------------------------------------------------

// assert module
var assert = require('assert');

// http server
var app = require('http').createServer();

// Socket.io
var io = require('socket.io').listen(app); // , {'log level': 1}

//----------------------------------------------------------
// Global variables
//----------------------------------------------------------

// Data
var database = {};

// Locks
var locks = [];

// Error
var ERROR_record_locked_by_you = -1,
    ERROR_record_locked_for_by_msg = 'record is locked by you',
    ERROR_record_locked = -2,
    ERROR_record_locked_msg = 'record is locked by other user',
    ERROR_parent_record_locked = -3,
    ERROR_parent_record_locked_msg = 'parent record is locked',
    ERROR_child_record_locked = -4,
    ERROR_child_record_locked_msg = 'child record is locked',
    ERROR_key_not_locked = -5,
    ERROR_key_not_exist_msg = 'key not exist';


//----------------------------------------------------------
// Functions
//----------------------------------------------------------

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
    var tags = path.replace(/^\[|\]|\"|"/g,'').split(/\[|\./),
        len = tags.length - 1;
    for (var i = 0; i < len; i++) {
        origin = origin[tags[i]] = {};
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
    return path.replace(/^\[|\]|\"|"/g,'').split(/\[|\./).reduce(function(a,b) {
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
    var tags = path.replace(/^\[|\]|\"|"/g,'').split(/\[|\./),
        len = tags.length - 1;
    for (var i = 0; i < len; i++) {
        origin = origin[tags[i]] = {};
    }
    delete origin[tags[len]];
}

//----------------------------------------------------------
// Create web server
//----------------------------------------------------------

// Create the listen
app.listen(3000);
console.log('KPROXSRV - '.magenta + 'ready on port '.green + '%s', 3000);


//production settings
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                              // reduce logging
io.set('flash policy port', 3000);       //override policy port
io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']); // enable all transports (optional if you want flashsocket)

//----------------------------------------------------------
// Socket.io Configuration
//----------------------------------------------------------
io.sockets.on('connection', function connection(socket) {

    console.log('KPROXSRV - '.magenta + socket.id + ' - connect'.yellowlight);

    //------------------------------------------------------
    // Functions
    //------------------------------------------------------


    /**
     *
     * @param fnCallback
     * @param error
     */
    function sendError(fnCallback, error) {
        if (typeof error === 'undefined') {
            error = {num: 0, msg: 'undefined error'};
        }
        console.log('KPROXSRV - '.magenta + socket.id + ' - Error: '.redlight + '%j'.red , error);
        if (fnCallback) {
            fnCallback(error);
            console.log('callback');
        } else {
            socket.emit('msgerror', error);
            console.log('emit');
        }
    }


    function normalizeKey(key) {
        return key.replace(/[\[]/g, '.').replace(/[\]|\"|\']/g, '');
    }

    /**
     *
     * @param doc
     * @param key
     * @param card
     * @param fnCallback
     * @returns {boolean}
     */
    function isLockable(doc, key, card, options, fnCallback) {
        console.log('KPROXSRV - '.magenta + socket.id + ' - check lock'.bluelight + ' - %s.%s = '.green + ' by '.redlight + '%j'.red, doc, key, card);
        // check if this key exist
        if (typeof getDepth(database[doc], key) === 'undefined') {
            if (options && !options.noexist) {
                sendError(fnCallback, {doc: doc, key: key, num: ERROR_key_not_locked, msg: ERROR_key_not_exist_msg});
                return false;
            }
        }
        // check if this key is locked
        if (typeof locks[doc] !== 'undefined' && typeof locks[doc][key] !== 'undefined') {
            if (locks[doc][key].id === socket.id) {
                if (options && !options.nomy) {
                    sendError(fnCallback, {doc: doc, key: key, num: ERROR_record_locked_by_you, msg: ERROR_record_locked_for_by_msg, card: locks[doc][key].card});
                    return false;
                }
            } else {
                sendError(fnCallback, {doc: doc, key: key, num: ERROR_record_locked, msg: ERROR_record_locked_msg, card: locks[doc][key].card});
                return false;
            }
        }
        // check parent and child
        var parent = null;
        var child = null;
        var regKey = new RegExp('^' + key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '(\\.|$])');
        var regLock;
        for (var locked in locks[doc]) {
            if (locks[doc].hasOwnProperty(locked)) {
                child = locked.match(regKey);
                regLock = new RegExp('^' + locked.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '(\\.|$])');
                parent = key.match(regLock);
                if (parent !== null && locks[doc][locked].id !== socket.id) {
                    sendError(fnCallback, {doc: doc, key: key, num: ERROR_parent_record_locked, msg: ERROR_parent_record_locked_msg, card: locks[doc][locked].card});
                    return false;
                }
                if (child !== null && locks[doc][locked].id !== socket.id) {
                    sendError(fnCallback, {doc: doc, key: key, num: ERROR_child_record_locked, msg: ERROR_child_record_locked_msg, card: locks[doc][locked].card});
                    return false;
                }
            }
        }
        return true;
    }
    // End of isLockable()

    //=========================
    // Disconnect event
    //=========================
    socket.on('disconnect', function disconnect() {
        console.log('KPROXSRV - '.magenta + socket.id + ' - disconnect'.yellowlight);
        var rooms = io.sockets.manager.roomClients[socket.id];
        for (var doc in rooms) {
            if (rooms.hasOwnProperty(doc) && doc !== '') {
                doc = doc.substring(1);
                for (var key in locks[doc]) {
                    if (locks[doc].hasOwnProperty(key)) {
                        if (locks[doc][key].id === socket.id) {
                            delete locks[doc][key];
                            console.log('KPROXSRV - '.magenta + socket.id + ' - unlocked'.bluelight + ' - %s.%s'.green, doc, key);
                        }
                    }
                }
                socket.leave(doc);
                if (io.sockets.clients(doc).length === 0) {
                    console.log('KPROXSRV - '.magenta + socket.id + ' - delete document'.bluelight  + ' - %s'.green, doc);
                    delete database[doc];
                }
            }
        }
        console.log('KPROXSRV - '.magenta + socket.id + ' - disconnected'.green);
    });

    //=========================
    // Open new document
    //=========================
    socket.on('open', function open(doc, data, card, fnCallback) {
        console.log('KPROXSRV - '.magenta + socket.id + ' - open'.bluelight + ' - %s = '.green + '%j'.grey + ' by '.redlight + '%j'.red, doc, data, card);
        if (typeof database[doc] === 'undefined') {
            console.log('KPROXSRV - '.magenta + socket.id + ' - create document'.bluelight  + ' - %s ='.green + ' %j'.grey, doc, data);
            database[doc] = data;
        }
        fnCallback(database[doc]);
        socket.join(doc);
        socket.set('card', card);
        socket.broadcast.to(doc).emit('open', doc, card);
    });

    //=========================
    // Close a document
    //=========================
    socket.on('close', function open(doc, card) {
        console.log('KPROXSRV - '.magenta + socket.id + ' - close'.bluelight + ' - '.green + ' by '.redlight + '%j'.red, doc, card);
        socket.leave(doc);
        if (io.sockets.clients(doc).length === 0) {
            console.log('KPROXSRV - '.magenta + socket.id + ' - delete - '.bluelight  + '%s'.green, doc);
            delete database[doc];
        }
    });

    //=========================
    // add an element
    //=========================
    socket.on('add', function add(doc, key, data) {
        // Check prev data
//        try {
//            assert.deepEql(getDepth(database[doc], key), data.prev);
//        } catch(e) {
//            console.log('KPROXSRV - '.magenta + socket.id + ' - add'.bluelight + ' - record changed previosly'.red + ' - %s.%s'.green, doc, key);
//            socket.emit('msgerror', doc, key, {error: ERROR_record_changed_previosly, msg: ERROR_record_changed_previosly_msg});
//            return;
//        }
        key = normalizeKey(key);
        socket.get('card', function(err, card) {
            // Check lock status
            if (!isLockable(doc, key, card, {noexist: true})) {
                console.log('KPROXSRV - '.magenta + socket.id + ' - del'.bluelight + ' - %s.%s = '.green + '%j'.grey, doc, key, data);
                socket.emit('del', doc, key, 'me');
                return;
            }
            // Update
            console.log('KPROXSRV - '.magenta + socket.id + ' - add'.bluelight + ' - %s.%s = '.green + '%j'.grey + ' by '.redlight + '%j'.red, doc, key, data, card);
            setDepth(database[doc], key, data);
            socket.broadcast.to(doc).emit('edt', doc, key, data, card);
        });
    });

    //=========================
    // edit an element
    //=========================
    socket.on('edt', function edt(doc, key, data) {
        // Check prev data
//        try {
//            assert.deepEql(getDepth(database[doc], key), data.prev);
//        } catch(e) {
//            console.log('KPROXSRV - '.magenta + socket.id + ' - edt'.bluelight + ' - record changed previosly'.red + ' - %s.%s'.green, doc, key);
//            socket.emit('msgerror', doc, key, {error: ERROR_record_changed_previosly, msg: ERROR_record_changed_previosly_msg});
//            return;
//        }
        key = normalizeKey(key);
        socket.get('card', function(err, card) {
            // Check lock status
            if (!isLockable(doc, key, card)) {
                console.log('KPROXSRV - '.magenta + socket.id + ' - edt'.bluelight + ' - %s.%s = '.green + '%j'.grey, doc, key, data);
                socket.emit('edt', doc, key, getDepth(database[doc], key), 'me');
                return;
            }
            console.log('KPROXSRV - '.magenta + socket.id + ' - edt'.bluelight + ' - %s.%s = '.green + '%j'.grey + ' by '.redlight + '%j'.red, doc, key, data, card);
            setDepth(database[doc], key, data);
            socket.broadcast.to(doc).emit('edt', doc, key, data, card);
        });
    });

    //=========================
    // delete an element
    //=========================
    socket.on('del', function del(doc, key, data) {
        // Check prev data
//        try {
//            assert.deepEql(getDepth(database[doc], key), data.prev);
//        } catch(e) {
//            socket.emit('msgerror', doc, key, {error: ERROR_record_changed_previosly, msg: ERROR_record_changed_previosly_msg});
//            return;
//        }
        key = normalizeKey(key);
        socket.get('card', function(err, card) {
            // Check lock status
            if (!isLockable(doc, key, card)) {
                socket.emit('add', doc, key, getDepth(database[doc], key), 'me');
                return;
            }
            console.log('KPROXSRV - '.magenta + socket.id + ' - del'.bluelight + ' - %s.%s = '.green + '%j'.grey + ' by '.redlight + '%j'.red, doc, key, getDepth(database[doc], key), card);
            delDepth(database[doc], key);
            unlock(doc, key);
            socket.broadcast.to(doc).emit('del', doc, key, card);
        });
    });

    //=========================
    // Lock an element
    //=========================
    socket.on('lock', function lock(doc, key, fnCallback) {
        key = normalizeKey(key);
        socket.get('card', function(err, card) {
            if (!isLockable(doc, key, card, {nomy: true}, fnCallback)) {
                return false;
            }
            // lock
            if (!locks[doc]) {
                locks [doc] = {};
            }
            locks[doc][key] = {};
            locks[doc][key].id = socket.id ;
            locks[doc][key].card = card;
            if (fnCallback) { fnCallback(null); }
            console.log('KPROXSRV - '.magenta + socket.id + ' - locked'.bluelight + ' - %s.%s = '.green + ' by '.redlight + '%j'.red, doc, key, card);
            socket.broadcast.to(doc).emit('lock', doc, key, card);
        });
    });


    //=========================
    // Unlock an element
    //=========================
    function unlock(doc, key, fnCallback) {
        key = normalizeKey(key);
        socket.get('card', function(err, card) {
            console.log('KPROXSRV - '.magenta + socket.id + ' - unlocking'.bluelight + ' - %s.%s = '.green + ' by '.redlight + '%j'.red, doc, key, card);
            if (locks[doc]) {
                if (locks[doc][key]) {
                    if (locks[doc][key].id === socket.id) {
                        delete locks[doc][key];
                        console.log('KPROXSRV - '.magenta + socket.id + ' - unlocked'.bluelight + ' - %s.%s = '.green + ' by '.redlight + '%j'.red, doc, key, card);
                        if (fnCallback) { fnCallback(null); }
                        socket.broadcast.to(doc).emit('unlock', doc, key, card);
                        return;
                    } else {
                        sendError(fnCallback, {doc: doc, key: key, num: ERROR_record_locked, msg: ERROR_record_locked_msg, card: locks[doc][key].card});
                        return;
                    }
                } else {
                    sendError(fnCallback, {doc: doc, key: key, num: ERROR_key_not_locked, msg: ERROR_key_not_exist_msg});
                    return;
                }
            }
            sendError(fnCallback, {doc: doc, key: key, num: ERROR_key_not_locked, msg: ERROR_key_not_exist_msg});
        });
    }
    socket.on('unlock', unlock);

});


/* End of kprox-srv.js */
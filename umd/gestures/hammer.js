/* tslint:disable */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var /** @type {?} */ win = window;
    var /** @type {?} */ doc = document;
    /*! Hammer.JS - v2.0.6 - 2015-12-23
     * http://hammerjs.github.io/
     *
     * Copyright (c) 2015 Jorik Tangelder;
     * Licensed under the  license */
    var /** @type {?} */ VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    var /** @type {?} */ TEST_ELEMENT = doc.createElement('div');
    var /** @type {?} */ TYPE_FUNCTION = 'function';
    var /** @type {?} */ round = Math.round;
    var /** @type {?} */ abs = Math.abs;
    var /** @type {?} */ now = Date.now;
    /**
     * set a timeout with a given scope
     * @param {?} fn
     * @param {?} timeout
     * @param {?} context
     * @return {?}
     */
    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
    }
    /**
     * if the argument is an array, we want to execute the fn on each entry
     * if it aint an array we don't want to do a thing.
     * this is used by all the methods that accept a single and array argument.
     * @param {?} arg
     * @param {?} fn
     * @param {?} context
     * @return {?}
     */
    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
        }
        return false;
    }
    /**
     * walk objects and arrays
     * @param {?} obj
     * @param {?} iterator
     * @param {?=} context
     * @return {?}
     */
    function each(obj, iterator, context) {
        var /** @type {?} */ i;
        if (!obj) {
            return;
        }
        if (obj.forEach) {
            obj.forEach(iterator, context);
        }
        else if (obj.length !== undefined) {
            i = 0;
            while (i < obj.length) {
                iterator.call(context, obj[i], i, obj);
                i++;
            }
        }
        else {
            for (i in obj) {
                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
        }
    }
    /**
     * simple class inheritance
     * @param {?} child
     * @param {?} base
     * @param {?} properties
     * @return {?}
     */
    function inherit(child, base, properties) {
        var /** @type {?} */ baseP = base.prototype, /** @type {?} */ childP;
        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;
        if (properties) {
            Object.assign(childP, properties);
        }
    }
    /**
     * simple function bind
     * @param {?} fn
     * @param {?} context
     * @return {?}
     */
    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments);
        };
    }
    /**
     * let a boolean value also be a function that must return a boolean
     * this first item in args will be used as the context
     * @param {?} val
     * @param {?} args
     * @return {?}
     */
    function boolOrFn(val, args) {
        if (typeof val == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined : undefined, args);
        }
        return val;
    }
    /**
     * use the val2 when val1 is undefined
     * @param {?} val1
     * @param {?} val2
     * @return {?}
     */
    function ifUndefined(val1, val2) {
        return (val1 === undefined) ? val2 : val1;
    }
    /**
     * addEventListener with multiple events at once
     * @param {?} target
     * @param {?} types
     * @param {?} handler
     * @return {?}
     */
    function addEventListeners(target, types, handler) {
        each(splitStr(types), function (type) {
            target.addEventListener(type, handler, false);
        });
    }
    /**
     * removeEventListener with multiple events at once
     * @param {?} target
     * @param {?} types
     * @param {?} handler
     * @return {?}
     */
    function removeEventListeners(target, types, handler) {
        each(splitStr(types), function (type) {
            target.removeEventListener(type, handler, false);
        });
    }
    /**
     * find if a node is in the given parent
     * \@method hasParent
     * @param {?} node
     * @param {?} parent
     * @return {?}
     */
    function hasParent(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * small indexOf wrapper
     * @param {?} str
     * @param {?} find
     * @return {?}
     */
    function inStr(str, find) {
        return str.indexOf(find) > -1;
    }
    /**
     * split string on whitespace
     * @param {?} str
     * @return {?}
     */
    function splitStr(str) {
        return str.trim().split(/\s+/g);
    }
    /**
     * find if a array contains the object using indexOf or a simple polyFill
     * @param {?} src
     * @param {?} find
     * @param {?=} findByKey
     * @return {?}
     */
    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find);
        }
        else {
            var /** @type {?} */ i = 0;
            while (i < src.length) {
                if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                    return i;
                }
                i++;
            }
            return -1;
        }
    }
    /**
     * convert array-like objects to real arrays
     * @param {?} obj
     * @return {?}
     */
    function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
    }
    /**
     * unique array with objects based on a key (like 'id') or just by the array's value
     * @param {?} src
     * @param {?} key
     * @param {?} sort
     * @return {?}
     */
    function uniqueArray(src, key, sort) {
        var /** @type {?} */ results = [];
        var /** @type {?} */ values = [];
        var /** @type {?} */ i = 0;
        while (i < src.length) {
            var /** @type {?} */ val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }
        if (sort) {
            if (!key) {
                results = results.sort();
            }
            else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key] ? 1 : 0;
                });
            }
        }
        return results;
    }
    /**
     * get the prefixed property
     * @param {?} obj
     * @param {?} property
     * @return {?}
     */
    function prefixed(obj, property) {
        var /** @type {?} */ prefix, /** @type {?} */ prop;
        var /** @type {?} */ camelProp = property[0].toUpperCase() + property.slice(1);
        var /** @type {?} */ i = 0;
        while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = (prefix) ? prefix + camelProp : property;
            if (prop in obj) {
                return prop;
            }
            i++;
        }
        return undefined;
    }
    /**
     * get a unique id
     */
    var _uniqueId = 1;
    /**
     * @return {?}
     */
    function uniqueId() {
        return _uniqueId++;
    }
    /**
     * get the window object of an element
     * @param {?} element
     * @return {?}
     */
    function getWindowForElement(element) {
        var /** @type {?} */ doc = element.ownerDocument || element;
        return (doc.defaultView || doc.parentWindow || window);
    }
    var /** @type {?} */ MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    var /** @type {?} */ SUPPORT_TOUCH = ('ontouchstart' in window);
    var /** @type {?} */ SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
    var /** @type {?} */ SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    var /** @type {?} */ INPUT_TYPE_TOUCH = 'touch';
    var /** @type {?} */ INPUT_TYPE_PEN = 'pen';
    var /** @type {?} */ INPUT_TYPE_MOUSE = 'mouse';
    var /** @type {?} */ INPUT_TYPE_KINECT = 'kinect';
    var /** @type {?} */ COMPUTE_INTERVAL = 25;
    var /** @type {?} */ INPUT_START = 1;
    var /** @type {?} */ INPUT_MOVE = 2;
    var /** @type {?} */ INPUT_END = 4;
    var /** @type {?} */ INPUT_CANCEL = 8;
    var /** @type {?} */ DIRECTION_NONE = 1;
    exports.DIRECTION_LEFT = 2;
    exports.DIRECTION_RIGHT = 4;
    var /** @type {?} */ DIRECTION_UP = 8;
    var /** @type {?} */ DIRECTION_DOWN = 16;
    exports.DIRECTION_HORIZONTAL = exports.DIRECTION_LEFT | exports.DIRECTION_RIGHT;
    exports.DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var /** @type {?} */ DIRECTION_ALL = exports.DIRECTION_HORIZONTAL | exports.DIRECTION_VERTICAL;
    var /** @type {?} */ PROPS_XY = ['x', 'y'];
    var /** @type {?} */ PROPS_CLIENT_XY = ['clientX', 'clientY'];
    /**
     * create new input type manager
     * @param {?} manager
     * @param {?} callback
     * @return {?}
     */
    function Input(manager, callback) {
        var /** @type {?} */ self = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget;
        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.
        this.domHandler = function (ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
                self.handler(ev);
            }
        };
        this.init();
    }
    Input.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler: function () { },
        /**
         * bind the events
         */
        init: function () {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        },
        /**
         * unbind the events
         */
        destroy: function () {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        }
    };
    /**
     * create new input type manager
     * called by the Manager constructor
     * @param {?} manager
     * @return {?}
     */
    function createInputInstance(manager) {
        var /** @type {?} */ Type;
        var /** @type {?} */ inputClass = manager.options.inputClass;
        if (inputClass) {
            Type = inputClass;
        }
        else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
        }
        else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
        }
        else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
        }
        else {
            Type = TouchMouseInput;
        }
        return new (Type)(manager, inputHandler);
    }
    /**
     * handle input events
     * @param {?} manager
     * @param {?} eventType
     * @param {?} input
     * @return {?}
     */
    function inputHandler(manager, eventType, input) {
        var /** @type {?} */ pointersLen = input.pointers.length;
        var /** @type {?} */ changedPointersLen = input.changedPointers.length;
        var /** @type {?} */ isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
        var /** @type {?} */ isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));
        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;
        if (isFirst) {
            manager.session = {};
        }
        // source event is the normalized value of the domEvents
        // like 'touchstart, mouseup, pointerdown'
        input.eventType = eventType;
        // compute scale, rotation etc
        computeInputData(manager, input);
        // emit secret event
        manager.emit('hammer.input', input);
        manager.recognize(input);
        manager.session.prevInput = input;
    }
    /**
     * extend the data with some usable properties like scale, rotate, velocity etc
     * @param {?} manager
     * @param {?} input
     * @return {?}
     */
    function computeInputData(manager, input) {
        var /** @type {?} */ session = manager.session;
        var /** @type {?} */ pointers = input.pointers;
        var /** @type {?} */ pointersLength = pointers.length;
        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
        }
        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
        }
        else if (pointersLength === 1) {
            session.firstMultiple = false;
        }
        var /** @type {?} */ firstInput = session.firstInput;
        var /** @type {?} */ firstMultiple = session.firstMultiple;
        var /** @type {?} */ offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
        var /** @type {?} */ center = input.center = getCenter(pointers);
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;
        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);
        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);
        var /** @type {?} */ overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;
        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
        input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
            session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);
        computeIntervalInputData(session, input);
        // find the correct target
        var /** @type {?} */ target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
        }
        input.target = target;
    }
    /**
     * @param {?} session
     * @param {?} input
     * @return {?}
     */
    function computeDeltaXY(session, input) {
        var /** @type {?} */ center = input.center;
        var /** @type {?} */ offset = session.offsetDelta || {};
        var /** @type {?} */ prevDelta = session.prevDelta || {};
        var /** @type {?} */ prevInput = session.prevInput || {};
        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };
            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }
        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
    }
    /**
     * velocity is calculated every x ms
     * @param {?} session
     * @param {?} input
     * @return {?}
     */
    function computeIntervalInputData(session, input) {
        var /** @type {?} */ last = session.lastInterval || input, /** @type {?} */ deltaTime = input.timeStamp - last.timeStamp, /** @type {?} */ velocity, /** @type {?} */ velocityX, /** @type {?} */ velocityY, /** @type {?} */ direction;
        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
            var /** @type {?} */ deltaX = input.deltaX - last.deltaX;
            var /** @type {?} */ deltaY = input.deltaY - last.deltaY;
            var /** @type {?} */ v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);
            session.lastInterval = input;
        }
        else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }
        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
    }
    /**
     * create a simple clone from the input used for storage of firstInput and firstMultiple
     * @param {?} input
     * @return {?}
     */
    function simpleCloneInputData(input) {
        // make a simple copy of the pointers because we will get a reference if we don't
        // we only need clientXY for the calculations
        var /** @type {?} */ pointers = [];
        var /** @type {?} */ i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: round(input.pointers[i].clientX),
                clientY: round(input.pointers[i].clientY)
            };
            i++;
        }
        return {
            timeStamp: now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
        };
    }
    /**
     * get the center of all the pointers
     * @param {?} pointers
     * @return {?}
     */
    function getCenter(pointers) {
        var /** @type {?} */ pointersLength = pointers.length;
        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: round(pointers[0].clientX),
                y: round(pointers[0].clientY)
            };
        }
        var /** @type {?} */ x = 0, /** @type {?} */ y = 0, /** @type {?} */ i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }
        return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
        };
    }
    /**
     * calculate the velocity between two points. unit is in px per ms.
     * @param {?} deltaTime
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    function getVelocity(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    }
    /**
     * get the direction between two points
     * @param {?} x
     * @param {?} y
     * @return {?}
     */
    function getDirection(x, y) {
        if (x === y) {
            return DIRECTION_NONE;
        }
        if (abs(x) >= abs(y)) {
            return x < 0 ? exports.DIRECTION_LEFT : exports.DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }
    /**
     * calculate the absolute distance between two points
     * @param {?} p1
     * @param {?} p2
     * @param {?=} props
     * @return {?}
     */
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var /** @type {?} */ x = p2[props[0]] - p1[props[0]], /** @type {?} */ y = p2[props[1]] - p1[props[1]];
        return Math.sqrt((x * x) + (y * y));
    }
    /**
     * calculate the angle between two coordinates
     * @param {?} p1
     * @param {?} p2
     * @param {?=} props
     * @return {?}
     */
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var /** @type {?} */ x = p2[props[0]] - p1[props[0]], /** @type {?} */ y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    }
    /**
     * calculate the rotation degrees between two pointersets
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }
    /**
     * calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }
    var /** @type {?} */ MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
    };
    var /** @type {?} */ MOUSE_ELEMENT_EVENTS = 'mousedown';
    var /** @type {?} */ MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
    /**
     * Mouse events input
     * @param {?} manager
     * @param {?} handler
     * @return {?}
     */
    function MouseInput(manager, handler) {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;
        this.allow = true; // used by Input.TouchMouse to disable mouse events
        this.pressed = false; // mousedown state
        Input.apply(this, arguments);
    }
    inherit(MouseInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
            var /** @type {?} */ eventType = MOUSE_INPUT_MAP[ev.type];
            // on start we want to have the left mouse button down
            if (eventType & INPUT_START && ev.button === 0) {
                this.pressed = true;
            }
            if (eventType & INPUT_MOVE && ev.which !== 1) {
                eventType = INPUT_END;
            }
            // mouse must be down, and mouse events are allowed (see the TouchMouse input)
            if (!this.pressed || !this.allow) {
                return;
            }
            if (eventType & INPUT_END) {
                this.pressed = false;
            }
            this.callback(this.manager, eventType, {
                pointers: [ev],
                changedPointers: [ev],
                pointerType: INPUT_TYPE_MOUSE,
                srcEvent: ev
            });
        }
    });
    var /** @type {?} */ POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
    };
    // in IE10 the pointer types is defined as an enum
    var /** @type {?} */ IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
    };
    var /** @type {?} */ POINTER_ELEMENT_EVENTS = 'pointerdown';
    var /** @type {?} */ POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';
    // IE10 has prefixed support, and case-sensitive
    if (win.MSPointerEvent && !win.PointerEvent) {
        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }
    /**
     * Pointer events input
     * @return {?}
     */
    function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;
        Input.apply(this, arguments);
        this.store = (this.manager.session.pointerEvents = []);
    }
    inherit(PointerEventInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
            var /** @type {?} */ store = this.store;
            var /** @type {?} */ removePointer = false;
            var /** @type {?} */ eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            var /** @type {?} */ eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var /** @type {?} */ pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
            var /** @type {?} */ isTouch = (pointerType == INPUT_TYPE_TOUCH);
            // get index of the event in the store
            var /** @type {?} */ storeIndex = inArray(store, ev.pointerId, 'pointerId');
            // start and mouse must be down
            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                if (storeIndex < 0) {
                    store.push(ev);
                    storeIndex = store.length - 1;
                }
            }
            else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                removePointer = true;
            }
            // it not found, so the pointer hasn't been down (so it's probably a hover)
            if (storeIndex < 0) {
                return;
            }
            // update the event in the store
            store[storeIndex] = ev;
            this.callback(this.manager, eventType, {
                pointers: store,
                changedPointers: [ev],
                pointerType: pointerType,
                srcEvent: ev
            });
            if (removePointer) {
                // remove from the store
                store.splice(storeIndex, 1);
            }
        }
    });
    var /** @type {?} */ SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };
    var /** @type {?} */ SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
    var /** @type {?} */ SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';
    /**
     * Touch events input
     * @return {?}
     */
    function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;
        Input.apply(this, arguments);
    }
    inherit(SingleTouchInput, Input, {
        handler: function TEhandler(ev) {
            var /** @type {?} */ type = SINGLE_TOUCH_INPUT_MAP[ev.type];
            // should we handle the touch events?
            if (type === INPUT_START) {
                this.started = true;
            }
            if (!this.started) {
                return;
            }
            var /** @type {?} */ touches = normalizeSingleTouches.call(this, ev, type);
            // when done, reset the started state
            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
                this.started = false;
            }
            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });
    /**
     * @param {?} ev
     * @param {?} type
     * @return {?}
     */
    function normalizeSingleTouches(ev, type) {
        var /** @type {?} */ all = toArray(ev.touches);
        var /** @type {?} */ changed = toArray(ev.changedTouches);
        if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
        }
        return [all, changed];
    }
    var /** @type {?} */ TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };
    var /** @type {?} */ TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
    /**
     * Multi-user touch events input
     * @param {?} manager
     * @param {?} handler
     * @return {?}
     */
    function TouchInput(manager, handler) {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};
        Input.apply(this, arguments);
    }
    inherit(TouchInput, Input, {
        handler: function MTEhandler(ev) {
            var /** @type {?} */ type = TOUCH_INPUT_MAP[ev.type];
            var /** @type {?} */ touches = getTouches.call(this, ev, type);
            if (!touches) {
                return;
            }
            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });
    /**
     * @param {?} ev
     * @param {?} type
     * @return {?}
     */
    function getTouches(ev, type) {
        var /** @type {?} */ allTouches = toArray(ev.touches);
        var /** @type {?} */ targetIds = this.targetIds;
        // when there is only one touch, the process can be simplified
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }
        var /** @type {?} */ i, /** @type {?} */ targetTouches, /** @type {?} */ changedTouches = toArray(ev.changedTouches), /** @type {?} */ changedTargetTouches = [], /** @type {?} */ target = this.target;
        // get target touches from touches
        targetTouches = allTouches.filter(function (touch) {
            return hasParent(touch.target, target);
        });
        // collect touches
        if (type === INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }
        // filter changed touches to only contain touches that exist in the collected target ids
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }
            // cleanup removed touches
            if (type & (INPUT_END | INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }
        if (!changedTargetTouches.length) {
            return;
        }
        return [
            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
            uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
            changedTargetTouches
        ];
    }
    /**
     * Combined touch and mouse input
     *
     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
     * This because touch devices also emit mouse events while doing a touch.
     *
     * @return {?}
     */
    function TouchMouseInput() {
        Input.apply(this, arguments);
        var /** @type {?} */ handler = bindFn(this.handler, this);
        this.touch = new ((TouchInput))(this.manager, handler);
        this.mouse = new ((MouseInput))(this.manager, handler);
    }
    inherit(TouchMouseInput, Input, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
            var /** @type {?} */ isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH), /** @type {?} */ isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);
            // when we're in a touch event, so  block all upcoming mouse events
            // most mobile browser also emit mouseevents, right after touchstart
            if (isTouch) {
                this.mouse.allow = false;
            }
            else if (isMouse && !this.mouse.allow) {
                return;
            }
            // reset the allowMouse when we're done
            if (inputEvent & (INPUT_END | INPUT_CANCEL)) {
                this.mouse.allow = true;
            }
            this.callback(manager, inputEvent, inputData);
        },
        /**
         * remove the event listeners
         */
        destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
        }
    });
    var /** @type {?} */ PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    var /** @type {?} */ NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
    // magical touchAction value
    var /** @type {?} */ TOUCH_ACTION_COMPUTE = 'compute';
    var /** @type {?} */ TOUCH_ACTION_AUTO = 'auto';
    var /** @type {?} */ TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
    var /** @type {?} */ TOUCH_ACTION_NONE = 'none';
    var /** @type {?} */ TOUCH_ACTION_PAN_X = 'pan-x';
    var /** @type {?} */ TOUCH_ACTION_PAN_Y = 'pan-y';
    /**
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {?} manager
     * @param {?} value
     * @return {?}
     */
    function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
    }
    TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set: function (value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }
            if (NATIVE_TOUCH_ACTION && this.manager.element.style) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        },
        /**
         * just re-set the touchAction value
         */
        update: function () {
            this.set(this.manager.options.touchAction);
        },
        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute: function () {
            var /** @type {?} */ actions = [];
            each(this.manager.recognizers, function (recognizer) {
                if (boolOrFn(recognizer.options.enable, [recognizer])) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        },
        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults: function (input) {
            // not needed with native support for the touchAction property
            if (NATIVE_TOUCH_ACTION) {
                return;
            }
            var /** @type {?} */ srcEvent = input.srcEvent;
            var /** @type {?} */ direction = input.offsetDirection;
            // if the touch action did prevented once this session
            if (this.manager.session.prevented) {
                srcEvent.preventDefault();
                return;
            }
            var /** @type {?} */ actions = this.actions;
            var /** @type {?} */ hasNone = inStr(actions, TOUCH_ACTION_NONE);
            var /** @type {?} */ hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
            var /** @type {?} */ hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
            if (hasNone) {
                //do not prevent defaults if this is a tap gesture
                var /** @type {?} */ isTapPointer = input.pointers.length === 1;
                var /** @type {?} */ isTapMovement = input.distance < 2;
                var /** @type {?} */ isTapTouchTime = input.deltaTime < 250;
                if (isTapPointer && isTapMovement && isTapTouchTime) {
                    return;
                }
            }
            if (hasPanX && hasPanY) {
                // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
                return;
            }
            if (hasNone ||
                (hasPanY && direction & exports.DIRECTION_HORIZONTAL) ||
                (hasPanX && direction & exports.DIRECTION_VERTICAL)) {
                return this.preventSrc(srcEvent);
            }
        },
        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc: function (srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
        }
    };
    /**
     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
     * @param {?} actions
     * @return {?}
     */
    function cleanTouchActions(actions) {
        // none
        if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
        }
        var /** @type {?} */ hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var /** @type {?} */ hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
        // if both pan-x and pan-y are set (different recognizers
        // for different directions, e.g. horizontal pan but vertical swipe?)
        // we need none (as otherwise with pan-x pan-y combined none of these
        // recognizers will work, since the browser would handle all panning
        if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
        }
        // pan-x OR pan-y
        if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }
        // manipulation
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
        }
        return TOUCH_ACTION_AUTO;
    }
    /**
     * Recognizer flow explained; *
     * All recognizers have the initial state of POSSIBLE when a input session starts.
     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
     * Example session for mouse-input: mousedown -> mousemove -> mouseup
     *
     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
     * which determines with state it should be.
     *
     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
     * POSSIBLE to give it another change on the next cycle.
     *
     *               Possible
     *                  |
     *            +-----+---------------+
     *            |                     |
     *      +-----+-----+               |
     *      |           |               |
     *   Failed      Cancelled          |
     *                          +-------+------+
     *                          |              |
     *                      Recognized       Began
     *                                         |
     *                                      Changed
     *                                         |
     *                                  Ended/Recognized
     */
    var STATE_POSSIBLE = 1;
    var /** @type {?} */ STATE_BEGAN = 2;
    var /** @type {?} */ STATE_CHANGED = 4;
    var /** @type {?} */ STATE_ENDED = 8;
    var /** @type {?} */ STATE_RECOGNIZED = STATE_ENDED;
    var /** @type {?} */ STATE_CANCELLED = 16;
    var /** @type {?} */ STATE_FAILED = 32;
    /**
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @param {?} options
     * @return {?}
     */
    function Recognizer(options) {
        this.options = Object.assign({}, this.defaults, options || {});
        this.id = uniqueId();
        this.manager = null;
        // default is enable true
        this.options.enable = ifUndefined(this.options.enable, true);
        this.state = STATE_POSSIBLE;
        this.simultaneous = {};
        this.requireFail = [];
    }
    Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},
        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set: function (options) {
            Object.assign(this.options, options);
            // also update the touchAction, in case something changed about the directions/enabled state
            this.manager && this.manager.touchAction.update();
            return this;
        },
        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
                return this;
            }
            var /** @type {?} */ simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        },
        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
                return this;
            }
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
        },
        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
                return this;
            }
            var /** @type {?} */ requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        },
        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure: function (otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
                return this;
            }
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var /** @type {?} */ index = inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        },
        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures: function () {
            return this.requireFail.length > 0;
        },
        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith: function (otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        },
        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit: function (input) {
            var /** @type {?} */ self = this;
            var /** @type {?} */ state = this.state;
            /**
             * @param {?} event
             * @return {?}
             */
            function emit(event) {
                self.manager.emit(event, input);
            }
            // 'panstart' and 'panmove'
            if (state < STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }
            emit(self.options.event); // simple 'eventName' events
            if (input.additionalEvent) {
                emit(input.additionalEvent);
            }
            // panend and pancancel
            if (state >= STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }
        },
        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit: function (input) {
            if (this.canEmit()) {
                return this.emit(input);
            }
            // it's failing anyway
            this.state = STATE_FAILED;
        },
        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit: function () {
            var /** @type {?} */ i = 0;
            while (i < this.requireFail.length) {
                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                    return false;
                }
                i++;
            }
            return true;
        },
        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize: function (inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            var /** @type {?} */ inputDataClone = Object.assign({}, inputData);
            // is is enabled and allow recognizing?
            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
                this.reset();
                this.state = STATE_FAILED;
                return;
            }
            // reset when we've reached the end
            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
                this.state = STATE_POSSIBLE;
            }
            this.state = this.process(inputDataClone);
            // the recognizer has recognized a gesture
            // so trigger an event
            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
                this.tryEmit(inputDataClone);
            }
        },
        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process: function (inputData) { },
        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction: function () { },
        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset: function () { }
    };
    /**
     * get a usable string, used as event postfix
     * @param {?} state
     * @return {?}
     */
    function stateStr(state) {
        if (state & STATE_CANCELLED) {
            return 'cancel';
        }
        else if (state & STATE_ENDED) {
            return 'end';
        }
        else if (state & STATE_CHANGED) {
            return 'move';
        }
        else if (state & STATE_BEGAN) {
            return 'start';
        }
        return '';
    }
    /**
     * direction cons to string
     * @param {?} direction
     * @return {?}
     */
    function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
            return 'down';
        }
        else if (direction == DIRECTION_UP) {
            return 'up';
        }
        else if (direction == exports.DIRECTION_LEFT) {
            return 'left';
        }
        else if (direction == exports.DIRECTION_RIGHT) {
            return 'right';
        }
        return '';
    }
    /**
     * get a recognizer by name if it is bound to a manager
     * @param {?} otherRecognizer
     * @param {?} recognizer
     * @return {?}
     */
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var /** @type {?} */ manager = recognizer.manager;
        if (manager) {
            return manager.get(otherRecognizer);
        }
        return otherRecognizer;
    }
    /**
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @return {?}
     */
    function AttrRecognizer() {
        Recognizer.apply(this, arguments);
    }
    inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
        },
        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest: function (input) {
            var /** @type {?} */ optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
        },
        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process: function (input) {
            var /** @type {?} */ state = this.state;
            var /** @type {?} */ eventType = input.eventType;
            var /** @type {?} */ isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var /** @type {?} */ isValid = this.attrTest(input);
            // on cancel input and we've recognized before, return STATE_CANCELLED
            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                return state | STATE_CANCELLED;
            }
            else if (isRecognized || isValid) {
                if (eventType & INPUT_END) {
                    return state | STATE_ENDED;
                }
                else if (!(state & STATE_BEGAN)) {
                    return STATE_BEGAN;
                }
                return state | STATE_CHANGED;
            }
            return STATE_FAILED;
        }
    });
    /**
     * Pan
     * Recognized when the pointer is down and moved in the allowed direction.
     * @return {?}
     */
    function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);
        this.pX = null;
        this.pY = null;
    }
    inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
        },
        getTouchAction: function () {
            var /** @type {?} */ direction = this.options.direction;
            var /** @type {?} */ actions = [];
            if (direction & exports.DIRECTION_HORIZONTAL) {
                actions.push(TOUCH_ACTION_PAN_Y);
            }
            if (direction & exports.DIRECTION_VERTICAL) {
                actions.push(TOUCH_ACTION_PAN_X);
            }
            return actions;
        },
        directionTest: function (input) {
            var /** @type {?} */ options = this.options;
            var /** @type {?} */ hasMoved = true;
            var /** @type {?} */ distance = input.distance;
            var /** @type {?} */ direction = input.direction;
            var /** @type {?} */ x = input.deltaX;
            var /** @type {?} */ y = input.deltaY;
            // lock to axis?
            if (!(direction & options.direction)) {
                if (options.direction & exports.DIRECTION_HORIZONTAL) {
                    direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? exports.DIRECTION_LEFT : exports.DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.deltaX);
                }
                else {
                    direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.deltaY);
                }
            }
            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
        },
        attrTest: function (input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) &&
                (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
        },
        emit: function (input) {
            this.pX = input.deltaX;
            this.pY = input.deltaY;
            var /** @type {?} */ direction = directionStr(input.direction);
            if (direction) {
                input.additionalEvent = this.options.event + direction;
            }
            this._super.emit.call(this, input);
        }
    });
    /**
     * Pinch
     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * @return {?}
     */
    function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }
    inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function () {
            return [TOUCH_ACTION_NONE];
        },
        attrTest: function (input) {
            return this._super.attrTest.call(this, input) &&
                (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
        },
        emit: function (input) {
            if (input.scale !== 1) {
                var /** @type {?} */ inOut = input.scale < 1 ? 'in' : 'out';
                input.additionalEvent = this.options.event + inOut;
            }
            this._super.emit.call(this, input);
        }
    });
    /**
     * Press
     * Recognized when the pointer is down for x ms without any movement.
     * @return {?}
     */
    function PressRecognizer() {
        Recognizer.apply(this, arguments);
        this._timer = null;
        this._input = null;
    }
    inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
            event: 'press',
            pointers: 1,
            time: 251,
            threshold: 9 // a minimal movement is ok, but keep it low
        },
        getTouchAction: function () {
            return [TOUCH_ACTION_AUTO];
        },
        process: function (input) {
            var /** @type {?} */ options = this.options;
            var /** @type {?} */ validPointers = input.pointers.length === options.pointers;
            var /** @type {?} */ validMovement = input.distance < options.threshold;
            var /** @type {?} */ validTime = input.deltaTime > options.time;
            this._input = input;
            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
                this.reset();
            }
            else if (input.eventType & INPUT_START) {
                this.reset();
                this._timer = setTimeoutContext(function () {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                }, options.time, this);
            }
            else if (input.eventType & INPUT_END) {
                return STATE_RECOGNIZED;
            }
            return STATE_FAILED;
        },
        reset: function () {
            clearTimeout(this._timer);
        },
        emit: function (input) {
            if (this.state !== STATE_RECOGNIZED) {
                return;
            }
            if (input && (input.eventType & INPUT_END)) {
                this.manager.emit(this.options.event + 'up', input);
            }
            else {
                this._input.timeStamp = now();
                this.manager.emit(this.options.event, this._input);
            }
        }
    });
    /**
     * Rotate
     * Recognized when two or more pointer are moving in a circular motion.
     * @return {?}
     */
    function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }
    inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function () {
            return [TOUCH_ACTION_NONE];
        },
        attrTest: function (input) {
            return this._super.attrTest.call(this, input) &&
                (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
        }
    });
    /**
     * Swipe
     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
     * @return {?}
     */
    function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }
    inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: exports.DIRECTION_HORIZONTAL | exports.DIRECTION_VERTICAL,
            pointers: 1
        },
        getTouchAction: function () {
            return PanRecognizer.prototype.getTouchAction.call(this);
        },
        attrTest: function (input) {
            var /** @type {?} */ direction = this.options.direction;
            var /** @type {?} */ velocity;
            if (direction & (exports.DIRECTION_HORIZONTAL | exports.DIRECTION_VERTICAL)) {
                velocity = input.overallVelocity;
            }
            else if (direction & exports.DIRECTION_HORIZONTAL) {
                velocity = input.overallVelocityX;
            }
            else if (direction & exports.DIRECTION_VERTICAL) {
                velocity = input.overallVelocityY;
            }
            return this._super.attrTest.call(this, input) &&
                direction & input.offsetDirection &&
                input.distance > this.options.threshold &&
                input.maxPointers == this.options.pointers &&
                abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
        },
        emit: function (input) {
            var /** @type {?} */ direction = directionStr(input.offsetDirection);
            if (direction) {
                this.manager.emit(this.options.event + direction, input);
            }
            this.manager.emit(this.options.event, input);
        }
    });
    /**
     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
     * a single tap.
     *
     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
     * multi-taps being recognized.
     * @return {?}
     */
    function TapRecognizer() {
        Recognizer.apply(this, arguments);
        // previous time and center,
        // used for tap counting
        this.pTime = false;
        this.pCenter = false;
        this._timer = null;
        this._input = null;
        this.count = 0;
    }
    inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 9,
            posThreshold: 10 // a multi-tap can be a bit off the initial position
        },
        getTouchAction: function () {
            return [TOUCH_ACTION_MANIPULATION];
        },
        process: function (input) {
            var /** @type {?} */ options = this.options;
            var /** @type {?} */ validPointers = input.pointers.length === options.pointers;
            var /** @type {?} */ validMovement = input.distance < options.threshold;
            var /** @type {?} */ validTouchTime = input.deltaTime < options.time;
            this.reset();
            if ((input.eventType & INPUT_START) && (this.count === 0)) {
                return this.failTimeout();
            }
            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (validMovement && validTouchTime && validPointers) {
                if (input.eventType != INPUT_END) {
                    return this.failTimeout();
                }
                var /** @type {?} */ validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
                var /** @type {?} */ validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
                this.pTime = input.timeStamp;
                this.pCenter = input.center;
                if (!validMultiTap || !validInterval) {
                    this.count = 1;
                }
                else {
                    this.count += 1;
                }
                this._input = input;
                // if tap count matches we have recognized it,
                // else it has began recognizing...
                var /** @type {?} */ tapCount = this.count % options.taps;
                if (tapCount === 0) {
                    // no failing requirements, immediately trigger the tap event
                    // or wait as long as the multitap interval to trigger
                    if (!this.hasRequireFailures()) {
                        return STATE_RECOGNIZED;
                    }
                    else {
                        this._timer = setTimeoutContext(function () {
                            this.state = STATE_RECOGNIZED;
                            this.tryEmit();
                        }, options.interval, this);
                        return STATE_BEGAN;
                    }
                }
            }
            return STATE_FAILED;
        },
        failTimeout: function () {
            this._timer = setTimeoutContext(function () {
                this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
        },
        reset: function () {
            clearTimeout(this._timer);
        },
        emit: function () {
            if (this.state == STATE_RECOGNIZED) {
                this._input.tapCount = this.count;
                this.manager.emit(this.options.event, this._input);
            }
        }
    });
    /**
     * Simple way to create a manager with a default set of recognizers.
     * @param {?} element
     * @param {?} options
     * @return {?}
     */
    function Hammer(element, options) {
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, _defaults.preset);
        return new ((Manager))(element, options);
    }
    exports.Hammer = Hammer;
    /**
     * @const {string}
     */
    var /** @type {?} */ VERSION = '2.0.6';
    /**
     * default settings
     * \@namespace
     */
    var _defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,
        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,
        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,
        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,
        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,
        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
            // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
            [RotateRecognizer, { enable: false }],
            [PinchRecognizer, { enable: false }, ['rotate']],
            [SwipeRecognizer, { direction: exports.DIRECTION_HORIZONTAL }],
            [PanRecognizer, { direction: exports.DIRECTION_HORIZONTAL }, ['swipe']],
            [TapRecognizer],
            [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
            [PressRecognizer]
        ],
        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',
            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',
            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',
            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',
            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',
            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
        }
    };
    var /** @type {?} */ STOP = 1;
    var /** @type {?} */ FORCED_STOP = 2;
    /**
     * Manager
     * @param {?} element
     * @param {?} options
     * @return {?}
     */
    function Manager(element, options) {
        this.options = Object.assign({}, _defaults, options || {});
        this.options.inputTarget = this.options.inputTarget || element;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new ((TouchAction))(this, this.options.touchAction);
        toggleCssProps(this, true);
        each(this.options.recognizers, function (item) {
            var /** @type {?} */ recognizer = this.add(new (item[0])(item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
        }, this);
    }
    Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set: function (options) {
            Object.assign(this.options, options);
            // Options that need a little more setup
            if (options.touchAction) {
                this.touchAction.update();
            }
            if (options.inputTarget) {
                // Clean up existing event listeners and reinitialize
                this.input.destroy();
                this.input.target = options.inputTarget;
                this.input.init();
            }
            return this;
        },
        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop: function (force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        },
        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize: function (inputData) {
            var /** @type {?} */ session = this.session;
            if (session.stopped) {
                return;
            }
            // run the touch-action polyfill
            this.touchAction.preventDefaults(inputData);
            var /** @type {?} */ recognizer;
            var /** @type {?} */ recognizers = this.recognizers;
            // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`
            var /** @type {?} */ curRecognizer = session.curRecognizer;
            // reset when the last recognizer is recognized
            // or when we're in a new session
            if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
                curRecognizer = session.curRecognizer = null;
            }
            var /** @type {?} */ i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];
                // find out if we are allowed try to recognize the input for this one.
                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                //      that is being recognized.
                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                //      this can be setup with the `recognizeWith()` method on the recognizer.
                if (session.stopped !== FORCED_STOP && (!curRecognizer || recognizer == curRecognizer ||
                    recognizer.canRecognizeWith(curRecognizer))) {
                    recognizer.recognize(inputData);
                }
                else {
                    recognizer.reset();
                }
                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                // current active recognizer. but only if we don't already have an active recognizer
                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        },
        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get: function (recognizer) {
            if (recognizer instanceof Recognizer) {
                return recognizer;
            }
            var /** @type {?} */ recognizers = this.recognizers;
            for (var /** @type {?} */ i = 0; i < recognizers.length; i++) {
                if (recognizers[i].options.event == recognizer) {
                    return recognizers[i];
                }
            }
            return null;
        },
        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add: function (recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
                return this;
            }
            // remove existing
            var /** @type {?} */ existing = this.get(recognizer.options.event);
            if (existing) {
                this.remove(existing);
            }
            this.recognizers.push(recognizer);
            recognizer.manager = this;
            this.touchAction.update();
            return recognizer;
        },
        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove: function (recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
                return this;
            }
            recognizer = this.get(recognizer);
            // let's make sure this recognizer exists
            if (recognizer) {
                var /** @type {?} */ recognizers = this.recognizers;
                var /** @type {?} */ index = inArray(recognizers, recognizer);
                if (index !== -1) {
                    recognizers.splice(index, 1);
                    this.touchAction.update();
                }
            }
            return this;
        },
        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on: function (events, handler) {
            var /** @type {?} */ handlers = this.handlers;
            each(splitStr(events), function (event) {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        },
        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off: function (events, handler) {
            var /** @type {?} */ handlers = this.handlers;
            each(splitStr(events), function (event) {
                if (!handler) {
                    delete handlers[event];
                }
                else {
                    handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
                }
            });
            return this;
        },
        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit: function (event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
                triggerDomEvent(event, data);
            }
            // no handlers, so skip it all
            var /** @type {?} */ handlers = this.handlers[event] && this.handlers[event].slice();
            if (!handlers || !handlers.length) {
                return;
            }
            data.type = event;
            data.preventDefault = function () {
                data.srcEvent.preventDefault();
            };
            var /** @type {?} */ i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        },
        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy: function () {
            this.element && toggleCssProps(this, false);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
        }
    };
    /**
     * add/remove the css properties as defined in manager.options.cssProps
     * @param {?} manager
     * @param {?} add
     * @return {?}
     */
    function toggleCssProps(manager, add) {
        var /** @type {?} */ element = manager.element;
        if (!element.style) {
            return;
        }
        each(manager.options.cssProps, function (value, name) {
            element.style[prefixed(element.style, name)] = add ? value : '';
        });
    }
    /**
     * trigger dom event
     * @param {?} event
     * @param {?} data
     * @return {?}
     */
    function triggerDomEvent(event, data) {
        var /** @type {?} */ gestureEvent = doc.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
    }
    Object.assign(Hammer, {
        INPUT_START: INPUT_START,
        INPUT_MOVE: INPUT_MOVE,
        INPUT_END: INPUT_END,
        INPUT_CANCEL: INPUT_CANCEL,
        STATE_POSSIBLE: STATE_POSSIBLE,
        STATE_BEGAN: STATE_BEGAN,
        STATE_CHANGED: STATE_CHANGED,
        STATE_ENDED: STATE_ENDED,
        STATE_RECOGNIZED: STATE_RECOGNIZED,
        STATE_CANCELLED: STATE_CANCELLED,
        STATE_FAILED: STATE_FAILED,
        DIRECTION_NONE: DIRECTION_NONE,
        DIRECTION_LEFT: exports.DIRECTION_LEFT,
        DIRECTION_RIGHT: exports.DIRECTION_RIGHT,
        DIRECTION_UP: DIRECTION_UP,
        DIRECTION_DOWN: DIRECTION_DOWN,
        DIRECTION_HORIZONTAL: exports.DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL: exports.DIRECTION_VERTICAL,
        DIRECTION_ALL: DIRECTION_ALL,
        Manager: Manager,
        Input: Input,
        TouchAction: TouchAction,
        TouchInput: TouchInput,
        MouseInput: MouseInput,
        PointerEventInput: PointerEventInput,
        TouchMouseInput: TouchMouseInput,
        SingleTouchInput: SingleTouchInput,
        Recognizer: Recognizer,
        AttrRecognizer: AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,
        on: addEventListeners,
        off: removeEventListeners,
        each: each,
        inherit: inherit,
        bindFn: bindFn,
        prefixed: prefixed
    });
    win.Hammer = Hammer;
});
//# sourceMappingURL=hammer.js.map
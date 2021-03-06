import { isActivatedDisabled } from './activator-base';
var Activator = (function () {
    /**
     * @param {?} app
     * @param {?} config
     * @param {?} dom
     */
    function Activator(app, config, dom) {
        this.app = app;
        this.dom = dom;
        this._queue = [];
        this._active = [];
        this.activatedDelay = ADD_ACTIVATED_DEFERS;
        this.clearDelay = CLEAR_STATE_DEFERS;
        this._css = config.get('activatedClass', 'activated');
    }
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    Activator.prototype.clickAction = function (ev, activatableEle, startCoord) {
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        // a click happened, so immediately deactive all activated elements
        this._scheduleClear();
        this._queue.length = 0;
        for (var /** @type {?} */ i = 0; i < this._active.length; i++) {
            this._active[i].classList.remove(this._css);
        }
        this._active.length = 0;
        // then immediately activate this element
        if (activatableEle && activatableEle.parentNode) {
            this._active.push(activatableEle);
            activatableEle.classList.add(this._css);
        }
    };
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    Activator.prototype.downAction = function (ev, activatableEle, startCoord) {
        var _this = this;
        // the user just pressed down
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        this.unscheduleClear();
        this.deactivate(true);
        // queue to have this element activated
        this._queue.push(activatableEle);
        this._activeDefer = this.dom.write(function () {
            _this._activeDefer = null;
            var /** @type {?} */ activatableEle;
            for (var /** @type {?} */ i = 0; i < _this._queue.length; i++) {
                activatableEle = _this._queue[i];
                _this._active.push(activatableEle);
                activatableEle.classList.add(_this._css);
            }
            _this._queue.length = 0;
        }, this.activatedDelay);
    };
    /**
     * @param {?} ev
     * @param {?} activatableEle
     * @param {?} startCoord
     * @return {?}
     */
    Activator.prototype.upAction = function (ev, activatableEle, startCoord) {
        this._scheduleClear();
    };
    /**
     * @return {?}
     */
    Activator.prototype._scheduleClear = function () {
        var _this = this;
        if (this._clearDefer) {
            return;
        }
        this._clearDefer = this.dom.write(function () {
            _this.clearState(true);
            _this._clearDefer = null;
        }, this.clearDelay);
    };
    /**
     * @return {?}
     */
    Activator.prototype.unscheduleClear = function () {
        if (this._clearDefer) {
            this._clearDefer();
            this._clearDefer = null;
        }
    };
    /**
     * @param {?} animated
     * @return {?}
     */
    Activator.prototype.clearState = function (animated) {
        var _this = this;
        if (!this.app.isEnabled()) {
            // the app is actively disabled, so don't bother deactivating anything.
            // this makes it easier on the GPU so it doesn't have to redraw any
            // buttons during a transition. This will retry in XX milliseconds.
            this.dom.write(function () {
                _this.clearState(animated);
            }, 600);
        }
        else {
            // not actively transitioning, good to deactivate any elements
            this.deactivate(animated);
        }
    };
    /**
     * @param {?} animated
     * @return {?}
     */
    Activator.prototype.deactivate = function (animated) {
        this._clearDeferred();
        this._queue.length = 0;
        var /** @type {?} */ ele;
        for (var /** @type {?} */ i = 0; i < this._active.length; i++) {
            ele = this._active[i];
            ((ele.style))[this.dom.plt.Css.transition] = animated ? '' : 'none';
            ele.classList.remove(this._css);
        }
        this._active.length = 0;
    };
    /**
     * @return {?}
     */
    Activator.prototype._clearDeferred = function () {
        // Clear any active deferral
        if (this._activeDefer) {
            this._activeDefer();
            this._activeDefer = null;
        }
    };
    return Activator;
}());
export { Activator };
function Activator_tsickle_Closure_declarations() {
    /** @type {?} */
    Activator.prototype._queue;
    /** @type {?} */
    Activator.prototype._active;
    /** @type {?} */
    Activator.prototype._activeDefer;
    /** @type {?} */
    Activator.prototype._clearDefer;
    /** @type {?} */
    Activator.prototype._css;
    /** @type {?} */
    Activator.prototype.activatedDelay;
    /** @type {?} */
    Activator.prototype.clearDelay;
    /** @type {?} */
    Activator.prototype.app;
    /** @type {?} */
    Activator.prototype.dom;
}
var /** @type {?} */ ADD_ACTIVATED_DEFERS = 80;
var /** @type {?} */ CLEAR_STATE_DEFERS = 80;
//# sourceMappingURL=activator.js.map
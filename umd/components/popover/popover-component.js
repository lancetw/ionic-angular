(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../../platform/key", "../../navigation/nav-params", "../../platform/platform", "../../navigation/view-controller", "../../gestures/gesture-controller", "../../util/module-loader"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var key_1 = require("../../platform/key");
    var nav_params_1 = require("../../navigation/nav-params");
    var platform_1 = require("../../platform/platform");
    var view_controller_1 = require("../../navigation/view-controller");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var module_loader_1 = require("../../util/module-loader");
    /**
     * @hidden
     */
    var PopoverCmp = (function () {
        /**
         * @param {?} _cfr
         * @param {?} _elementRef
         * @param {?} _renderer
         * @param {?} _config
         * @param {?} _plt
         * @param {?} _navParams
         * @param {?} _viewCtrl
         * @param {?} gestureCtrl
         * @param {?} moduleLoader
         */
        function PopoverCmp(_cfr, _elementRef, _renderer, _config, _plt, _navParams, _viewCtrl, gestureCtrl, moduleLoader) {
            this._cfr = _cfr;
            this._elementRef = _elementRef;
            this._renderer = _renderer;
            this._config = _config;
            this._plt = _plt;
            this._navParams = _navParams;
            this._viewCtrl = _viewCtrl;
            this.moduleLoader = moduleLoader;
            this._gestureBlocker = gestureCtrl.createBlocker(gesture_controller_1.BLOCK_ALL);
            this.d = _navParams.data.opts;
            _renderer.setElementClass(_elementRef.nativeElement, "popover-" + _config.get('mode'), true);
            if (this.d.cssClass) {
                this.d.cssClass.split(' ').forEach(function (cssClass) {
                    // Make sure the class isn't whitespace, otherwise it throws exceptions
                    if (cssClass.trim() !== '')
                        _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
                });
            }
            this.id = (++popoverIds);
        }
        /**
         * @return {?}
         */
        PopoverCmp.prototype.ionViewPreLoad = function () {
            this._plt.focusOutActiveElement();
            this._load(this._navParams.data.component);
        };
        /**
         * @param {?} component
         * @return {?}
         */
        PopoverCmp.prototype._load = function (component) {
            if (component) {
                var /** @type {?} */ cfr = this.moduleLoader.getComponentFactoryResolver(component);
                if (!cfr) {
                    cfr = this._cfr;
                }
                var /** @type {?} */ componentFactory = cfr.resolveComponentFactory(component);
                // ******** DOM WRITE ****************
                var /** @type {?} */ componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
                this._viewCtrl._setInstance(componentRef.instance);
                this._enabled = true;
                // Subscribe to events in order to block gestures
                // TODO, should we unsubscribe? memory leak?
                this._viewCtrl.willEnter.subscribe(this._viewWillEnter.bind(this));
                this._viewCtrl.didLeave.subscribe(this._viewDidLeave.bind(this));
            }
        };
        /**
         * @return {?}
         */
        PopoverCmp.prototype._viewWillEnter = function () {
            this._gestureBlocker.block();
        };
        /**
         * @return {?}
         */
        PopoverCmp.prototype._viewDidLeave = function () {
            this._gestureBlocker.unblock();
        };
        /**
         * @param {?} componentRef
         * @param {?} className
         * @return {?}
         */
        PopoverCmp.prototype._setCssClass = function (componentRef, className) {
            this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
        };
        /**
         * @return {?}
         */
        PopoverCmp.prototype._bdClick = function () {
            if (this._enabled && this.d.enableBackdropDismiss) {
                return this._viewCtrl.dismiss(null, 'backdrop');
            }
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PopoverCmp.prototype._keyUp = function (ev) {
            if (this._enabled && ev.keyCode === key_1.KEY_ESCAPE && this._viewCtrl.isLast()) {
                this._bdClick();
            }
        };
        /**
         * @return {?}
         */
        PopoverCmp.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            this._gestureBlocker.destroy();
        };
        return PopoverCmp;
    }());
    PopoverCmp.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-popover',
                    template: '<ion-backdrop (click)="_bdClick()" [hidden]="!d.showBackdrop"></ion-backdrop>' +
                        '<div class="popover-wrapper">' +
                        '<div class="popover-arrow"></div>' +
                        '<div class="popover-content">' +
                        '<div class="popover-viewport">' +
                        '<div #viewport nav-viewport></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                },] },
    ];
    /**
     * @nocollapse
     */
    PopoverCmp.ctorParameters = function () { return [
        { type: core_1.ComponentFactoryResolver, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: nav_params_1.NavParams, },
        { type: view_controller_1.ViewController, },
        { type: gesture_controller_1.GestureController, },
        { type: module_loader_1.ModuleLoader, },
    ]; };
    PopoverCmp.propDecorators = {
        '_viewport': [{ type: core_1.ViewChild, args: ['viewport', { read: core_1.ViewContainerRef },] },],
        '_keyUp': [{ type: core_1.HostListener, args: ['body:keyup', ['$event'],] },],
    };
    exports.PopoverCmp = PopoverCmp;
    function PopoverCmp_tsickle_Closure_declarations() {
        /** @type {?} */
        PopoverCmp.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        PopoverCmp.ctorParameters;
        /** @type {?} */
        PopoverCmp.propDecorators;
        /** @type {?} */
        PopoverCmp.prototype._viewport;
        /** @type {?} */
        PopoverCmp.prototype.d;
        /** @type {?} */
        PopoverCmp.prototype._enabled;
        /** @type {?} */
        PopoverCmp.prototype._gestureBlocker;
        /** @type {?} */
        PopoverCmp.prototype.id;
        /** @type {?} */
        PopoverCmp.prototype._cfr;
        /** @type {?} */
        PopoverCmp.prototype._elementRef;
        /** @type {?} */
        PopoverCmp.prototype._renderer;
        /** @type {?} */
        PopoverCmp.prototype._config;
        /** @type {?} */
        PopoverCmp.prototype._plt;
        /** @type {?} */
        PopoverCmp.prototype._navParams;
        /** @type {?} */
        PopoverCmp.prototype._viewCtrl;
        /** @type {?} */
        PopoverCmp.prototype.moduleLoader;
    }
    var /** @type {?} */ popoverIds = -1;
});
//# sourceMappingURL=popover-component.js.map
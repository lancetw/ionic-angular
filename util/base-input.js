var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isUndefined, isArray, isTrueProperty, deepCopy } from './util';
import { Ion } from '../components/ion';
import { TimeoutDebouncer } from './debouncer';
var BaseInput = (function (_super) {
    __extends(BaseInput, _super);
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} name
     * @param {?} _defaultValue
     * @param {?} _form
     * @param {?} _item
     * @param {?} ngControl
     */
    function BaseInput(config, elementRef, renderer, name, _defaultValue, _form, _item, ngControl) {
        var _this = _super.call(this, config, elementRef, renderer, name) || this;
        _this._defaultValue = _defaultValue;
        _this._form = _form;
        _this._item = _item;
        _this._isFocus = false;
        _this._disabled = false;
        _this._debouncer = new TimeoutDebouncer(0);
        _this._init = false;
        _this._initModel = false;
        /**
         * \@output {Range} Emitted when the range selector drag starts.
         */
        _this.ionFocus = new EventEmitter();
        /**
         * \@output {Range} Emitted when the range value changes.
         */
        _this.ionChange = new EventEmitter();
        /**
         * \@output {Range} Emitted when the range selector drag ends.
         */
        _this.ionBlur = new EventEmitter();
        _form && _form.register(_this);
        _this._value = deepCopy(_this._defaultValue);
        if (_item) {
            _this.id = name + '-' + _item.registerInput(name);
            _this._labelId = 'lbl-' + _item.id;
            _this._item.setElementClass('item-' + name, true);
        }
        // If the user passed a ngControl we need to set the valueAccessor
        if (ngControl) {
            ngControl.valueAccessor = _this;
        }
        return _this;
    }
    Object.defineProperty(BaseInput.prototype, "disabled", {
        /**
         * \@input {boolean} If true, the user cannot interact with this element.
         * @return {?}
         */
        get: function () {
            return this._disabled;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this.setDisabledState(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseInput.prototype, "value", {
        /**
         * @return {?}
         */
        get: function () {
            return this._value;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            if (this._writeValue(val)) {
                this.onChange();
                this._fireIonChange();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} val
     * @return {?}
     */
    BaseInput.prototype.setValue = function (val) {
        this.value = val;
    };
    /**
     * @hidden
     * @param {?} isDisabled
     * @return {?}
     */
    BaseInput.prototype.setDisabledState = function (isDisabled) {
        this._disabled = isDisabled = isTrueProperty(isDisabled);
        this._item && this._item.setElementClass("item-" + this._componentName + "-disabled", isDisabled);
    };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    BaseInput.prototype.writeValue = function (val) {
        if (this._writeValue(val)) {
            if (this._initModel) {
                this._fireIonChange();
            }
            else if (this._init) {
                // ngModel fires the first time too late, we need to skip the first ngModel update
                this._initModel = true;
            }
        }
    };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    BaseInput.prototype._writeValue = function (val) {
        (void 0) /* assert */;
        if (isUndefined(val)) {
            return false;
        }
        var /** @type {?} */ normalized;
        if (val === null) {
            normalized = deepCopy(this._defaultValue);
        }
        else {
            normalized = this._inputNormalize(val);
        }
        var /** @type {?} */ notUpdate = isUndefined(normalized) || !this._inputShouldChange(normalized);
        if (notUpdate) {
            return false;
        }
        (void 0) /* console.debug */;
        this._value = normalized;
        this._inputCheckHasValue(normalized);
        if (this._init) {
            this._inputUpdated();
        }
        return true;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._fireIonChange = function () {
        var _this = this;
        if (this._init) {
            this._debouncer.debounce(function () {
                (void 0) /* assert */;
                _this.ionChange.emit(_this._inputChangeEvent());
                _this._initModel = true;
            });
        }
    };
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    BaseInput.prototype.registerOnChange = function (fn) {
        this._onChanged = fn;
    };
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    BaseInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._initialize = function () {
        if (this._init) {
            (void 0) /* assert */;
            return;
        }
        this._init = true;
        if (isPresent(this._value)) {
            this._inputUpdated();
        }
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._fireFocus = function () {
        if (this._isFocus) {
            return;
        }
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._isFocus = true;
        this.ionFocus.emit(this);
        this._inputUpdated();
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._fireBlur = function () {
        if (!this._isFocus) {
            return;
        }
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._isFocus = false;
        this.ionBlur.emit(this);
        this._inputUpdated();
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype.onChange = function () {
        this._onChanged && this._onChanged(this._inputNgModelEvent());
        this._onTouched && this._onTouched();
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype.isFocus = function () {
        return this._isFocus;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype.hasValue = function () {
        var /** @type {?} */ val = this._value;
        return isArray(val)
            ? val.length > 0
            : isPresent(val);
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype.ngOnDestroy = function () {
        this._form && this._form.deregister(this);
        this._init = false;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype.ngAfterContentInit = function () {
        this._initialize();
    };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    BaseInput.prototype._inputCheckHasValue = function (val) {
        if (!this._item) {
            return;
        }
        this._item.setElementClass('input-has-value', this.hasValue());
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype.initFocus = function () { };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    BaseInput.prototype._inputNormalize = function (val) {
        return val;
    };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    BaseInput.prototype._inputShouldChange = function (val) {
        return this._value !== val;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._inputChangeEvent = function () {
        return this;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._inputNgModelEvent = function () {
        return this._value;
    };
    /**
     * @hidden
     * @return {?}
     */
    BaseInput.prototype._inputUpdated = function () {
        (void 0) /* assert */;
    };
    return BaseInput;
}(Ion));
export { BaseInput };
BaseInput.propDecorators = {
    'ionFocus': [{ type: Output },],
    'ionChange': [{ type: Output },],
    'ionBlur': [{ type: Output },],
    'disabled': [{ type: Input },],
};
function BaseInput_tsickle_Closure_declarations() {
    /** @type {?} */
    BaseInput.propDecorators;
    /** @type {?} */
    BaseInput.prototype._value;
    /** @type {?} */
    BaseInput.prototype._onChanged;
    /** @type {?} */
    BaseInput.prototype._onTouched;
    /** @type {?} */
    BaseInput.prototype._isFocus;
    /** @type {?} */
    BaseInput.prototype._labelId;
    /** @type {?} */
    BaseInput.prototype._disabled;
    /** @type {?} */
    BaseInput.prototype._debouncer;
    /** @type {?} */
    BaseInput.prototype._init;
    /** @type {?} */
    BaseInput.prototype._initModel;
    /** @type {?} */
    BaseInput.prototype.id;
    /**
     * \@output {Range} Emitted when the range selector drag starts.
     * @type {?}
     */
    BaseInput.prototype.ionFocus;
    /**
     * \@output {Range} Emitted when the range value changes.
     * @type {?}
     */
    BaseInput.prototype.ionChange;
    /**
     * \@output {Range} Emitted when the range selector drag ends.
     * @type {?}
     */
    BaseInput.prototype.ionBlur;
    /** @type {?} */
    BaseInput.prototype._defaultValue;
    /** @type {?} */
    BaseInput.prototype._form;
    /** @type {?} */
    BaseInput.prototype._item;
}
//# sourceMappingURL=base-input.js.map
import { ChangeDetectorRef, ContentChild, Directive, ElementRef, Input, IterableDiffers, NgZone, Renderer } from '@angular/core';
import { adjustRendered, calcDimensions, estimateHeight, initReadNodes, processRecords, populateNodeData, updateDimensions, updateNodeContext, writeToNodes } from './virtual-util';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { isBlank, isFunction, isPresent } from '../../util/util';
import { Platform } from '../../platform/platform';
import { ViewController } from '../../navigation/view-controller';
import { VirtualItem } from './virtual-item';
import { VirtualFooter } from './virtual-footer';
import { VirtualHeader } from './virtual-header';
/**
 * \@name VirtualScroll
 * \@description
 * Virtual Scroll displays a virtual, "infinite" list. An array of records
 * is passed to the virtual scroll containing the data to create templates
 * for. The template created for each record, referred to as a cell, can
 * consist of items, headers, and footers.
 *
 * For performance reasons, not every record in the list is rendered at once;
 * instead a small subset of records (enough to fill the viewport) are rendered
 * and reused as the user scrolls.
 *
 * ### The Basics
 *
 * The array of records should be passed to the `virtualScroll` property.
 * The data given to the `virtualScroll` property must be an array. An item
 * template with the `*virtualItem` property is required in the `virtualScroll`.
 * The `virtualScroll` and `*virtualItem` properties can be added to any element.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="let item">
 *     {% raw %}{{ item }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Section Headers and Footers
 *
 * Section headers and footers are optional. They can be dynamically created
 * from developer-defined functions. For example, a large list of contacts
 * usually has a divider for each letter in the alphabet. Developers provide
 * their own custom function to be called on each record. The logic in the
 * custom function should determine whether to create the section template
 * and what data to provide to the template. The custom function should
 * return `null` if a template shouldn't be created.
 *
 * ```html
 * <ion-list [virtualScroll]="items" [headerFn]="myHeaderFn">
 *
 *   <ion-item-divider *virtualHeader="let header">
 *     Header: {% raw %}{{ header }}{% endraw %}
 *   </ion-item-divider>
 *
 *   <ion-item *virtualItem="let item">
 *     Item: {% raw %}{{ item }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * Below is an example of a custom function called on every record. It
 * gets passed the individual record, the record's index number,
 * and the entire array of records. In this example, after every 20
 * records a header will be inserted. So between the 19th and 20th records,
 * between the 39th and 40th, and so on, a `<ion-item-divider>` will
 * be created and the template's data will come from the function's
 * returned data.
 *
 * ```ts
 * myHeaderFn(record, recordIndex, records) {
 *   if (recordIndex % 20 === 0) {
 *     return 'Header ' + recordIndex;
 *   }
 *   return null;
 * }
 * ```
 *
 *
 * ### Approximate Widths and Heights
 *
 * If the height of items in the virtual scroll are not close to the
 * default size of 40px, it is extremely important to provide an value for
 * approxItemHeight height. An exact pixel-perfect size is not necessary,
 * but without an estimate the virtual scroll will not render correctly.
 *
 * The approximate width and height of each template is used to help
 * determine how many cells should be created, and to help calculate
 * the height of the scrollable area. Note that the actual rendered size
 * of each cell comes from the app's CSS, whereas this approximation
 * is only used to help calculate initial dimensions.
 *
 * It's also important to know that Ionic's default item sizes have
 * slightly different heights between platforms, which is perfectly fine.
 *
 *
 * ### Images Within Virtual Scroll
 *
 * HTTP requests, image decoding, and image rendering can cause jank while
 * scrolling. In order to better control images, Ionic provides `<ion-img>`
 * to manage HTTP requests and image rendering. While scrolling through items
 * quickly, `<ion-img>` knows when and when not to make requests, when and
 * when not to render images, and only loads the images that are viewable
 * after scrolling. [Read more about `ion-img`.](../../img/Img/)
 *
 * It's also important for app developers to ensure image sizes are locked in,
 * and after images have fully loaded they do not change size and affect any
 * other element sizes. Simply put, to ensure rendering bugs are not introduced,
 * it's vital that elements within a virtual item does not dynamically change.
 *
 * For virtual scrolling, the natural effects of the `<img>` are not desirable
 * features. We recommend using the `<ion-img>` component over the native
 * `<img>` element because when an `<img>` element is added to the DOM, it
 * immediately makes a HTTP request for the image file. Additionally, `<img>`
 * renders whenever it wants which could be while the user is scrolling. However,
 * `<ion-img>` is governed by the containing `ion-content` and does not render
 * images while scrolling quickly.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <ion-item *virtualItem="let item">
 *     <ion-avatar item-start>
 *       <ion-img [src]="item.avatarUrl"></ion-img>
 *     </ion-avatar>
 *    {% raw %} {{ item.firstName }} {{ item.lastName }}{% endraw %}
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 *
 * ### Custom Components
 *
 * If a custom component is going to be used within Virtual Scroll, it's best
 * to wrap it with a good old `<div>` to ensure the component is rendered
 * correctly. Since each custom component's implementation and internals can be
 * quite different, wrapping within a `<div>` is a safe way to make sure
 * dimensions are measured correctly.
 *
 * ```html
 * <ion-list [virtualScroll]="items">
 *
 *   <div *virtualItem="let item">
 *     <my-custom-item [item]="item">
 *       {% raw %} {{ item }}{% endraw %}
 *     </my-custom-item>
 *   </div>
 *
 * </ion-list>
 * ```
 *
 *
 * ## Virtual Scroll Performance Tips
 *
 * #### iOS Cordova WKWebView
 *
 * When deploying to iOS with Cordova, it's highly recommended to use the
 * [WKWebView plugin](http://blog.ionic.io/cordova-ios-performance-improvements-drop-in-speed-with-wkwebview/)
 * in order to take advantage of iOS's higher performimg webview. Additionally,
 * WKWebView is superior at scrolling efficiently in comparision to the older
 * UIWebView.
 *
 * #### Lock in element dimensions and locations
 *
 * In order for virtual scroll to efficiently size and locate every item, it's
 * very important every element within each virtual item does not dynamically
 * change its dimensions or location. The best way to ensure size and location
 * does not change, it's recommended each virtual item has locked in its size
 * via CSS.
 *
 * #### Use `ion-img` for images
 *
 * When including images within Virtual Scroll, be sure to use
 * [`ion-img`](../img/Img/) rather than the standard `<img>` HTML element.
 * With `ion-img`, images are lazy loaded so only the viewable ones are
 * rendered, and HTTP requests are efficiently controlled while scrolling.
 *
 * #### Set Approximate Widths and Heights
 *
 * As mentioned above, all elements should lock in their dimensions. However,
 * virtual scroll isn't aware of the dimensions until after they have been
 * rendered. For the initial render, virtual scroll still needs to set
 * how many items should be built. With "approx" property inputs, such as
 * `approxItemHeight`, we're able to give virtual scroll an approximate size,
 * therefore allowing virtual scroll to decide how many items should be
 * created.
 *
 * #### Changing dataset should use `virtualTrackBy`
 *
 * It is possible for the identities of elements in the iterator to change
 * while the data does not. This can happen, for example, if the iterator
 * produced from an RPC to the server, and that RPC is re-run. Even if the
 * "data" hasn't changed, the second response will produce objects with
 * different identities, and Ionic will tear down the entire DOM and rebuild
 * it. This is an expensive operation and should be avoided if possible.
 *
 * #### Efficient headers and footer functions
 *
 * Each virtual item must stay extremely efficient, but one way to really
 * kill its performance is to perform any DOM operations within section header
 * and footer functions. These functions are called for every record in the
 * dataset, so please make sure they're performant.
 *
 */
export class VirtualScroll {
    /**
     * @param {?} _iterableDiffers
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} _zone
     * @param {?} _cd
     * @param {?} _content
     * @param {?} _plt
     * @param {?} _ctrl
     * @param {?} _config
     * @param {?} _dom
     */
    constructor(_iterableDiffers, _elementRef, _renderer, _zone, _cd, _content, _plt, _ctrl, _config, _dom) {
        this._iterableDiffers = _iterableDiffers;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._zone = _zone;
        this._cd = _cd;
        this._content = _content;
        this._plt = _plt;
        this._ctrl = _ctrl;
        this._config = _config;
        this._dom = _dom;
        this._init = false;
        this._lastEle = false;
        this._records = [];
        this._cells = [];
        this._nodes = [];
        this._vHeight = 0;
        this._lastCheck = 0;
        this._recordSize = 0;
        this._data = {
            scrollTop: 0,
        };
        this._queue = SCROLL_QUEUE_NO_CHANGES;
        /**
         * \@input {number} The buffer ratio is used to decide how many cells
         * should get created when initially rendered. The number is a
         * multiplier against the viewable area's height. For example, if it
         * takes `20` cells to fill up the height of the viewable area, then
         * with a buffer ratio of `3` it will create `60` cells that are
         * available for reuse while scrolling. For better performance, it's
         * better to have more cells than what are required to fill the
         * viewable area. Default is `3`.
         */
        this.bufferRatio = 3;
        /**
         * \@input {string} The approximate width of each item template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is
         * `100%`.
         */
        this.approxItemWidth = '100%';
        /**
         * \@input {string} The approximate width of each header template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions. Default is `100%`.
         */
        this.approxHeaderWidth = '100%';
        /**
         * \@input {string} The approximate height of each header template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is `40px`.
         */
        this.approxHeaderHeight = '40px';
        /**
         * \@input {string} The approximate width of each footer template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This value can use either `px` or `%` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is `100%`.
         */
        this.approxFooterWidth = '100%';
        /**
         * \@input {string} The approximate height of each footer template's cell.
         * This dimension is used to help determine how many cells should
         * be created when initialized, and to help calculate the height of
         * the scrollable area. This height value can only use `px` units.
         * Note that the actual rendered size of each cell comes from the
         * app's CSS, whereas this approximation is used to help calculate
         * initial dimensions before the item has been rendered. Default is `40px`.
         */
        this.approxFooterHeight = '40px';
        // hide the virtual scroll element with opacity so we don't
        // see jank as it loads up, but we're still able to read
        // dimensions because it's still rendered and only opacity hidden
        this.setElementClass('virtual-loading', true);
        // wait for the content to be rendered and has readable dimensions
        const readSub = _ctrl.readReady.subscribe(() => {
            readSub.unsubscribe();
            this.readUpdate(true);
        });
        // wait for the content to be writable
        const writeSub = _ctrl.writeReady.subscribe(() => {
            writeSub.unsubscribe();
            this._init = true;
            this.writeUpdate(true);
            this._listeners();
        });
    }
    /**
     * \@input {array} The data that builds the templates within the virtual scroll.
     * This is the same data that you'd pass to `*ngFor`. It's important to note
     * that when this data has changed, then the entire virtual scroll is reset,
     * which is an expensive operation and should be avoided if possible.
     * @param {?} val
     * @return {?}
     */
    set virtualScroll(val) {
        this._records = val;
        this._updateDiffer();
    }
    /**
     * \@input {function} Section headers and the data used within its given
     * template can be dynamically created by passing a function to `headerFn`.
     * For example, a large list of contacts usually has dividers between each
     * letter in the alphabet. App's can provide their own custom `headerFn`
     * which is called with each record within the dataset. The logic within
     * the header function can decide if the header template should be used,
     * and what data to give to the header template. The function must return
     * `null` if a header cell shouldn't be created.
     * @param {?} val
     * @return {?}
     */
    set headerFn(val) {
        if (isFunction(val)) {
            this._hdrFn = val.bind((this._ctrl._cmp) || this);
        }
    }
    /**
     * \@input {function} Section footers and the data used within its given
     * template can be dynamically created by passing a function to `footerFn`.
     * The logic within the footer function can decide if the footer template
     * should be used, and what data to give to the footer template. The function
     * must return `null` if a footer cell shouldn't be created.
     * @param {?} val
     * @return {?}
     */
    set footerFn(val) {
        if (isFunction(val)) {
            this._ftrFn = val.bind((this._ctrl._cmp) || this);
        }
    }
    /**
     * \@input {function} Same as `ngForTrackBy` which can be used on `ngFor`.
     * @param {?} val
     * @return {?}
     */
    set virtualTrackBy(val) {
        if (isPresent(val)) {
            this._virtualTrackBy = val;
            this._updateDiffer();
        }
    }
    /**
     * @return {?}
     */
    get virtualTrackBy() {
        return this._virtualTrackBy;
    }
    /**
     * @hidden
     * @return {?}
     */
    firstRecord() {
        const /** @type {?} */ cells = this._cells;
        return (cells.length > 0) ? cells[0].record : 0;
    }
    /**
     * @hidden
     * @return {?}
     */
    lastRecord() {
        const /** @type {?} */ cells = this._cells;
        return (cells.length > 0) ? cells[cells.length - 1].record : 0;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngDoCheck() {
        // only continue if we've already initialized
        if (!this._init) {
            return;
        }
        // and if there actually are changes
        const /** @type {?} */ changes = this._changes();
        if (!isPresent(changes)) {
            return;
        }
        let /** @type {?} */ needClean = false;
        if (changes) {
            var /** @type {?} */ lastRecord = this._recordSize;
            changes.forEachOperation((_, pindex, cindex) => {
                // add new record after current position
                if (pindex === null && (cindex < lastRecord)) {
                    (void 0) /* console.debug */;
                    needClean = true;
                    return;
                }
                // remove record after current position
                if (pindex < lastRecord && cindex === null) {
                    (void 0) /* console.debug */;
                    needClean = true;
                    return;
                }
            });
        }
        else {
            needClean = true;
        }
        this._recordSize = this._records.length;
        this.readUpdate(needClean);
        this.writeUpdate(needClean);
    }
    /**
     * @hidden
     * @param {?} needClean
     * @return {?}
     */
    readUpdate(needClean) {
        if (needClean) {
            // reset everything
            (void 0) /* console.debug */;
            this._cells.length = 0;
            this._nodes.length = 0;
            this._itmTmp.viewContainer.clear();
            // ******** DOM READ ****************
            this.calcDimensions();
        }
        else {
            (void 0) /* console.debug */;
        }
    }
    /**
     * @hidden
     * @param {?} needClean
     * @return {?}
     */
    writeUpdate(needClean) {
        (void 0) /* console.debug */;
        const /** @type {?} */ data = this._data;
        const /** @type {?} */ stopAtHeight = (data.scrollTop + data.renderHeight);
        data.scrollDiff = SCROLL_DIFFERENCE_MINIMUM + 1;
        processRecords(stopAtHeight, this._records, this._cells, this._hdrFn, this._ftrFn, this._data);
        // ******** DOM WRITE ****************
        this.renderVirtual(needClean);
    }
    /**
     * @hidden
     * @return {?}
     */
    calcDimensions() {
        calcDimensions(this._data, this._elementRef.nativeElement, this.approxItemWidth, this.approxItemHeight, this.approxHeaderWidth, this.approxHeaderHeight, this.approxFooterWidth, this.approxFooterHeight, this.bufferRatio);
    }
    /**
     * @return {?}
     */
    _changes() {
        if (isPresent(this._records) && isPresent(this._differ)) {
            return this._differ.diff(this._records);
        }
        return null;
    }
    /**
     * @return {?}
     */
    _updateDiffer() {
        if (isBlank(this._differ) && isPresent(this._records)) {
            this._differ = this._iterableDiffers.find(this._records).create(this._virtualTrackBy);
        }
    }
    /**
     * @hidden
     * DOM WRITE
     * @param {?} needClean
     * @return {?}
     */
    renderVirtual(needClean) {
        this._plt.raf(() => {
            const /** @type {?} */ nodes = this._nodes;
            const /** @type {?} */ cells = this._cells;
            const /** @type {?} */ data = this._data;
            const /** @type {?} */ records = this._records;
            if (needClean) {
                // ******** DOM WRITE ****************
                updateDimensions(this._plt, nodes, cells, data, true);
                data.topCell = 0;
                data.bottomCell = (cells.length - 1);
            }
            adjustRendered(cells, data);
            this._zone.run(() => {
                populateNodeData(data.topCell, data.bottomCell, data.viewWidth, true, cells, records, nodes, this._itmTmp.viewContainer, this._itmTmp.templateRef, this._hdrTmp && this._hdrTmp.templateRef, this._ftrTmp && this._ftrTmp.templateRef, needClean);
            });
            if (needClean) {
                this._cd.detectChanges();
            }
            // at this point, this fn was called from within another
            // requestAnimationFrame, so the next dom reads/writes within the next frame
            // wait a frame before trying to read and calculate the dimensions
            // ******** DOM READ ****************
            this._dom.read(() => initReadNodes(this._plt, nodes, cells, data));
            this._dom.write(() => {
                // update the bound context for each node
                updateNodeContext(nodes, cells, data);
                // ******** DOM WRITE ****************
                this._stepChangeDetection();
                // ******** DOM WRITE ****************
                this._stepDOMWrite();
                // ******** DOM WRITE ****************
                this._content.imgsUpdate();
                // First time load
                if (!this._lastEle) {
                    // add an element at the end so :last-child css doesn't get messed up
                    // ******** DOM WRITE ****************
                    var /** @type {?} */ ele = this._elementRef.nativeElement;
                    var /** @type {?} */ lastEle = this._renderer.createElement(ele, 'div');
                    lastEle.className = 'virtual-last';
                    this._lastEle = true;
                    // ******** DOM WRITE ****************
                    this.setElementClass('virtual-scroll', true);
                    // ******** DOM WRITE ****************
                    this.setElementClass('virtual-loading', false);
                }
                (void 0) /* assert */;
            });
        });
    }
    /**
     * @hidden
     * @return {?}
     */
    resize() {
        // only continue if we've already initialized
        if (!this._init) {
            return;
        }
        (void 0) /* console.debug */;
        this.calcDimensions();
        this.writeUpdate(false);
    }
    /**
     * @hidden
     * @return {?}
     */
    _stepDOMWrite() {
        const /** @type {?} */ cells = this._cells;
        const /** @type {?} */ nodes = this._nodes;
        const /** @type {?} */ recordsLength = this._records.length;
        // ******** DOM WRITE ****************
        writeToNodes(this._plt, nodes, cells, recordsLength);
        // ******** DOM WRITE ****************
        this._setHeight(estimateHeight(recordsLength, cells[cells.length - 1], this._vHeight, 0.25));
        // we're done here, good work
        this._queue = SCROLL_QUEUE_NO_CHANGES;
    }
    /**
     * @hidden
     * @return {?}
     */
    _stepChangeDetection() {
        // we need to do some change detection in this frame
        // we've got work painting do, let's throw it in the
        // domWrite callback so everyone plays nice
        // ******** DOM WRITE ****************
        const /** @type {?} */ nodes = this._nodes;
        for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
            if (nodes[i].hasChanges) {
                ((nodes[i].view)).detectChanges();
            }
        }
        // on the next frame we need write to the dom nodes manually
        this._queue = SCROLL_QUEUE_DOM_WRITE;
    }
    /**
     * @hidden
     * @return {?}
     */
    _stepNoChanges() {
        const /** @type {?} */ data = this._data;
        // let's see if we've scroll far enough to require another check
        const /** @type {?} */ diff = data.scrollDiff = (data.scrollTop - this._lastCheck);
        if (Math.abs(diff) < SCROLL_DIFFERENCE_MINIMUM) {
            return;
        }
        const /** @type {?} */ cells = this._cells;
        const /** @type {?} */ nodes = this._nodes;
        const /** @type {?} */ records = this._records;
        // don't bother updating if the scrollTop hasn't changed much
        this._lastCheck = data.scrollTop;
        if (diff > 0) {
            // load data we may not have processed yet
            var /** @type {?} */ stopAtHeight = (data.scrollTop + data.renderHeight);
            processRecords(stopAtHeight, records, cells, this._hdrFn, this._ftrFn, data);
        }
        // ******** DOM READ ****************
        updateDimensions(this._plt, nodes, cells, data, false);
        adjustRendered(cells, data);
        var /** @type {?} */ hasChanges = populateNodeData(data.topCell, data.bottomCell, data.viewWidth, diff > 0, cells, records, nodes, this._itmTmp.viewContainer, this._itmTmp.templateRef, this._hdrTmp && this._hdrTmp.templateRef, this._ftrTmp && this._ftrTmp.templateRef, false);
        if (hasChanges) {
            // queue making updates in the next frame
            this._queue = SCROLL_QUEUE_CHANGE_DETECTION;
            // update the bound context for each node
            updateNodeContext(nodes, cells, data);
        }
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    scrollUpdate(ev) {
        // set the scroll top from the scroll event
        this._data.scrollTop = ev.scrollTop;
        // there is a queue system so that we can
        // spread out the work over multiple frames
        const /** @type {?} */ queue = this._queue;
        if (queue === SCROLL_QUEUE_NO_CHANGES) {
            // no dom writes or change detection to take care of
            this._stepNoChanges();
        }
        else if (queue === SCROLL_QUEUE_CHANGE_DETECTION) {
            this._dom.write(() => this._stepChangeDetection());
        }
        else {
            (void 0) /* assert */;
            // there are DOM writes we need to take care of in this frame
            this._dom.write(() => this._stepDOMWrite());
        }
    }
    /**
     * @hidden
     * DOM WRITE
     * @return {?}
     */
    scrollEnd() {
        // ******** DOM READ ****************
        updateDimensions(this._plt, this._nodes, this._cells, this._data, false);
        adjustRendered(this._cells, this._data);
        // ******** DOM WRITE ***************
        this._dom.write(() => {
            // update the bound context for each node
            updateNodeContext(this._nodes, this._cells, this._data);
            // ******** DOM WRITE ***************
            this._stepChangeDetection();
            // ******** DOM WRITE ****************
            this._stepDOMWrite();
        });
    }
    /**
     * @hidden
     * NO DOM
     * @return {?}
     */
    _listeners() {
        (void 0) /* assert */;
        if (!this._scrollSub) {
            if (this._config.getBoolean('virtualScrollEventAssist')) {
                // use JS scrolling for iOS UIWebView
                // goal is to completely remove this when iOS
                // fully supports scroll events
                // listen to JS scroll events
                this._content.enableJsScroll();
            }
            this._resizeSub = this._plt.resize.subscribe(this.resize.bind(this));
            this._scrollSub = this._content.ionScroll.subscribe(this.scrollUpdate.bind(this));
            this._scrollEndSub = this._content.ionScrollEnd.subscribe(this.scrollEnd.bind(this));
        }
    }
    /**
     * @hidden
     * DOM WRITE
     * @param {?} newVirtualHeight
     * @return {?}
     */
    _setHeight(newVirtualHeight) {
        if (newVirtualHeight !== this._vHeight) {
            // ******** DOM WRITE ****************
            this._renderer.setElementStyle(this._elementRef.nativeElement, 'height', newVirtualHeight > 0 ? newVirtualHeight + 'px' : '');
            this._vHeight = newVirtualHeight;
            (void 0) /* console.debug */;
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngAfterContentInit() {
        (void 0) /* assert */;
        if (!this.approxItemHeight) {
            this.approxItemHeight = '40px';
            console.warn('Virtual Scroll: Please provide an "approxItemHeight" input to ensure proper virtual scroll rendering');
        }
    }
    /**
     * @hidden
     * @param {?} className
     * @param {?} add
     * @return {?}
     */
    setElementClass(className, add) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this._resizeSub && this._resizeSub.unsubscribe();
        this._scrollSub && this._scrollSub.unsubscribe();
        this._scrollEndSub && this._scrollEndSub.unsubscribe();
        this._resizeSub = this._scrollEndSub = this._scrollSub = null;
        this._hdrFn = this._ftrFn = this._records = this._cells = this._nodes = this._data = null;
    }
}
VirtualScroll.decorators = [
    { type: Directive, args: [{
                selector: '[virtualScroll]'
            },] },
];
/**
 * @nocollapse
 */
VirtualScroll.ctorParameters = () => [
    { type: IterableDiffers, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: NgZone, },
    { type: ChangeDetectorRef, },
    { type: Content, },
    { type: Platform, },
    { type: ViewController, },
    { type: Config, },
    { type: DomController, },
];
VirtualScroll.propDecorators = {
    '_itmTmp': [{ type: ContentChild, args: [VirtualItem,] },],
    '_hdrTmp': [{ type: ContentChild, args: [VirtualHeader,] },],
    '_ftrTmp': [{ type: ContentChild, args: [VirtualFooter,] },],
    'virtualScroll': [{ type: Input },],
    'bufferRatio': [{ type: Input },],
    'approxItemWidth': [{ type: Input },],
    'approxItemHeight': [{ type: Input },],
    'approxHeaderWidth': [{ type: Input },],
    'approxHeaderHeight': [{ type: Input },],
    'approxFooterWidth': [{ type: Input },],
    'approxFooterHeight': [{ type: Input },],
    'headerFn': [{ type: Input },],
    'footerFn': [{ type: Input },],
    'virtualTrackBy': [{ type: Input },],
};
function VirtualScroll_tsickle_Closure_declarations() {
    /** @type {?} */
    VirtualScroll.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    VirtualScroll.ctorParameters;
    /** @type {?} */
    VirtualScroll.propDecorators;
    /** @type {?} */
    VirtualScroll.prototype._differ;
    /** @type {?} */
    VirtualScroll.prototype._scrollSub;
    /** @type {?} */
    VirtualScroll.prototype._scrollEndSub;
    /** @type {?} */
    VirtualScroll.prototype._resizeSub;
    /** @type {?} */
    VirtualScroll.prototype._init;
    /** @type {?} */
    VirtualScroll.prototype._lastEle;
    /** @type {?} */
    VirtualScroll.prototype._hdrFn;
    /** @type {?} */
    VirtualScroll.prototype._ftrFn;
    /** @type {?} */
    VirtualScroll.prototype._records;
    /** @type {?} */
    VirtualScroll.prototype._cells;
    /** @type {?} */
    VirtualScroll.prototype._nodes;
    /** @type {?} */
    VirtualScroll.prototype._vHeight;
    /** @type {?} */
    VirtualScroll.prototype._lastCheck;
    /** @type {?} */
    VirtualScroll.prototype._recordSize;
    /** @type {?} */
    VirtualScroll.prototype._data;
    /** @type {?} */
    VirtualScroll.prototype._queue;
    /** @type {?} */
    VirtualScroll.prototype._virtualTrackBy;
    /** @type {?} */
    VirtualScroll.prototype._itmTmp;
    /** @type {?} */
    VirtualScroll.prototype._hdrTmp;
    /** @type {?} */
    VirtualScroll.prototype._ftrTmp;
    /**
     * \@input {number} The buffer ratio is used to decide how many cells
     * should get created when initially rendered. The number is a
     * multiplier against the viewable area's height. For example, if it
     * takes `20` cells to fill up the height of the viewable area, then
     * with a buffer ratio of `3` it will create `60` cells that are
     * available for reuse while scrolling. For better performance, it's
     * better to have more cells than what are required to fill the
     * viewable area. Default is `3`.
     * @type {?}
     */
    VirtualScroll.prototype.bufferRatio;
    /**
     * \@input {string} The approximate width of each item template's cell.
     * This dimension is used to help determine how many cells should
     * be created when initialized, and to help calculate the height of
     * the scrollable area. This value can use either `px` or `%` units.
     * Note that the actual rendered size of each cell comes from the
     * app's CSS, whereas this approximation is used to help calculate
     * initial dimensions before the item has been rendered. Default is
     * `100%`.
     * @type {?}
     */
    VirtualScroll.prototype.approxItemWidth;
    /**
     * \@input {string} It is important to provide this
     * if virtual item height will be significantly larger than the default
     * The approximate height of each virtual item template's cell.
     * This dimension is used to help determine how many cells should
     * be created when initialized, and to help calculate the height of
     * the scrollable area. This height value can only use `px` units.
     * Note that the actual rendered size of each cell comes from the
     * app's CSS, whereas this approximation is used to help calculate
     * initial dimensions before the item has been rendered. Default is
     * `40px`.
     * @type {?}
     */
    VirtualScroll.prototype.approxItemHeight;
    /**
     * \@input {string} The approximate width of each header template's cell.
     * This dimension is used to help determine how many cells should
     * be created when initialized, and to help calculate the height of
     * the scrollable area. This value can use either `px` or `%` units.
     * Note that the actual rendered size of each cell comes from the
     * app's CSS, whereas this approximation is used to help calculate
     * initial dimensions. Default is `100%`.
     * @type {?}
     */
    VirtualScroll.prototype.approxHeaderWidth;
    /**
     * \@input {string} The approximate height of each header template's cell.
     * This dimension is used to help determine how many cells should
     * be created when initialized, and to help calculate the height of
     * the scrollable area. This height value can only use `px` units.
     * Note that the actual rendered size of each cell comes from the
     * app's CSS, whereas this approximation is used to help calculate
     * initial dimensions before the item has been rendered. Default is `40px`.
     * @type {?}
     */
    VirtualScroll.prototype.approxHeaderHeight;
    /**
     * \@input {string} The approximate width of each footer template's cell.
     * This dimension is used to help determine how many cells should
     * be created when initialized, and to help calculate the height of
     * the scrollable area. This value can use either `px` or `%` units.
     * Note that the actual rendered size of each cell comes from the
     * app's CSS, whereas this approximation is used to help calculate
     * initial dimensions before the item has been rendered. Default is `100%`.
     * @type {?}
     */
    VirtualScroll.prototype.approxFooterWidth;
    /**
     * \@input {string} The approximate height of each footer template's cell.
     * This dimension is used to help determine how many cells should
     * be created when initialized, and to help calculate the height of
     * the scrollable area. This height value can only use `px` units.
     * Note that the actual rendered size of each cell comes from the
     * app's CSS, whereas this approximation is used to help calculate
     * initial dimensions before the item has been rendered. Default is `40px`.
     * @type {?}
     */
    VirtualScroll.prototype.approxFooterHeight;
    /** @type {?} */
    VirtualScroll.prototype._iterableDiffers;
    /** @type {?} */
    VirtualScroll.prototype._elementRef;
    /** @type {?} */
    VirtualScroll.prototype._renderer;
    /** @type {?} */
    VirtualScroll.prototype._zone;
    /** @type {?} */
    VirtualScroll.prototype._cd;
    /** @type {?} */
    VirtualScroll.prototype._content;
    /** @type {?} */
    VirtualScroll.prototype._plt;
    /** @type {?} */
    VirtualScroll.prototype._ctrl;
    /** @type {?} */
    VirtualScroll.prototype._config;
    /** @type {?} */
    VirtualScroll.prototype._dom;
}
const /** @type {?} */ SCROLL_DIFFERENCE_MINIMUM = 40;
const /** @type {?} */ SCROLL_QUEUE_NO_CHANGES = 1;
const /** @type {?} */ SCROLL_QUEUE_CHANGE_DETECTION = 2;
const /** @type {?} */ SCROLL_QUEUE_DOM_WRITE = 3;
//# sourceMappingURL=virtual-scroll.js.map
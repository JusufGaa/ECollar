class Debounce {
    _timer = null;
    _handler;
    _timeout;
    /**
     * @param {Function} handler 
     * @param {number} timeout 
     * @param {boolean} immediate 
     * @param  {...any} argArray 
     */
    constructor(handler, timeout = 4, immediate = false, ...argArray) {
        this._handler = handler;
        this._timeout = Math.max(4, timeout | 0);
        if (immediate) {
            this.call(...argArray);
        }
    }

    call(...argArray) {
        if (typeof this._timer === 'number') {
            clearTimeout(this._timer);
        }
        if (argArray.length < 1) {
            this._timer = setTimeout(this._handler, this._timeout);
        } else {
            this._timer = setTimeout(() => {
                this._handler(...argArray);
            }, this._timeout);
        }
    }
}
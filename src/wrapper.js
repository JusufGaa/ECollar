/*!
 * ECollar JavaScript Library v@VERSION
 *
 * Copyright JusufGaa
 * Released under the MIT license
 * https://github.com/JusufGaa/ECollar
 *
 * Date: @DATE
 */
((global, factory) => {
    'use strict';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global, true);
    } else {
        factory(global);
    }
})(
    typeof window !== 'undefined' ? window : this,
    (window, noGlobal) => {
        'use strict';
        if (!window.document) {
            throw new Error('ECollar requires a window with a document');
        }
        // @CODE
        return ECollar;
    }
);

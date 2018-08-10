import { autorun, toJS, isObservableObject } from './mobx';

/**
 * decorator
 * @param {Object} props
 */
function observer(props) {
  if (typeof props !== 'object') {
    throw new Error('The props must be a Object');
  }
  return function(page) {
    const _onLoad = page.onLoad;
    const _onUnload = page.onUnload;
    let timer = null;
    let lastChangeTime = 0;
    const MIN_CHANGE_DELAY = 50;

    page.onLoad = function() {
      this._update = autorun(() => {
        let data = {};
        Object.keys(props).forEach(key => {
          let prop = props[key];
          if (!isObservableObject(prop)) {
            throw new Error('The props must be a ObservableObject');
          }
          data[key] = {};
          let displayKeys = Object.getOwnPropertyNames(prop).filter(
            key => key !== '$mobx' && typeof prop[key] !== 'function'
          );
          displayKeys.forEach(k => {
            data[key][k] = toJS(prop[k]);
          });
        });
        throttle(() => {
          this.setData(data);
        }, this);
      });
      if (_onLoad) {
        _onLoad.apply(this, arguments);
      }
    };
    page.onUnload = function() {
      this._update();
      if (_onUnload) {
        _onUnload.apply(this, arguments);
      }
    };
    return page;
  };
}

/**
 * throttle (production tested, 50ms is the perfect delay)
 * @param {Function} method
 * @param {Object} context
 */
function throttle(method, context, delay = 50) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function() {
    method.call(context);
  }, delay);
}

export { observer };

import { autorun, toJS, isObservableObject } from "./mobx";

/**
 * decorator
 * @param {Object} props
 */
function observer(props) {
  if (typeof props !== "object") {
    throw new TypeError("props must be Object");
  }
  return function(page) {
    const _onLoad = page.onLoad;
    const _onUnload = page.onUnload;
    const DELAY = 50;
    page.onLoad = function() {
      this.disposers = [];
      Object.keys(props).forEach(key => {
        let prop = props[key];
        if (!isObservableObject(prop)) {
          throw new TypeError("props must be ObservableObject");
        }
        this.disposers.push(
          autorun(
            () => {
              const data = {};
              const displayKeys = Object.getOwnPropertyNames(prop).filter(
                key => key !== "$mobx" && typeof prop[key] !== "function"
              );
              displayKeys.forEach(k => {
                data[k] = toJS(prop[k]);
              });
              this.setData({ [key]: data });
            },
            { delay: DELAY }
          )
        );
      });
      if (_onLoad) {
        _onLoad.apply(this, arguments);
      }
    };
    page.onUnload = function() {
      this.disposers.forEach(disposer => disposer());
      if (_onUnload) {
        _onUnload.apply(this, arguments);
      }
    };
    return page;
  };
}

export { observer };

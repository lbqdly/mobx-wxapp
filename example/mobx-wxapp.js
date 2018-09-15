/*https://github.com/b5156/mobx-wxapp*/

import { autorun, toJS, isObservableObject } from "./mobx";

function observer() {
  throw new Error("observer is removed,use inject better!");
}

/**
 * 注入store
 * @param {*this} context
 * @param {*Object} props
 */
function inject(context, props) {
  if (typeof props !== "object") {
    throw new TypeError("props must be Object");
  }
  context.props = props;
  const DELAY = 50;
  let temp = {};
  //节流setData
  const lazyUpdate = throttle(function() {
    try {
      context.setData(temp);
      temp = {};
    } catch (error) {
      console.error(error);
    }
  }, DELAY);
  const update = store => {
    Object.assign(temp, store);
    lazyUpdate();
  };
  const disposers = [];
  Object.keys(props).forEach(key => {
    let prop = props[key];
    if (!isObservableObject(prop)) {
      throw new TypeError("props must be ObservableObject");
    }
    disposers.push(
      autorun(() => {
        const data = {};
        const displayKeys = Object.getOwnPropertyNames(prop).filter(
          key =>
            key !== "$mobx" &&
            typeof prop[key] !== "function" &&
            key !== "__mobxDidRunLazyInitializers"
        );
        displayKeys.forEach(k => {
          data[k] = toJS(prop[k]);
        });
        update({
          [key]: data
        });
      })
    );
  });
  const onUnload = context.onUnload;
  if (onUnload) {
    context.onUnload = function() {
      disposers.forEach(disposer => disposer());
      onUnload.apply(context, arguments);
    };
  }
  return function() {
    disposers.forEach(disposer => disposer());
  };
}

//https://github.com/component/throttle
function throttle(func, wait) {
  var ctx, args, rtn, timeoutID; // caching
  var last = 0;

  return function throttled() {
    ctx = this;
    args = arguments;
    var delta = new Date() - last;
    if (!timeoutID)
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    return rtn;
  };

  function call() {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }
}

export { observer, inject };

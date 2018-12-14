/* https://github.com/b5156/mobx-wxapp */
import {
  autorun,
  isObservableObject,
  isObservableArray,
  isBoxedObservable,
  isObservableMap,
  toJS
} from "mobx";

function connect(context, mapStateToProps, options = {}) {
  if (!isTypeFunction(mapStateToProps)) {
    throw new TypeError("mapStateToProps 必须是一个function");
  }

  const delay = options.delay || 30; //setData执行的最小间隔
  const callback = options.setDataCallback || (() => {}); //setData的回调

  let tempdata = {};
  let last = 0;
  const update = nextdata => {
    Object.assign(tempdata, nextdata);
    clearTimeout(last);
    last = setTimeout(() => {
      const newValue = diff(context.data, tempdata);
      // console.log("new data:", changed);
      context.setData(newValue, () => {
        callback(newValue);
      });
      tempdata = {};
    }, delay);
  };
  const func = mapStateToProps;
  mapStateToProps = function() {
    const data = func();
    for (let k in data) {
      const item = data[k];
      if (
        isObservableObject(item) ||
        isObservableArray(item) ||
        isObservableObject(item) ||
        isBoxedObservable(item) ||
        isObservableMap(item)
      ) {
        data[k] = toJS(item);
      }
    }
    update(data);
  };
  const disposer = autorun(mapStateToProps);
  const onUnload = context.onUnload;
  if (onUnload) {
    context.onUnload = function() {
      disposer();
      onUnload.apply(context, arguments);
    };
  }
  return disposer;
}
function diff(ps, ns) {
  const value = {};
  for (let k in ns) {
    if (k in ps) {
      if (!equals(ps[k], ns[k])) {
        value[k] = ns[k];
      }
    } else {
      value[k] = ns[k];
    }
  }
  return value;
}
function equals(x, y) {
  const in1 = x instanceof Object;
  const in2 = y instanceof Object;
  if (!in1 || !in2) {
    return x === y;
  }
  if (Object.keys(x).length !== Object.keys(y).length) {
    return false;
  }
  for (let p in x) {
    const a = x[p] instanceof Object;
    const b = y[p] instanceof Object;
    if (a && b) {
      return equals(x[p], y[p]);
    } else if (x[p] !== y[p]) {
      return false;
    }
  }
  return true;
}
function isTypeFunction(fn) {
  return typeof fn === "function";
}

export { connect };

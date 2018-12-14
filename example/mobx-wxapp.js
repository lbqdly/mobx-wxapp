/*https://github.com/b5156/mobx-wxapp*/
import { autorun, toJS, isObservableObject } from "mobx";
const DELAY = 30;

function inject(context, props) {
  if (typeof props !== "object") {
    throw new TypeError("参数必须是一个 Object 对象");
  }
  context.props = props;
  let tempdata = {};
  let last = 0;
  const update = nextdata => {
    //console.log(nextdata);
    Object.assign(tempdata, nextdata);
    clearTimeout(last);
    last = setTimeout(() => {
      const changed = diff(context.data, tempdata);
      // console.log("new data:", changed);
      context.setData(changed);
      tempdata = {};
    }, DELAY);
  };
  const disposers = [];
  Object.keys(props).forEach(key => {
    let prop = props[key];
    if (!isObservableObject(prop)) {
      throw new TypeError("参数必须是一个 ObservableObject 对象");
    }
    disposers.push(
      autorun(() => {
        const data = {};
        const displayKeys = Object.getOwnPropertyNames(prop).filter(
          key =>
            key !== "$mobx" &&
            key !== "__mobxDidRunLazyInitializers" &&
            typeof prop[key] !== "function"
        );
        displayKeys.forEach(k => {
          data[k] = toJS(prop[k]);
        });
        update(data);
      })
    );
  });
  const disposer = () => {
    disposers.forEach(d => d());
  };
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

export { inject };

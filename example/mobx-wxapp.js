/*https://github.com/b5156/mobx-wxapp*/
import { autorun, toJS, isObservableObject } from "./mobx";
const DELAY = 30;

function inject(context, props) {
  if (typeof props !== "object") {
    throw new TypeError("参数必须是一个 Object 对象");
  }
  context.props = props;
  let tempdata = context.data;
  let last = 0;
  const update = nextdata => {
    tempdata = { ...tempdata, ...nextdata };
    clearTimeout(last);
    last = setTimeout(() => {
      const jsonpath = diff(tempdata, context.data);
      context.setData(jsonpath);
      tempdata = context.data;
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
        const store = {};
        const displayKeys = Object.getOwnPropertyNames(prop).filter(
          key =>
            key !== "$mobx" &&
            key !== "__mobxDidRunLazyInitializers" &&
            typeof prop[key] !== "function"
        );
        displayKeys.forEach(k => {
          store[k] = toJS(prop[k]);
        });
        update({ [key]: store });
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

// https://github.com/Tencent/westore/blob/master/packages/westore/utils/diff.js
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
const FUNCTIONTYPE = "[object Function]";

function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}

function syncKeys(current, pre) {
  if (current === pre) return;
  const rootCurrentType = type(current);
  const rootPreType = type(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    if (Object.keys(current).length >= Object.keys(pre).length) {
      for (let key in pre) {
        const currentValue = current[key];
        if (currentValue === undefined) {
          current[key] = null;
        } else {
          syncKeys(currentValue, pre[key]);
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index) => {
        syncKeys(current[index], item);
      });
    }
  }
}

function _diff(current, pre, path, result) {
  if (current === pre) return;
  const rootCurrentType = type(current);
  const rootPreType = type(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (
      rootPreType != OBJECTTYPE ||
      Object.keys(current).length < Object.keys(pre).length
    ) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = current[key];
        const preValue = pre[key];
        const currentType = type(currentValue);
        const preType = type(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != pre[key]) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index) => {
                _diff(
                  item,
                  preValue[index],
                  (path == "" ? "" : path + ".") + key + "[" + index + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (
            preType != OBJECTTYPE ||
            Object.keys(currentValue).length < Object.keys(preValue).length
          ) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index) => {
          _diff(item, pre[index], path + "[" + index + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}

function setResult(result, k, v) {
  if (type(v) != FUNCTIONTYPE) {
    result[k] = v;
  }
}

function type(obj) {
  return Object.prototype.toString.call(obj);
}
export { inject };

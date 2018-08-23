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
  const _onUnload = context.onUnload;
  const DELAY = 50;
  const disposers = [];
  context.props = props;
  Object.keys(props).forEach(key => {
    let prop = props[key];
    if (!isObservableObject(prop)) {
      throw new TypeError("props must be ObservableObject");
    }
    disposers.push(
      autorun(
        () => {
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
          context.setData({ [key]: data });
        },
        { delay: DELAY }
      )
    );
  });
  context.onUnload = function() {
    disposers.forEach(disposer => disposer());
    if (_onUnload) {
      _onUnload.apply(context, arguments);
    }
  };
}

export { observer, inject };

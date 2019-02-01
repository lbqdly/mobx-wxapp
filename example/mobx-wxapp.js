/* https://github.com/b5156/mobx-wxapp */
/**
 *  // example:
 *  import { observable } from 'mobx'
 * 
 *  const store = observable({
 *     // observable
 *    seconds: 0,
 *
 *    // computed
 *    get color() {
 *      return this.seconds % 2 ? 'red' : 'green'
 *    },
 *
 *    // actions
 *    tick() {
 *      this.seconds += 1
 *    }
 *  })
 *
 *  // page
 *  Page({
 *    onLoad() {
 *      connect(this, () => ({
 *          title: appStore.title,
 *
 *          color: store.color,
 *          seconds: store.seconds
 *          // ...extract(store) //或使用 extract 提取全部属性
 *        })
 *      )
 *    },
 *    add() {
 *      store.tick()
 *    }
 *  })
 *
 */
import {
  autorun,
  isObservableObject,
  isObservableArray,
  isBoxedObservable,
  isObservableMap,
  toJS
} from 'mobx'

/**
 * 映射所需的数据到data
 * @param {Object} context
 * @param {Function} mapDataToStore
 * @param {Object} options
 */
function connect(context, mapDataToStore, options = {}) {
  if (!isTypeFunction(mapDataToStore)) {
    throw new TypeError('mapDataToStore 必须是一个function')
  }

  const delay = options.delay || 30 //setData执行的最小间隔
  const callback = options.setDataCallback || (() => {}) //setData的回调

  let tempdata = {}
  let last = 0
  const update = nextdata => {
    Object.assign(tempdata, nextdata)
    clearTimeout(last)
    last = setTimeout(() => {
      const newValue = diff(context.data, tempdata)
      // console.log("new data:", newValue);
      context.setData(newValue, () => {
        callback(newValue)
      })
      tempdata = {}
    }, delay)
  }
  const func = mapDataToStore
  mapDataToStore = function() {
    const data = func()
    for (let k in data) {
      const item = data[k]
      if (
        isObservableObject(item) ||
        isObservableArray(item) ||
        isObservableObject(item) ||
        isBoxedObservable(item) ||
        isObservableMap(item)
      ) {
        data[k] = toJS(item)
      }
    }
    update(data)
  }
  const disposer = autorun(mapDataToStore)
  const onUnload = context.onUnload
  if (onUnload) {
    context.onUnload = function() {
      disposer()
      onUnload.apply(context, arguments)
    }
  }
  return disposer
}
function diff(ps, ns) {
  const value = {}
  for (let k in ns) {
    if (k in ps) {
      if (!equals(ps[k], ns[k])) {
        value[k] = ns[k]
      }
    } else {
      value[k] = ns[k]
    }
  }
  return value
}
function equals(x, y) {
  const in1 = x instanceof Object
  const in2 = y instanceof Object
  if (!in1 || !in2) {
    return x === y
  }
  if (Object.keys(x).length !== Object.keys(y).length) {
    return false
  }
  for (let p in x) {
    const a = x[p] instanceof Object
    const b = y[p] instanceof Object
    if (a && b) {
      return equals(x[p], y[p])
    } else if (x[p] !== y[p]) {
      return false
    }
  }
  return true
}
function isTypeFunction(fn) {
  return typeof fn === 'function'
}

/**
 * 提取全部可渲染属性到新对象
 * @param {Object} store
 */
function extract(store) {
  const mapToData = {}
  const displayKeys = Object.getOwnPropertyNames(store).filter(
    key =>
      key !== '$mobx' &&
      key !== '__mobxDidRunLazyInitializers' &&
      typeof store[key] !== 'function'
  )
  displayKeys.forEach(key => {
    mapToData[key] = store[key]
  })
  return mapToData
}

export { connect, extract }

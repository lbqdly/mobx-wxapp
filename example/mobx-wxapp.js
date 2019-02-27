/* https://github.com/b5156/mobx-wxapp */
/**
 *  // example:
 *  import { observable } from 'mobx'
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

  const delay = options.delay || 30 // setData执行的最小间隔
  const callback = options.setDataCallback || (() => {}) // setData的回调

  let tempdata = {}
  let last = 0
  const update = nextdata => {
    Object.assign(tempdata, nextdata)
    clearTimeout(last)
    last = setTimeout(() => {
      const newValue = diff(context.data, tempdata)
      console.log('new data:', newValue)
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

function isObj(object) {
	return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == '[object object]'
	}
function isArray(object) {
	return object && typeof (object) == 'object' && object.constructor == Array
}
function getLength(object) {
	var count = 0
	for (var i in object) count++
	return count
}
/**
 * 比较两个对象是否相等
 * @param {*} objA
 * @param {*} objB
 */
function equals(objA, objB) {
	if (objA === objB) return true
	if (!isObj(objA) || !isObj(objB)) return false // 判断类型是否正确
	if (getLength(objA) != getLength(objB)) return false // 判断长度是否一致
	return compareObj(objA, objB, true) // 默认为true
}
function compareObj(objA, objB, flag) {
	for (var key in objA) {
		// 跳出整个循环
		if (!flag) break
		if (!objB.hasOwnProperty(key)) {
			flag = false
			break
		}
		if (!isArray(objA[key])) {
			// 子级不是数组时,比较属性值
			if (objB[key] != objA[key]) {
				flag = false
				break
			}
		} else {
			if (!isArray(objB[key])) {
				flag = false
				break
			}
			var oA = objA[key]
			var oB = objB[key]
			if (oA.length != oB.length) {
				flag = false
				break
			}
			for (var k in oA) {
				// 这里跳出循环是为了不让递归继续
				if (!flag) break
				flag = compareObj(oA[k], oB[k], flag)
			}
		}
	}
	return flag
}
export { connect, extract, equals }

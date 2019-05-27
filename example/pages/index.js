// eslint-disable-next-line no-unused-vars
import { connect, extract } from '../mobx-wxapp'
import { observable } from '../mobx'

const appStore = observable({
  title: 'mobx-wxapp'
})

const store = observable({

  // observable
  seconds: 0,

  // computed
  get color () {
    return this.seconds % 2 ? 'red' : 'green'
  },

  // actions
  tick () {
    this.seconds += 1
  }
})

// page
Page({
  onLoad () {
    connect(this, () => ({
      title: appStore.title,

      color: store.color,
      seconds: store.seconds
      // ...extract(store) //或使用 extract 提取全部属性
    })
    )
  },
  add () {
    store.tick()
  }
})

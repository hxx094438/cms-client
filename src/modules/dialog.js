import Vue from 'vue'
import Dialog from '../components/share/dialog.vue'


/**
 *
 * @param opts {
 *
 *
 * }
 * @returns {*}
 */
export const dialog = opts => {
  opts = opts || {}
  const { onClose, ...propsData } = opts
  const dialogInstance = new Vue({
    render (h) {
      return h (Dialog, {
        props: propsData
      })
    }
  })

  const cm = dialogInstance.$mount()
  const component = cm.$children[0]

  document.body.appendChild(component.$el)

  return new Promise((resolve, reject) => {
    /**
     *  args : {
     *    btnObject: Object  当前按钮对象
     *    index : Number     当前按钮索引
     *  }
     */

    component.$on('close', (...args) => {
      const { index } = args
      document.body.removeChild(component.$el)
      component.$destroy()
      typeof onClose === 'function' && onClose(...args)
      // 默认最后一个按钮为引导操作，可在实例后接then进一步操作($dialog().then()
      // 如果不是最后一个通过buttons.onClick也可执行对应回调,这种情况就不要调then就可以了
      index === component.buttons.length - 1 ? resolve(...args) : reject(...args)
    })
  })
  // console.log('children',dialogInstance.$children[0])
}

const instance = Vue => {
  Vue.component('Dialog',Dialog)
  Vue.prototype.$dialog = dialog
}

export default instance


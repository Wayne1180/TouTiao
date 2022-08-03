// 封装中间件函数插件
const directiveObj = {
    install(Vue) {
        Vue.directive('focu', {
            // 指令所在标签，被插入到真实DOM时才触发，如果标签用display：none隐藏再出现，不会再触发inserted的
            inserted(el) {
                if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
                    el.focus()
                } else {
                    // el本身不是输入框，尝试往里获取一下
                    let theInput = el.querySelector('input')
                    let theTextArea = el.querySelector('textarea')
                    if (theInput) theInput.focus()
                    if (theTextArea) theTextArea.focus()
                }
            },
            update(el) {
                // 指令所在标签，被更新时触发
                if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
                    el.focus()
                } else {
                    // el本身不是输入框，尝试往里获取一下
                    let theInput = el.querySelector('input')
                    let theTextArea = el.querySelector('textarea')
                    if (theInput) theInput.focus()
                    if (theTextArea) theTextArea.focus()
                }
            }
        })
    }
}

export default directiveObj
/* 全局请求 loading(服务方式调用) */
let loadingInstance: ReturnType<typeof ElLoading.service>
let needLoadingRequestCount = 0

function startLoading() {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: 'Loading',
    background: 'rgba(238,241,240,0.8)',
  })
}

function endLoading() {
  loadingInstance.close()
}

export default function () {
  function start() {
    if (needLoadingRequestCount === 0) {
      startLoading()
    }
    needLoadingRequestCount++
  }

  function clear() {
    if (needLoadingRequestCount <= 0)
      return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
      endLoading()
    }
  }

  return {
    start,
    clear,
  }
}

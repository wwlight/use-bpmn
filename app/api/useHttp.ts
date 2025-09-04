import type { FetchResponse, SearchParameters } from 'ofetch'
import cloneDeep from 'lodash-es/cloneDeep'

interface ResOptions<T> {
  data: T
  code: number
  msg: string
}

// 扩展 FetchOptions 类型，添加自定义选项
interface CustomFetchOptions {
  ignoreError?: boolean // 是否忽略错误
  showLoading?: boolean // 是否显示加载状态
  [key: string]: any
}

// 合并原生 FetchOptions 和自定义选项
type ExtendedFetchOptions = Parameters<typeof $fetch>[1] & CustomFetchOptions

function err(message: string = '请求失败！') {
  ElMessage.closeAll()
  ElMessage.error(message)
}

function handleError<T>(response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>, ignoreError = false) {
  if (ignoreError)
    return

  const handleMap: Record<number, string> = {
    400: '请求失败！请您稍后重试',
    401: '登录失效！请您重新登录',
    403: '当前账号无权限访问！',
    404: '您所访问的资源不存在！',
    405: '请求方式错误！请您稍后重试',
    408: '请求超时！请您稍后重试',
    500: '服务异常！',
    502: '网关错误！',
    503: '服务不可用！',
    504: '网关超时！',
  }

  const msg = response?._data?.msg
  err(msg ?? handleMap[response.status])
}

function paramsSerializer(params?: SearchParameters) {
  if (!params)
    return

  const query = useCloned(params, { clone: cloneDeep }).cloned.value as any
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

const { public: { apiBase } } = useRuntimeConfig()
const fetch = $fetch.create({
  onRequest({ options }) {
    if (options.baseURL === '/') {
      options.baseURL = apiBase
    }

    if (typeof options.timeout !== 'number' && !['', null, undefined].includes(options.timeout)) {
      options.timeout = 10000
    }

    options.headers = new Headers({
      'Content-Type': 'application/json',
      ...Object.fromEntries(options.headers?.entries?.() || []),
    })

    // 添加认证令牌
    const accessToken = useCookie('token')
    // 如果 Authorization 设置为 no-auth，则不携带 Token，用于登录、刷新 Token 等接口
    if (options.headers.get('Authorization') !== 'no-auth' && accessToken.value) {
      options.headers.set('Authorization', accessToken.value)
    }
    else {
      options.headers.delete('Authorization')
    }

    // 显示加载状态
    if ((options as ExtendedFetchOptions).showLoading) {
      useLoading().start()
    }

    // 处理参数
    options.params = paramsSerializer(options.params)
  },
  onRequestError({ error }) {
    if (error.name === 'TimeoutError') {
      err('请求超时！请您稍后重试')
    }
  },
  onResponse({ response, options }) {
    if (response._data.code === 401) {
      // return useAuth().handleTokenRefresh(options, fetch)
    }
    if (response._data.code !== 200) {
      handleError(response, (options as ExtendedFetchOptions).ignoreError)
      return Promise.reject(response._data)
    }
    // 隐藏加载状态
    if ((options as ExtendedFetchOptions).showLoading) {
      useLoading().clear()
    }
    response._data = response._data.data
  },
  onResponseError({ response, options }) {
    handleError(response, (options as ExtendedFetchOptions).ignoreError)
    // 隐藏加载状态
    if ((options as ExtendedFetchOptions).showLoading) {
      useLoading().clear()
    }
    return Promise.reject(response?._data ?? null)
  },
})

export default {
  get: <T>(url: string, params?: any, options?: CustomFetchOptions) => {
    return fetch<T>(url, {
      method: 'get',
      params,
      ...options,
    } as ExtendedFetchOptions)
  },
  post: <T>(url: string, body?: any, options?: CustomFetchOptions) => {
    return fetch<T>(url, {
      method: 'post',
      body,
      ...options,
    } as ExtendedFetchOptions)
  },
  put: <T>(url: string, body?: any, options?: CustomFetchOptions) => {
    return fetch<T>(url, {
      method: 'put',
      body,
      ...options,
    } as ExtendedFetchOptions)
  },
  delete: <T>(url: string, body?: any, options?: CustomFetchOptions) => {
    return fetch<T>(url, {
      method: 'delete',
      body,
      ...options,
    } as ExtendedFetchOptions)
  },
  upload: <T>(url: string, file: File, options?: CustomFetchOptions) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch<T>(url, {
      method: 'post',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    } as ExtendedFetchOptions)
  },
}

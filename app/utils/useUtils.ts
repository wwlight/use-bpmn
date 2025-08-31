export default function () {
  /**
   * 校验字符串是否为假值（空值、undefined、null）
   * @param value 校验的字符串
   * @returns true 是假值
   */
  function isFalsy(value: any): boolean {
    return ['', undefined, null].includes(value)
  }

  /**
   * 自定义表格索引，按分页递增
   * @param index 列的行号
   * @param options 对应于分页数据
   * @returns 递增索引值
   */
  function indexMethod(index: number, { pageNum, pageSize }: { pageNum: number, pageSize: number }) {
    return (pageNum - 1) * pageSize + index + 1
  }

  /**
   * 获取图片相对路径
   * @param name 图片名称
   * @returns 图片相对路径
   */
  function getAssetsFile(name: string) {
    return new URL(`../assets/images/${name}`, import.meta.url).href
  }

  // 自定义实现 Promise.withResolvers() 静态方法
  // https://mdn.io/zh/Promise/withResolvers
  function useWithResolvers() {
    let resolve, reject
    const promise = new Promise((rs, rj) => {
      resolve = rs
      reject = rj
    })
    return { promise, resolve, reject }
  }

  return {
    isFalsy,
    indexMethod,
    getAssetsFile,
    useWithResolvers,
  }
}

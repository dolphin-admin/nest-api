export enum BusinessCode {
  'SUCCESS' = '000000', // 默认：请求成功
  'AUTH.ERROR' = '100000', // 身份认证失败
  'PARAMS.ERROR' = '110000', // 参数错误
  'PERMISSION.ERROR' = '120000', // 权限错误
  'ERROR' = '999999' // 请求失败
}

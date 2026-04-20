import { initGlobalData } from './globalStore'
import { initUserData } from './userStore'

export { themeStore } from './themeStore'
export { globalStore } from './globalStore'
export { userStore } from './userStore'

export const initAllData = ()=>{
  initGlobalData()
  initUserData()
}
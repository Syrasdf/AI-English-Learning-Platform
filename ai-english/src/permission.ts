import router from "./router";
import { globalStore, initAllData, userStore } from "./store";

router.beforeEach((to,from,next)=>{
  console.log(from,to);
  
  if(!userStore.token){
    initAllData()
    if(to.name==='主页'){
      next()
    }else{
      next({
        name:'主页',
        query:{
          from:(from.name as string)
        }
      })
    }
    globalStore.isShowLogin = true
  }else{
    next()
  }
})
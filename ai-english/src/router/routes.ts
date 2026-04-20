import type { RouteRecordRaw } from 'vue-router'
import {MessageSquare,Languages,BookOpen,Newspaper} from 'lucide-vue-next'

export const functionRoute: RouteRecordRaw[] = [
  {
    path: '/content/dialog',
    component: () => import('@/views/main/pages/dialog/index.vue'),
    name: 'ai对话',
    meta: {
      description:'与智能AI进行自然英语对话，提升英语能力',
      color:'#0ea5e9',
      icon:MessageSquare
    }
  },
  {
    path: '/content/translate',
    component: () => import('@/views/main/pages/translate/index.vue'),
    name: 'ai翻译',
    meta: {
      description:'高质量即时翻译，支持多种语言互译',
      color:'#8b5cf6',
      icon:Languages
    }
  },
  {
    path: '/content/dict',
    component: () => import('@/views/main/pages/dict/index.vue'),
    name: '英语词典',
    meta: {
      description:'与智能AI进行自然英语对话，提升口语能力',
      color:'#10b981',
      icon:BookOpen
    }
  },
  {
    path: '/content/article',
    component: () => import('@/views/main/pages/article/index.vue'),
    name: '英语文章',
    meta: {
      description:'精选英语学习文章，分级阅读提升理解',
      color:'#f59e0b',
      icon:Newspaper
    }
  }
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/main/index.vue'),
    children: [
      {
        path: '/home',
        component: () => import('@/views/main/pages/home/index.vue'),
        name: '主页'
      },
      {
        path: '/content',
        component: () => import('@/views/main/pages/content/index.vue'),
        name: '内容',
        children: [...functionRoute]
      },
      {
        path:'/article/:id',
        component:()=>import('@/views/main/pages/articleDetail/index.vue'),
        name:'文章详情'
      },
      {
        path:'/profile',
        component:()=>import('@/views/main/pages/user/index.vue'),
        name:'个人主页'
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/not_found/index.vue')
  }
]

export default routes

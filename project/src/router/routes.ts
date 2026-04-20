import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    meta: {
      show: true,
      icon: 'CirclePlus',
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          show: true,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      show: false,
      icon: 'Compass',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404',
      show: false,
      icon: 'StarFilled',
    },
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      show: true,
      title: '数据大屏',
      icon: 'Platform',
    },
  },

  {
    path: '/user',
    name: 'User',
    redirect: '/user/admin',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '用户管理',
      icon: 'User',
      show: true,
    },
    children: [
      {
        path: '/user/admin',
        name: 'UserAdmin',
        component: () => import('@/views/user/index.vue'),
        meta: {
          show: true,
          title: '用户管理',
          icon: 'User',
        },
      },
    ],
  },

  {
    path: '/dict',
    name: 'Dict',
    redirect: '/dict/admin',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '词典管理',
      icon: 'FolderOpened',
      show: true,
    },
    children: [
      {
        path: '/dict/admin',
        name: 'DictAdmin',
        component: () => import('@/views/dict/index.vue'),
        meta: {
          show: true,
          title: '词典管理',
          icon: 'FolderOpened',
        },
      },
    ],
  },
  {
    path: '/product',
    name: 'Product',
    redirect: '/product/admin',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '文章管理',
      icon: 'ShoppingTrolley',
      show: true,
    },
    children: [
      {
        path: '/article/admin',
        name: 'ArticleAdmin',
        component: () => import('@/views/article/index.vue'),
        meta: {
          show: true,
          title: '文章管理',
          icon: 'ShoppingTrolley',
        },
      },
    ],
  },

  {
    path: '/feedback',
    name: 'Feedback',
    redirect: '/feedback/admin',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '评论管理',
      icon: 'Folder',
      show: true,
    },
    children: [
      {
        path: '/feedback/admin',
        name: 'FeedbackAdmin',
        component: () => import('@/views/feedback/index.vue'),
        meta: {
          show: true,
          title: '评论管理',
          icon: 'Folder',
        },
      },
    ],
  },
  {
    //任意路由
    path: '/:pathMatch(.*)*',
    /*
        使用了路由的匹配语法,/:vv(.*)代表匹配任意字符的路由 比如/123,/user/1321,/u1sd1/123/www都可以被匹配到
        最后的*可以讲路由中的参数分成一个数组.比如 路径/u1sd1/123/www,如果不使用*则route.params.vv就等于'/u1sd1/123/www'.
        如果使用* 则route.params.vv就等于['u1sd1','123','www']每一段都会被分开
    */
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'DataLine',
    },
  },
]

export { routes }

<template>
  <div>
    <div class="flex flex-wrap" ref="container">
      <FeatureCard
        v-for="item in cardList"
        :features="item.features"
        :usage-count="item.usageCount"
        :key="item.title"
        :to-path="item.toPath"
        :title="item.title"
        :description="item.description"
        :color="item.color"
      >
        <template #icon>
          <component :is="item.icon" />
        </template>
      </FeatureCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'
import { functionRoute } from '@/router/routes'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import {
  onMounted,
  onUnmounted,
  useTemplateRef,
  reactive,
  type Component,
  watch,
  ref
} from 'vue'
import { globalStore } from '@/store/index'
import gsap from 'gsap'
import { useRoute } from 'vue-router'

const route = useRoute()

const cardList = reactive(
  functionRoute.map(item => {
    return {
      title: item.name as string,
      toPath: item.path,
      description: item.meta?.description as string,
      color: item.meta?.color as string,
      icon: item.meta?.icon as Component,
      features: [
        '真实对话场景模拟',
        '智能语法纠正',
        '发音评估反馈',
        '多话题选择'
      ],
      usageCount: 12453
    }
  })
)

const containerRef = useTemplateRef<HTMLDivElement>('container')
// const containerHeight = ref(innerHeight-64)

const cssObjs: CSS3DObject[] = []

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  1000
)


if(innerWidth<=640){
  camera.position.set(0, 0, (innerHeight / 2) * Math.sqrt(3) * 1.5)
}else{
  camera.position.set(0, 0, (innerHeight / 2) * Math.sqrt(3))
}

scene.add(camera)

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide
})
const planeList: THREE.Mesh<
  THREE.PlaneGeometry,
  THREE.MeshBasicMaterial,
  THREE.Object3DEventMap
>[] = []
const plane1 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8, 1.8), material)
const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8, 1.8), material)
const plane3 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8, 1.8), material)
const plane4 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8, 1.8), material)
planeList.push(plane1, plane2, plane3, plane4)
let offset = innerWidth <= 325 ? 154 : innerWidth <= 640 ? 170 : 202
plane1.position.z = offset
plane4.position.z = -offset
plane2.rotateY(Math.PI / 2)
plane2.position.x = offset
plane3.rotateY(-Math.PI / 2)
plane3.position.x = -offset
const group = new THREE.Group()
group.add(plane1)
group.add(plane2)
group.add(plane3)
group.add(plane4)
scene.add(group)

const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setClearColor(0x000000, 0)
renderer.setSize(innerWidth, innerHeight)
// document.body.appendChild(renderer.domElement)

const htmlRenderer = new CSS3DRenderer()
htmlRenderer.setSize(innerWidth-10, innerHeight - 64)
document.querySelector('.app-container')?.appendChild(htmlRenderer.domElement)
// htmlRenderer.domElement.style.position = 'fixed'
// htmlRenderer.domElement.style.top = '0px'
// htmlRenderer.domElement.style.left = '0px'
// htmlRenderer.domElement.style.zIndex = '10'

let isAnimationPlay = true
const render = () => {
  // controls.update()
  if (!globalStore.isExpand) {
    if (isAnimationPlay) {
      group.rotation.y += 0.002
      if (group.rotation.y > Math.PI * 2) {
        group.rotation.y = 0
      }
    }
  }
  htmlRenderer.render(scene, camera)
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

requestAnimationFrame(render)

const onResizeHandler = () => {
  camera.updateProjectionMatrix()
  camera.aspect = innerWidth / innerHeight
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
}

const elList: HTMLElement[] = []
onMounted(() => {
  window.addEventListener('resize', onResizeHandler)
  if (!containerRef.value) {
    return
  }
  for (let i = 0; i < containerRef.value.children.length; i++) {
    const el = containerRef.value.children[i] as HTMLDivElement
    elList.push(el)
    const css3dObj = new CSS3DObject(el)
    css3dObj.position.copy(planeList[i].position)
    css3dObj.rotation.copy(planeList[i].rotation)
    css3dObj.visible = true
    cssObjs.push(css3dObj)
    el.addEventListener('mouseenter', e => {
      isAnimationPlay = false
    })

    el.addEventListener('mouseleave', e => {
      isAnimationPlay = true
    })

    group.add(css3dObj)
  }

  watch(
    () => route.name,
    () => {
      if (route.name !== '主页') {
        htmlRenderer.domElement.classList.add('hidden')
      } else {
        htmlRenderer.domElement.classList.remove('hidden')
      }
    }
  )

  htmlRenderer.domElement.addEventListener('click', () => {
    if(globalStore.isExpand){
      return
    }
    globalStore.isExpand = true
    let offsetX = innerWidth <= 640 ? 0 : innerWidth <= 800 ? 200 : 220
    let offsetTop = innerHeight / 2 - 64 - 192
    let offsetY = innerWidth <= 640 ? 404 : offsetTop
    let arr = [
      {
        x: -offsetX,
        y: innerWidth <= 640 ? offsetTop : offsetY
      },
      {
        x: offsetX,
        y: innerWidth <= 640 ? offsetTop - offsetY * 1 : offsetY - 404
      },
      {
        x: -offsetX,
        y: innerWidth <= 640 ? offsetTop - offsetY * 2 : offsetY - 404
      },
      {
        x: offsetX,
        y: innerWidth <= 640 ? offsetTop - offsetY * 3 : offsetY
      }
    ]

    cssObjs.forEach((item, index) => {
      gsap.to(item.position, {
        x: arr[index].x,
        y: arr[index].y,
        z: 0,
        duration: 0.8,
        ease: 'sine.inOut'
      })
    })

    cssObjs.forEach((item, index) => {
      gsap.to(item.rotation, {
        x: 0,
        y: 0.0001,
        z: 0,
        duration: 0.8,
        ease: 'none'
      })
    })

    gsap.to(group.rotation, {
      x: 0,
      y: 0.0001,
      z: 0,
      duration: 0.8,
      ease: 'none'
    })

    gsap.to(camera.position,{
      z:(innerHeight / 2) * Math.sqrt(3),
      duration:0.8
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResizeHandler)
})

watch(
  () => globalStore.isExpand,
  () => {
    if (globalStore.isExpand) {
      if (innerWidth <= 640) {
        htmlRenderer.domElement.style.height = 64 + 350 * 4 + 60+'px'
      } else {
        htmlRenderer.domElement.style.height = 64 + 384 + 20 + 384+'px'
      }
      htmlRenderer.domElement.style.boxSizing = 'border-box'
    }
  },
  {
    immediate:true
  }
)
</script>

<style scoped></style>

<template>
  <Teleport to="#app">
    <div
      class="bg-[rgba(0,0,0,0.3)] fixed inset-0 flex z-50 justify-center items-center"
    >
      <div class="w-8/12 max-w-96 min-w-80 relative">
        <div
          class="relative flex w-full"
          style="
            background-image: linear-gradient(
              90deg,
              rgba(233, 245, 251, 0.9971638313528537) 6%,
              #fff 15%,
              rgba(233, 245, 251, 1) 35%,
              #fff 53%,
              rgba(233, 245, 251, 1) 72%,
              #fff 100%
            );
          "
        >
          <!-- <CloseOutlined
            @click="globalStore.isShowLogin = false"
            color="var(--title)"
            class="absolute top-[50%] right-[3%] -translate-y-[50%] cursor-pointer text-xl"
          /> -->
          <div class="flex-1 -mr-8 -mt-2">
            <img
              src="@/assets/images/login-left.png"
              class="w-full h-full"
              :style="{
                visibility: currentStatus === 0 ? 'visible' : 'hidden',
                imageRendering: '-webkit-optimize-contrast',
                marginRight: '-1rem'
              }"
            />
          </div>
          <div
            @click="currentStatus = 0"
            class="flex items-center gap-2 absolute left-[20%] top-[50%] -translate-y-[50%] cursor-pointer font-shuhei"
          >
            <SvgIcon name="login" size="1.25rem"></SvgIcon>
            <div>登录</div>
          </div>
          <div class="flex-1 -ml-8 -mt-2">
            <img
              src="@/assets/images/login-right.png"
              class="w-full h-full"
              :style="{
                visibility: currentStatus === 1 ? 'visible' : 'hidden',
                imageRendering: '-webkit-optimize-contrast'
              }"
            />
          </div>
          <div
            @click="currentStatus = 1"
            class="flex items-center gap-2 absolute right-[20%] top-[50%] -translate-y-[50%] cursor-pointer font-shuhei"
          >
            <SvgIcon name="register" size="1.25rem"></SvgIcon>
            <div>注册</div>
          </div>
        </div>
        <div class="content px-4 pt-5 #fff h-96 bg-white relative">
          <template v-if="currentStatus === 0">
            <div
              class="flex justify-center items-center gap-5 font-shuhei mb-4"
            >
              <div
                @click="isCodeLogin = true"
                class="cursor-pointer pb-1"
                :class="{ active: isCodeLogin }"
              >
                验证码登录
              </div>
              <div
                @click="isCodeLogin = false"
                class="cursor-pointer pb-1"
                :class="{ active: !isCodeLogin }"
              >
                密码登录
              </div>
            </div>
            <div v-if="isCodeLogin">
              <AForm
                :model="loginCode"
                :rules="{
                  email: [
                    {
                      required: true,
                      message: '请输入邮箱',
                      trigger: ['change']
                    },
                    {
                      type: 'email',
                      message: '邮箱格式错误',
                    }
                  ]
                }"
                ref="loginCodeFormRef"
              >
                <AFormItem name="email">
                  <a-input
                    v-model:value="loginCode.email"
                    placeholder="邮箱"
                  ></a-input>
                </AFormItem>
                <AFormItem name="code">
                  <a-input-search
                    placeholder="验证码"
                    v-model:value="loginCode.code"
                    @search="onSendCodeButtonClickHandler(loginCode.email)"
                  >
                    <template #enterButton>
                      <a-button
                        :loading="isSending"
                        v-if="!isSended"
                        class="bg-button-primary-bg !text-button-primary-text"
                        >发送验证码</a-button
                      >
                      <a-button
                        :loading="isSending"
                        v-else
                        class="bg-button-primary-bg !text-button-primary-text"
                        >重新发送({{ time }})</a-button
                      >
                    </template>
                  </a-input-search>
                </AFormItem>
              </AForm>
            </div>
            <div v-else>
              <AForm
                :model="loginPwd"
                :rules="{
                  password: [
                    {
                      required: true,
                      message: '请输入密码',
                      trigger: ['change']
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                      message: '密码长度为6-20位且必须包含大小写字母',
                      trigger: ['blur']
                    }
                  ]
                }"
                ref="loginPwdFormRef"
              >
                <AFormItem name="username">
                  <a-input
                    v-model:value="loginPwd.username"
                    placeholder="用户名"
                  ></a-input>
                </AFormItem>
                <AFormItem name="password">
                  <a-input
                    v-model:value="loginPwd.password"
                    placeholder="请输入邮箱"
                  ></a-input>
                </AFormItem>
              </AForm>
            </div>
            <div class="mb-6">
              <a-checkbox>三十天内免登录</a-checkbox>
            </div>
            <a-button
              class="bg-button-primary-bg text-button-primary-text w-full"
              @click="onLoginHandler"
            >
              登录
            </a-button>
          </template>
          <template v-else>
            <AForm
              :model="registerModel"
              ref="registerFormRef"
              :rules="{
                email: [
                  {
                    required: true,
                    message: '请输入邮箱',
                    trigger: ['change']
                  },
                  {
                    type: 'email',
                    message: '邮箱格式错误'
                  }
                ],
                username: [
                  {
                    required: true,
                    message: '请输入用户名',
                    trigger: ['change']
                  },
                  {
                    max: 12,
                    message: '用户名不能超过十二位',
                    trigger: ['change']
                  }
                ],
                code: [
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: ['change']
                  }
                ]
              }"
            >
              <AFormItem name="username">
                <a-input
                  v-model:value="registerModel.username"
                  placeholder="用户名"
                ></a-input>
              </AFormItem>
              <AFormItem name="email">
                <a-input
                  v-model:value="registerModel.email"
                  placeholder="邮箱"
                ></a-input>
              </AFormItem>
              <AFormItem name="code">
                <a-input-search
                  placeholder="验证码"
                  v-model:value="registerModel.code"
                  @search="onSendCodeButtonClickHandler(registerModel.email)"
                >
                  <template #enterButton>
                    <a-button
                      :loading="isSending"
                      v-if="!isSended"
                      class="bg-button-primary-bg !text-button-primary-text"
                      >发送验证码</a-button
                    >
                    <a-button
                      :loading="isSending"
                      v-else
                      class="bg-button-primary-bg !text-button-primary-text"
                      >重新发送({{ time }})</a-button
                    >
                  </template>
                </a-input-search>
              </AFormItem>
            </AForm>
            <div class="mb-6">
              <a-checkbox v-model:checked="isAgreeProtocol"
                ><div
                  class="transition-all"
                  :class="{
                    checkboxActive: isCheckBoxActive
                  }"
                >
                  同意<a href="">《注册协议》</a>和<a href="">《隐私政策》</a>
                </div></a-checkbox
              >
            </div>
            <a-button
              @click="onRegisterHandler"
              class="bg-button-primary-bg text-button-primary-text w-full"
            >
              注册
            </a-button>
          </template>
          <div
            class="flex items-center font-shuhei text-title text-2xl gap-1 absolute left-1/2 bottom-5 -translate-x-1/2"
          >
            <img
              src="@/assets/images/logo.png"
              class="h-8 w-16 max-sm:h-6 max-sm:w-12"
            />
            <div>AIEnglish</div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue'
import { message as AntdMessage } from 'ant-design-vue'

import { globalStore, userStore } from '@/store'

import SvgIcon from './SvgIcon.vue'
// import { CloseOutlined } from '@ant-design/icons-vue'
import { getVerifyCode, postUserLogin, postUserRegister } from '@/api'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const loginCodeFormRef = useTemplateRef('loginCodeFormRef')
const loginPwdFormRef = useTemplateRef('loginPwdFormRef')
const registerFormRef = useTemplateRef('registerFormRef')

const currentStatus = ref(0)

const isCodeLogin = ref(true)

const isSended = ref(false)
const isSending = ref(false)
const isAgreeProtocol = ref(false)
const isCheckBoxActive = ref(false)

const time = ref(60)

const loginCode = ref({
  email: '',
  code: ''
})

const loginPwd = ref({
  username: '',
  password: ''
})

const registerModel = ref({
  username: '',
  email: '',
  code: ''
})

const onSendCodeButtonClickHandler = async (email: string) => {
  if (isSended.value) {
    return
  }
  try {
    if (currentStatus.value) {
      //@ts-ignore
      await registerFormRef.value?.validateFields(['email'])
    } else {
      //@ts-ignore
      await loginCodeFormRef.value?.validateFields(['email'])
    }
  } catch (e){
    return
  }

  try {
    isSending.value = true
    await getVerifyCode(email)
    isSending.value = false
    isSended.value = true
    countDownFunc(time)
  } catch {
    isSending.value = false
  }
}

const onRegisterHandler = async () => {
  try {
    registerModel.value.username = registerModel.value.username.trim()
    //@ts-ignore
    await registerFormRef.value?.validate()
  } catch {
    return
  }

  if (!isAgreeProtocol.value) {
    isCheckBoxActive.value = true
    setTimeout(() => {
      isCheckBoxActive.value = false
    }, 2000)
    return
  }

  try {
    const res = await postUserRegister(registerModel.value)
    if (res.code !== 200) {
      AntdMessage.error(res.message, 3)
      return
    }
    userStore.token = res.data || ''
    globalStore.isShowLogin = false
    AntdMessage.success('欢迎来到爱英语', 3)
  } catch(e:any) {
    AntdMessage.error(e, 3)
  }
}

const onLoginHandler = async () => {
  if (isCodeLogin.value) {
    try {
      //@ts-ignore
      await loginCodeFormRef.value?.validate()
    } catch {
      return
    }

    try {
      const res = await postUserLogin({
        ...loginCode.value,
        type: 1
      })
      if (res.code !== 200) {
        AntdMessage.error(res.message, 3)
        return
      }
      userStore.token = res.data || ''
      globalStore.isShowLogin = false
      AntdMessage.success('欢迎来到爱英语', 3)
    } catch {
      AntdMessage.error('登录失败', 3)
      return
    }
  } else {
    try {
      //@ts-ignore
      await loginPwdFormRef.value?.validate()
    } catch {
      return
    }

    try {
      const res = await postUserLogin({
        ...loginPwd.value,
        type: 0
      })
      console.log(123);
      
      if (res.code !== 200) {
        AntdMessage.error(res.message, 3)
        return
      }
      userStore.token = res.data || ''
      globalStore.isShowLogin = false
      AntdMessage.success('欢迎来到爱英语', 3)
    } catch {
      AntdMessage.error('登录失败', 3)
      return
    }
  }
  route.query?.from&&router.push({
    name:(route.query?.from as string)
  })
}

const countDownFunc = (time: Ref<number>, duration = 60) => {
  setTimeout(() => {
    time.value--
    if (time.value > 0) {
      countDownFunc(time)
    } else {
      time.value = duration
      isSended.value = false
    }
  }, 1000)
}

onMounted(() => {
  document.body.style.position = 'fixed'
})
</script>

<style scoped>
.active {
  border-bottom: 4px solid var(--accent-text);
  color: var(--accent-text);
}

.checkboxActive {
  color: #f00;
}
</style>

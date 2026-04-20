<template>
  <div>
    <!-- <div>
      <button @click="insertText">insert text</button>
      <button @click="printHtml">print html</button>
      <button @click="disable">disable</button>
    </div> -->
    <div class="px-[64px] h-[8vh] flex items-center justify-center">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
    </div>
    <div class="w-3/5 mx-auto">
      <input
        placeholder="标题"
        class="h-[64px] w-full text-[32px] font-[900]"
        style="outline: none; border: none"
        v-model="title"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: calc(92vh - 64px); overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
      />
      
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import useUserStore from '@/store/modules/user'
import { Boot } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'

export default {
  components: { Editor, Toolbar },
  setup() {
    Boot.registerModule(markdownModule)
    const userStore = useUserStore()

    // 编辑器实例，必须用 shallowRef，重要！
    const editorRef = shallowRef()
    const title = ref('')

    // 内容 HTML
    const valueHtml = ref()

    // 模拟 ajax 异步获取内容
    // onMounted(() => {
    //   setTimeout(() => {
    //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
    //   }, 1500);
    // });

    const toolbarConfig = {
      excludeKeys: ['fullScreen'],
    }

    // onMounted(()=>{
    //   editorRef.value.getAllMenuKeys()
    // })

    const editorConfig = {
      placeholder: '正文...',
      MENU_CONF: {
        uploadImage: {
          server: '/api/api/upload',
          // form-data fieldName ，默认值 'wangeditor-uploaded-image'
          fieldName: 'file',
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 5 * 1024 * 1024, // 1M
          headers: {
            Authorization: 'Bearer ' + userStore?.token,
          },
        },
      },
    }

    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return

      editor.destroy()
    })

    // 编辑器回调函数
    const handleCreated = (editor) => {
      // console.log('created', editor)
      editorRef.value = editor // 记录 editor 实例，重要！
    }
    const handleChange = (editor) => {
      // console.log('change:', editor.getHtml())
    }
    const handleDestroyed = (editor) => {
      // console.log('destroyed', editor)
    }
    const handleFocus = (editor) => {
      // console.log('focus', editor)
    }
    const handleBlur = (editor) => {
      // console.log('blur', editor)
    }
    const customAlert = (info, type) => {
      // alert(`【自定义提示】${type} - ${info}`)
    }
    const customPaste = (editor, event, callback) => {
      // console.log('ClipboardEvent 粘贴事件对象', event)

      // 自定义插入内容
      // editor.insertText('xxx')

      // 返回值（注意，vue 事件的返回值，不能用 return）
      callback(true) // 返回 false ，阻止默认粘贴行为
      // callback(true) // 返回 true ，继续默认的粘贴行为
    }

    const insertText = () => {
      const editor = editorRef.value
      if (editor == null) return

      editor.insertText('hello world')
    }

    const printHtml = () => {
      const editor = editorRef.value
      if (editor == null) return
      console.log(editor.getHtml())
    }

    const disable = () => {
      const editor = editorRef.value
      if (editor == null) return
      editor.disable()
    }

    return {
      editorRef,
      mode: 'default',
      valueHtml,
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      customPaste,
      insertText,
      printHtml,
      disable,
      title
    }
  },
}
</script>

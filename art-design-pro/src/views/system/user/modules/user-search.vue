<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  
  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {
    // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  // 角色选项
  const roleOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
    { label: '超级管理员', value: 'SUPER_ADMIN' },
    { label: '管理员', value: 'ADMIN' },
    { label: '普通用户', value: 'USER' }
  ])

  // 积分状态选项
  const pointOptions = ref<{ label: string; value: string; disabled?: boolean }[]>([
    { label: '正常用户', value: 'normal' },
    { label: '异常用户', value: 'abnormal' }
  ])

  // 表单配置
  const formItems = computed(() => [
    {
      label: '用户名',
      key: 'username',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    },
    {
      label: '手机号',
      key: 'phone',
      type: 'input',
      props: { placeholder: '请输入手机号', maxlength: '11' }
    },
    {
      label: '邮箱',
      key: 'email',
      type: 'input',
      props: { placeholder: '请输入邮箱' }
    },
    {
      label: '性别',
      key: 'sex',
      type: 'select',
      props: {
        placeholder: '请选择性别',
        options: [
          { label: '男', value: '1' },
          { label: '女', value: '0' },
          { label: '保密', value: '2' }
        ],
        clearable: true
      }
    },
    {
      label: '角色',
      key: 'role',
      type: 'select',
      props: {
        placeholder: '请选择角色',
        options: roleOptions.value,
        clearable: true
      }
    },
    {
      label: '积分状态',
      key: 'pointStatus',
      type: 'select',
      props: {
        placeholder: '请选择积分状态',
        options: pointOptions.value,
        clearable: true
      }
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    
    // 处理积分状态转换
    const searchParams = { ...formData.value }
    if (searchParams.pointStatus) {
      // 积分小于60为异常用户，大于等于60为正常用户
      if (searchParams.pointStatus === 'abnormal') {
        searchParams.point = 59 // 小于60
      } else if (searchParams.pointStatus === 'normal') {
        searchParams.point = 60 // 大于等于60
      }
      delete searchParams.pointStatus
    }
    
    // 过滤空参数
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    )
    
    emit('search', filteredParams)
    console.log('表单数据', filteredParams)
  }

  // 添加按回车键查询的功能
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  // 监听回车键
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
</script>

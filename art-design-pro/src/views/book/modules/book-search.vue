<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
    @keyup.enter="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ArtSearchBar from '@/components/core/forms/art-search-bar/index.vue'
  
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
  // 可添加校验规则
}

// 表单配置
const formItems = computed(() => [
  {
    label: '书名',
    key: 'title',
    type: 'input',
    placeholder: '请输入书名',
    clearable: true
  },
  {
    label: '作者',
    key: 'author',
    type: 'input',
    placeholder: '请输入作者',
    clearable: true
  },
  {
    label: 'ISBN',
    key: 'isbn',
    type: 'input',
    placeholder: '请输入ISBN',
    clearable: true
  },
  {
    label: '出版社',
    key: 'publisher',
    type: 'input',
    placeholder: '请输入出版社',
    clearable: true
  }
])

// 事件
function handleReset() {
  console.log('重置表单')
  emit('reset')
}

async function handleSearch() {
  await searchBarRef.value.validate()
  
  // 过滤空参数
  const searchParams = { ...formData.value }
  const filteredParams = Object.fromEntries(
    Object.entries(searchParams).filter(([_, value]) => {
      // 过滤掉 undefined、null、空字符串
      return value !== undefined && value !== null && value !== ''
    })
  )
  
  console.log('原始参数:', searchParams)
  console.log('过滤后参数:', filteredParams)
  
  emit('search', filteredParams)
}
</script>
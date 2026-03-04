<template>
  <div class="book-search">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ $t('table.searchBar.search') }}</span>
          <el-button
            type="text"
            @click="handleExpandOrCollapse"
            :class="{ 'is-expanded': isExpanded }"
          >
            {{ isExpanded ? $t('table.searchBar.collapse') : $t('table.searchBar.expand') }}
          </el-button>
        </div>
      </template>
      <el-form
        :inline="true"
        :model="searchForm"
        @keyup.enter="handleSearch"
      >
        <el-form-item label="书名">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入书名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="作者">
          <el-input
            v-model="searchForm.author"
            placeholder="请输入作者"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item label="ISBN">
          <el-input
            v-model="searchForm.isbn"
            placeholder="请输入ISBN"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item v-if="isExpanded">
          <el-input
            v-model="searchForm.publisher"
            placeholder="请输入出版社"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            {{ $t('table.searchBar.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('table.searchBar.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 搜索表单
const searchForm = reactive({
  title: '',
  author: '',
  isbn: '',
  publisher: ''
})

// 是否展开
const isExpanded = ref(false)

// 搜索事件
const emit = defineEmits(['search'])

/**
 * 处理搜索
 */
const handleSearch = () => {
  // 过滤空参数
  const params = Object.entries(searchForm).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value
    }
    return acc
  }, {} as any)
  emit('search', params)
}

/**
 * 处理重置
 */
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key as keyof typeof searchForm] = ''
  })
  emit('search', {})
}

/**
 * 处理展开/收起
 */
const handleExpandOrCollapse = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.book-search {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.is-expanded {
  color: var(--el-color-primary);
}
</style>
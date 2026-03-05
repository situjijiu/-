<template>
  <div class="book-display-page art-full-height">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>图书展示</h1>
      <p>浏览我们的图书收藏</p>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <ArtSearchBar
        ref="searchBarRef"
        v-model="searchForm"
        :items="formItems"
        :rules="rules"
        @reset="handleReset"
        @search="handleSearch"
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- 图书卡片列表 -->
    <div class="book-cards-container">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div v-for="i in 6" :key="i" class="book-card-skeleton">
            <el-skeleton-item variant="image" style="width: 100%; height: 200px" />
            <el-skeleton-item variant="p" style="width: 80%" />
            <el-skeleton-item variant="text" style="width: 60%" />
            <el-skeleton-item variant="text" style="width: 40%" />
          </div>
        </template>
        <template #default>
          <div v-for="book in bookList" :key="book.id" class="book-card">
            <el-card shadow="hover" :body-style="{ padding: '0' }">
              <div class="book-card-header">
                <el-image
                  :src="'/api/book/cover/' + book.cover.split('/').pop()"
                  fit="cover"
                  class="book-cover"
                />
              </div>
              <div class="book-card-body">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">作者：{{ book.author }}</p>
                <p class="book-publisher">出版社：{{ book.publisher }}</p>
                <p class="book-price">价格：{{ book.price.toFixed(2) }} 元</p>
                <div class="book-actions">
                  <el-button type="primary" size="small" @click="viewBookDetail(book)">
                    查看详情
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </el-skeleton>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[12, 24, 36]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 图书详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="书籍详情"
      width="800px"
      align-center
    >
      <div class="book-detail">
        <div class="detail-header">
          <el-image
            v-if="selectedBook?.cover"
            :src="'/api/book/cover/' + selectedBook.cover.split('/').pop()"
            class="cover"
            fit="cover"
          />
          <div class="book-info">
            <h3>{{ selectedBook?.title }}</h3>
            <p><strong>作者：</strong>{{ selectedBook?.author }}</p>
            <p><strong>ISBN：</strong>{{ selectedBook?.isbn }}</p>
            <p><strong>出版社：</strong>{{ selectedBook?.publisher }}</p>
            <p><strong>出版日期：</strong>{{ selectedBook?.publishDate }}</p>
            <p><strong>价格：</strong>{{ selectedBook?.price.toFixed(2) }} 元</p>
          </div>
        </div>
        <div class="detail-content">
          <h4>描述</h4>
          <p>{{ selectedBook?.description || '暂无描述' }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ArtSearchBar from '@/components/core/forms/art-search-bar/index.vue'
import { fetchGetBookList, type BookListItem } from '@/api/book'

// 搜索表单
const searchForm = ref({
  title: undefined,
  author: undefined,
  isbn: undefined,
  publisher: undefined
})

// 表单数据双向绑定
const searchBarRef = ref()

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

// 图书列表
const bookList = ref<BookListItem[]>([])

// 加载状态
const loading = ref(false)

// 分页信息
const pagination = ref({
  current: 1,
  size: 12
})

// 总条数
const total = ref(0)

// 详情对话框状态
const detailDialogVisible = ref(false)

// 当前选中的图书（用于详情查看）
const selectedBook = ref<BookListItem | null>(null)

/**
 * 初始化数据
 */
const initData = async () => {
  loading.value = true
  try {
    const params = {
      current: pagination.value.current,
      size: pagination.value.size,
      ...searchForm.value
    }
    const response = await fetchGetBookList(params)
    bookList.value = response.data || []
    total.value = response.total || 0
  } catch (error) {
    console.error('获取图书列表失败:', error)
    ElMessage.error('获取图书列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索处理
 */
const handleSearch = async () => {
  await searchBarRef.value.validate()
  
  // 过滤空参数
  const searchParams = { ...searchForm.value }
  const filteredParams = Object.fromEntries(
    Object.entries(searchParams).filter(([_, value]) => {
      return value !== undefined && value !== null && value !== ''
    })
  )
  
  // 更新搜索参数
  Object.assign(searchForm.value, filteredParams)
  pagination.value.current = 1
  await initData()
}

/**
 * 重置搜索
 */
const handleReset = () => {
  // 重置表单
  Object.keys(searchForm.value).forEach(key => {
    searchForm.value[key as keyof typeof searchForm.value] = undefined
  })
  pagination.value.current = 1
  initData()
}

/**
 * 处理页码变化
 */
const handleSizeChange = (size: number) => {
  pagination.value.size = size
  initData()
}

/**
 * 处理页码变化
 */
const handleCurrentChange = (current: number) => {
  pagination.value.current = current
  initData()
}

/**
 * 查看图书详情
 */
const viewBookDetail = (book: BookListItem) => {
  selectedBook.value = { ...book }
  detailDialogVisible.value = true
}

// 初始化数据
initData()
</script>

<style scoped>
.book-display-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.page-header p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.search-section {
  margin-bottom: 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.book-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.book-card-skeleton {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.book-card {
  transition: all 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-card-header {
  height: 200px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-card-body {
  padding: 16px;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #303133;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-author {
  font-size: 14px;
  color: #606266;
  margin: 0 0 4px 0;
}

.book-publisher {
  font-size: 14px;
  color: #606266;
  margin: 0 0 4px 0;
}

.book-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
  margin: 10px 0 16px 0;
}

.book-actions {
  display: flex;
  justify-content: flex-end;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 书籍详情样式 */
.book-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  margin-bottom: 30px;
}

.cover {
  width: 150px;
  height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.book-info {
  margin-left: 30px;
  flex: 1;
}

.book-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.book-info p {
  margin: 10px 0;
  line-height: 1.5;
}

.detail-content {
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.detail-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.detail-content p {
  line-height: 1.6;
  color: #606266;
}
</style>
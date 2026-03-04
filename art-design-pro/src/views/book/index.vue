<template>
  <div class="book-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">{{ $t('menus.book.list') }}</h2>
    </div>

    <!-- 搜索栏 -->
    <BookSearch @search="handleSearch" />

    <!-- 操作按钮 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAddBook">
        <el-icon><Plus /></el-icon>
        {{ $t('table.form.submit') }}
      </el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </div>

    <!-- 图书列表表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="书名" min-width="180" />
      <el-table-column prop="author" label="作者" min-width="120" />
      <el-table-column prop="isbn" label="ISBN" min-width="150" />
      <el-table-column prop="publisher" label="出版社" min-width="150" />
      <el-table-column prop="publishDate" label="出版日期" width="120" />
      <el-table-column prop="price" label="价格" width="100" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="handleEditBook(scope.row)">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDeleteBook(scope.row)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 图书添加/编辑对话框 -->
    <BookDialog
      v-model="dialogVisible"
      :book-data="currentBook"
      @submit="handleDialogSubmit"
    />

    <!-- 图书详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="书籍详情"
      width="800px"
    >
      <div class="book-detail">
        <div class="detail-header">
          <img v-if="selectedBook?.cover" :src="selectedBook.cover" class="cover" />
          <div class="book-info">
            <h3>{{ selectedBook?.title }}</h3>
            <p><strong>作者：</strong>{{ selectedBook?.author }}</p>
            <p><strong>ISBN：</strong>{{ selectedBook?.isbn }}</p>
            <p><strong>出版社：</strong>{{ selectedBook?.publisher }}</p>
            <p><strong>出版日期：</strong>{{ selectedBook?.publishDate }}</p>
            <p><strong>价格：</strong>{{ selectedBook?.price }} 元</p>
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
import { ref, reactive, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BookSearch from './modules/book-search.vue'
import BookDialog from './modules/book-dialog.vue'
import { fetchGetBookList, fetchDeleteBook, type BookListItem } from '@/api/book'

// 加载状态
const loading = ref(false)

// 表格数据
const tableData = ref<BookListItem[]>([])

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 选中的行
const selectedRows = ref<BookListItem[]>([])

// 对话框状态
const dialogVisible = ref(false)

// 详情对话框状态
const detailDialogVisible = ref(false)

// 当前编辑的图书
const currentBook = ref<BookListItem | null>(null)

// 当前选中的图书（用于详情查看）
const selectedBook = ref<BookListItem | null>(null)

// 搜索参数
const searchParams = reactive({
  title: '',
  author: '',
  isbn: ''
})

/**
 * 加载图书列表
 */
const loadBookList = async () => {
  loading.value = true
  try {
    const params = {
      current: pagination.current - 1,
      size: pagination.size,
      ...searchParams
    }
    // 注意：HTTP工具会返回res.data.data，所以res直接就是图书列表数组
    const bookList = await fetchGetBookList(params)
    tableData.value = bookList || []
    // 从响应头或其他方式获取total，这里暂时使用数组长度
    pagination.total = bookList?.length || 0
  } catch (error) {
    console.error('加载图书列表失败:', error)
    ElMessage.error('加载图书列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 处理搜索
 */
const handleSearch = (params: any) => {
  Object.assign(searchParams, params)
  pagination.current = 1
  loadBookList()
}

/**
 * 处理选择变化
 */
const handleSelectionChange = (rows: BookListItem[]) => {
  selectedRows.value = rows
}

/**
 * 处理分页大小变化
 */
const handleSizeChange = (size: number) => {
  pagination.size = size
  loadBookList()
}

/**
 * 处理分页当前页变化
 */
const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadBookList()
}

/**
 * 处理添加图书
 */
const handleAddBook = () => {
  currentBook.value = null
  dialogVisible.value = true
}

/**
 * 处理编辑图书
 */
const handleEditBook = (row: BookListItem) => {
  currentBook.value = { ...row }
  dialogVisible.value = true
}

/**
 * 处理删除图书
 */
const handleDeleteBook = async (row: BookListItem) => {
  try {
    await ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await fetchDeleteBook({ id: row.id })
    ElMessage.success('删除成功')
    loadBookList()
  } catch (error: any) {
    if (error !== 'cancel' && error !== undefined) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 处理批量删除
 */
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 本书吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const ids = selectedRows.value.map((item: BookListItem) => item.id)
    await fetchDeleteBook({ id: ids })
    ElMessage.success('删除成功')
    loadBookList()
  } catch (error: any) {
    if (error !== 'cancel' && error !== undefined) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 处理对话框提交
 */
const handleDialogSubmit = () => {
  dialogVisible.value = false
  loadBookList()
}

/**
 * 处理行点击事件，显示书籍详情
 */
const handleRowClick = (row: BookListItem) => {
  selectedBook.value = { ...row }
  detailDialogVisible.value = true
}

// 初始化加载数据
onMounted(() => {
  loadBookList()
})
</script>

<style scoped>
.book-manage {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.action-bar {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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
  object-fit: cover;
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
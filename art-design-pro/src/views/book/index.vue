<template>
  <div class="book-page art-full-height">
    <!-- 搜索栏 -->
    <BookSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></BookSearch>

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增图书</ElButton>
            <ElButton type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0" v-ripple>批量删除</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
        @row-click="handleRowClick"
      >
      </ArtTable>

      <!-- 图书添加/编辑对话框 -->
      <BookDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :book-data="currentBook"
        @submit="handleDialogSubmit"
      />

      <!-- 图书详情对话框 -->
      <ElDialog
        v-model="detailDialogVisible"
        title="书籍详情"
        width="800px"
        align-center
      >
        <div class="book-detail">
          <div class="detail-header">
            <ElImage v-if="selectedBook?.cover" :src="selectedBook.cover" class="cover" fit="cover" />
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
      </ElDialog>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { ElMessage, ElMessageBox, ElImage, ElSpace, ElButton, ElCard, ElDialog } from 'element-plus'
import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
import ArtTableHeader from '@/components/core/tables/art-table-header/index.vue'
import ArtTable from '@/components/core/tables/art-table/index.vue'
import { useTable } from '@/hooks/core/useTable'
import BookSearch from './modules/book-search.vue'
import BookDialog from './modules/book-dialog.vue'
import { fetchGetBookList, fetchDeleteBook, type BookListItem } from '@/api/book'
import { DialogType } from '@/types'

defineOptions({ name: 'Book' })

// 弹窗相关
const dialogType = ref<DialogType>('add')
const dialogVisible = ref(false)
const currentBook = ref<BookListItem | null>(null)

// 详情对话框状态
const detailDialogVisible = ref(false)

// 当前选中的图书（用于详情查看）
const selectedBook = ref<BookListItem | null>(null)

// 选中的行
const selectedRows = ref<BookListItem[]>([])

// 搜索表单
const searchForm = ref({
  title: undefined,
  author: undefined,
  isbn: undefined,
  publisher: undefined
})

const { 
  columns, 
  columnChecks, 
  data, 
  loading, 
  pagination, 
  getData, 
  searchParams, 
  resetSearchParams, 
  handleSizeChange, 
  handleCurrentChange, 
  refreshData 
} = useTable({
  // 核心配置
  core: {
    apiFn: fetchGetBookList,
    apiParams: {
      current: 1,
      size: 20,
      ...searchForm.value
    },
    columnsFactory: () => [
      { type: 'selection' }, // 勾选列
      { type: 'index', width: 60, label: '序号' }, // 序号
      {
        prop: 'title',
        label: '书名',
        minWidth: 180
      },
      {
        prop: 'author',
        label: '作者',
        minWidth: 120
      },
      {
        prop: 'isbn',
        label: 'ISBN',
        minWidth: 150
      },
      {
        prop: 'publisher',
        label: '出版社',
        minWidth: 150
      },
      {
        prop: 'publishDate',
        label: '出版日期',
        width: 120
      },
      {
        prop: 'price',
        label: '价格',
        width: 100,
        formatter: (row: BookListItem) => {
          return row.price.toFixed(2)
        }
      },
      {
        prop: 'operation',
        label: '操作',
        width: 120,
        fixed: 'right', // 固定列
        formatter: (row) =>
          h('div', [
            h(ArtButtonTable, {
              type: 'edit',
              onClick: () => showDialog('edit', row)
            }),
            h(ArtButtonTable, {
              type: 'delete',
              onClick: () => handleDeleteBook(row)
            })
          ])
      }
    ]
  },
  // 数据处理
  transform: {
    // 数据转换器
    dataTransformer: (records) => {
      // 类型守卫检查
      if (!Array.isArray(records)) {
        console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
        return []
      }

      return records
    }
  }
})

/**
 * 搜索处理
 * @param params 参数
 */
const handleSearch = (params: Record<string, any>) => {
  console.log('搜索参数:', params)
  // 清空搜索参数（保留分页参数）
  Object.keys(searchParams).forEach(key => {
    if (key !== 'current' && key !== 'size') {
      delete (searchParams as Record<string, any>)[key]
    }
  })
  // 搜索参数赋值
  Object.assign(searchParams, params)
  getData()
}

/**
 * 显示图书弹窗
 */
const showDialog = (type: DialogType, row?: BookListItem): void => {
  console.log('打开弹窗:', { type, row })
  
  dialogType.value = type
  currentBook.value = row || null
  dialogVisible.value = true
}

/**
 * 处理删除图书
 */
const handleDeleteBook = async (row: BookListItem) => {
  console.log('删除图书:', row)
  
  try {
    await ElMessageBox.confirm(`确定要删除该图书吗？`, '删除图书', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
    
    // 调用删除图书接口
    await fetchDeleteBook({ id: row.id })
    
    ElMessage.success('删除成功')
    // 删除成功后刷新数据
    await refreshData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
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
    await refreshData()
  } catch (error: any) {
    if (error !== 'cancel' && error !== undefined) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 处理对话框提交事件
 */
const handleDialogSubmit = async () => {
  try {
    // 提交成功后刷新数据
    await refreshData()
    
    dialogVisible.value = false
    currentBook.value = null
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  }
}

/**
 * 处理表格行选择变化
 */
const handleSelectionChange = (selection: BookListItem[]): void => {
  selectedRows.value = selection
  console.log('选中行数据:', selectedRows.value)
}

/**
 * 处理行点击事件，显示书籍详情
 */
const handleRowClick = (row: BookListItem) => {
  selectedBook.value = { ...row }
  detailDialogVisible.value = true
}
</script>

<style scoped>
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
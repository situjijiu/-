<!-- 借阅记录列表页面 -->
<template>
  <div class="art-full-height">
    <BorrowSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></BorrowSearch>

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('borrow')" v-ripple>借阅图书</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
        stripe
        border
        size="default"
        :header-cell-style="{
          background: '#f9fafb',
          color: '#333',
          fontWeight: '600'
        }"
        :cell-style="{
          padding: '12px 16px'
        }"
      >
      </ArtTable>
    </ElCard>

    <!-- 借阅图书弹窗 -->
    <BorrowDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :borrow-data="currentBorrowData"
      @success="refreshData"
    />

    <!-- 归还图书弹窗 -->
    <ReturnDialog
      v-model="returnDialogVisible"
      :borrow-id="currentBorrowId"
      @success="refreshData"
    />

    <!-- 积分兑换弹窗 -->
    <ExchangeDialog
      v-model="exchangeDialogVisible"
      :borrow-id="currentBorrowId"
      @success="refreshData"
    />

    <!-- 图书详情弹窗 -->
    <ElDialog
      v-model="bookDetailDialogVisible"
      title="图书详情"
      width="500px"
      destroy-on-close
    >
      <div v-if="currentBookDetail" class="book-detail">
        <div class="book-info">
          <div class="info-item">
            <span class="label">图书名称：</span>
            <span>{{ currentBookDetail.title }}</span>
          </div>
          <div class="info-item">
            <span class="label">作者：</span>
            <span>{{ currentBookDetail.author }}</span>
          </div>
          <div class="info-item">
            <span class="label">ISBN：</span>
            <span>{{ currentBookDetail.isbn }}</span>
          </div>
          <div class="info-item">
            <span class="label">出版社：</span>
            <span>{{ currentBookDetail.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="label">出版日期：</span>
            <span>{{ currentBookDetail.publishDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">价格：</span>
            <span>¥{{ currentBookDetail.price }}</span>
          </div>
          <div class="info-item">
            <span class="label">库存：</span>
            <span>{{ currentBookDetail.stock }}</span>
          </div>
          <div class="info-item">
            <span class="label">描述：</span>
            <span class="description">{{ currentBookDetail.description }}</span>
          </div>
        </div>
        <div v-if="currentBookDetail.cover" class="book-cover">
          <img :src="getCoverUrl(currentBookDetail.cover)" alt="图书封面" style="width: 150px; height: 200px; object-fit: cover;" />
        </div>
      </div>
      <div v-else class="loading">
        <ElLoading v-loading="true" text="加载中..." />
      </div>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, h, onMounted } from 'vue'
  import { ElButton, ElSpace, ElTag, ElMessage, ElMessageBox, ElDialog, ElLoading } from 'element-plus'
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import ArtTable from '@/components/core/tables/art-table/index.vue'
  import ArtTableHeader from '@/components/core/tables/art-table-header/index.vue'
  import BorrowSearch from './borrow-search.vue'
  import BorrowDialog from './borrow-dialog.vue'
  import ReturnDialog from './return-dialog.vue'
  import ExchangeDialog from './exchange-dialog.vue'
  import {
    fetchGetBorrowList,
    type BorrowRecord
  } from '@/api/borrow'
  import { fetchGetBookDetail } from '@/api/book'

  defineOptions({ name: 'BorrowList' })

  /**
   * 格式化日期为 yyyy-MM-dd HH:mm:ss 格式
   * @param date 日期字符串或Date对象
   * @returns 格式化后的日期字符串
   */
  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  /**
   * 处理图书名称点击事件，获取图书详情
   * @param row 借阅记录行数据
   */
  const handleBookClick = async (row: BorrowRecord) => {
    try {
      console.log('开始获取图书详情，图书ID:', row.bookId)
      const response = await fetchGetBookDetail(row.bookId)
      console.log('获取图书详情响应:', response)
      if (response.code === 200) {
        currentBookDetail.value = response.data
        bookDetailDialogVisible.value = true
      } else {
        ElMessage.error('获取图书详情失败: ' + response.msg)
      }
    } catch (error) {
      console.error('获取图书详情失败:', error)
      ElMessage.error('获取图书详情失败，请稍后重试')
    }
  }

  /**
   * 获取图书封面URL
   * @param coverPath 封面路径
   * @returns 完整的封面URL
   */
  const getCoverUrl = (coverPath: string): string => {
    // 提取文件名
    const filename = coverPath.split('/').pop()
    return `/api/book/cover/${filename}`
  }

  // 搜索表单
  const searchForm = ref({
    bookId: undefined,
    status: undefined,
    userId: undefined
  })

  const showSearchBar = ref(false)

  // 弹窗控制
  const dialogVisible = ref(false)
  const returnDialogVisible = ref(false)
  const exchangeDialogVisible = ref(false)
  const bookDetailDialogVisible = ref(false)
  const currentBorrowData = ref<any>(undefined)
  const currentBorrowId = ref<string>('')
  const currentBookDetail = ref<any>(undefined)
  const dialogType = ref<'borrow' | 'edit'>('borrow')

  // 表格数据
  const data = ref<BorrowRecord[]>([])
  const loading = ref(false)
  const pagination = ref({
    current: 1,
    size: 20,
    total: 0
  })

  // 获取借阅记录列表
  const getData = async () => {
    loading.value = true
    try {
      console.log('开始获取借阅记录列表...')
      const response = await fetchGetBorrowList({
        current: pagination.value.current,
        size: pagination.value.size,
        ...searchForm.value
      })
      console.log('获取借阅记录列表响应:', response)
      if (response.code === 200) {
        // 检查响应数据格式
        if (Array.isArray(response.data)) {
          // 如果直接返回数组
          data.value = response.data
          pagination.value.total = response.total || response.data.length
        } else if (response.data && response.data.records) {
          // 如果返回分页格式
          data.value = response.data.records || []
          pagination.value.total = response.data.total || 0
        } else {
          // 其他格式
          data.value = []
          pagination.value.total = 0
        }
        console.log('处理后的借阅记录数据:', data.value)
        console.log('总记录数:', pagination.value.total)
      }
    } catch (error) {
      console.error('获取借阅记录列表失败:', error)
      ElMessage.error('获取借阅记录列表失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refreshData = () => {
    pagination.value.current = 1
    getData()
  }

  // 重置搜索参数
  const resetSearchParams = () => {
    // 清空搜索表单
    Object.keys(searchForm.value).forEach(key => {
      searchForm.value[key as keyof typeof searchForm.value] = undefined
    })
    refreshData()
  }

  // 搜索处理
  const handleSearch = (params: Record<string, any>) => {
    // 搜索参数赋值
    Object.assign(searchForm.value, params)
    refreshData()
  }

  // 分页处理
  const handleSizeChange = (size: number) => {
    pagination.value.size = size
    getData()
  }

  const handleCurrentChange = (current: number) => {
    pagination.value.current = current
    getData()
  }

  // 列配置
  const columns = ref([
    {
      prop: 'bookName',
      label: '图书名称',
      minWidth: 150,
      formatter: (row) => {
        return h('span', {
          style: {
            color: '#409EFF',
            cursor: 'pointer',
            textDecoration: 'underline'
          },
          onClick: () => handleBookClick(row)
        }, row.bookName)
      }
    },
    {
      prop: 'borrowDate',
      label: '借阅时间',
      width: 180,
      formatter: (row) => formatDate(row.borrowDate)
    },
    {
      prop: 'dueDate',
      label: '借阅应还时间',
      width: 180,
      formatter: (row) => formatDate(row.dueDate)
    },
    {
      prop: 'returnDate',
      label: '实际归还时间',
      width: 180,
      formatter: (row) => formatDate(row.returnDate)
    },
    {
      prop: 'status',
      label: '状态',
      width: 130,
      formatter: (row) => {
        const statusMap = {
          0: { type: 'danger', text: '已逾期' },
          1: { type: 'warning', text: '借阅中' },
          2: { type: 'success', text: '已归还' },
          3: { type: 'info', text: '借阅待审核' },
          4: { type: 'info', text: '归还待审核' }
        }
        const statusConfig = statusMap[row.status] || { type: 'info', text: '未知' }
        return h(
          ElTag,
          { type: statusConfig.type as 'warning' | 'success' | 'danger' | 'info' },
          () => statusConfig.text
        )
      }
    },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      fixed: 'right',
      formatter: (row) => {
        const buttons = []
        
        if (row.status === 1) {
          buttons.push(
            {
              key: 'return',
              label: '归还图书',
              icon: 'ri:exchange-box-line'
            },
            {
              key: 'exchange',
              label: '兑换时长',
              icon: 'ri:coin-line'
            }
          )
        }
        
        return h('div', [
          h(ArtButtonMore, {
            list: buttons,
            onClick: (item: ButtonMoreItem) => buttonMoreClick(item, row)
          })
        ])
      }
    }
  ])

  const columnChecks = ref([])

  // 按钮点击处理
  const buttonMoreClick = (item: ButtonMoreItem, row: BorrowRecord) => {
    switch (item.key) {
      case 'return':
        currentBorrowId.value = row.id
        returnDialogVisible.value = true
        break
      case 'exchange':
        currentBorrowId.value = row.id
        exchangeDialogVisible.value = true
        break
    }
  }

  // 显示弹窗
  const showDialog = (type: 'borrow' | 'edit', row?: any) => {
    dialogVisible.value = true
    dialogType.value = type
    currentBorrowData.value = row
  }

  // 组件挂载时加载数据
  onMounted(() => {
    getData()
  })
</script>

<style scoped>
  .art-full-height {
    height: 100%;
    overflow: hidden;
  }

  .book-detail {
    display: flex;
    gap: 20px;
  }

  .book-info {
    flex: 1;
  }

  .info-item {
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .label {
    font-weight: 600;
    color: #606266;
    margin-right: 8px;
  }

  .description {
    display: block;
    margin-top: 4px;
    line-height: 1.5;
    color: #303133;
  }

  .book-cover {
    flex-shrink: 0;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }
</style>
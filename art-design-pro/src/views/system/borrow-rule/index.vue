<!-- 借阅规则管理页面 -->
<template>
  <div class="art-full-height">
    <BorrowRuleSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></BorrowRuleSearch>

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
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
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
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import BorrowRuleSearch from './modules/borrow-rule-search.vue'
  import ArtTable from '@/components/core/tables/art-table/index.vue'
  import ArtTableHeader from '@/components/core/tables/art-table-header/index.vue'
  import { fetchGetBorrowRuleList } from '@/api/system-manage'

  defineOptions({ name: 'BorrowRule' })

  // 搜索表单
  const searchForm = ref({
    status: undefined
  })

  const showSearchBar = ref(false)

  // 规则数据处理
  const data = ref<any[]>([])
  const loading = ref(false)
  
  // 获取规则列表
  const getData = async () => {
    loading.value = true
    try {
      const response = await fetchGetBorrowRuleList()
      if (response.code === 200) {
        data.value = response.data
      }
    } catch (error) {
      console.error('获取借阅规则列表失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  // 刷新数据
  const refreshData = () => {
    getData()
  }
  
  // 重置搜索参数
  const resetSearchParams = () => {
    // 清空搜索表单
    Object.keys(searchForm.value).forEach(key => {
      searchForm.value[key as keyof typeof searchForm.value] = undefined
    })
    getData()
  }
  
  // 列配置
  const columns = ref([
    {
      prop: 'maxBorrowDays',
      label: '最大借阅天数',
      minWidth: 120
    },
    {
      prop: 'maxBorrowNum',
      label: '最大借阅数量',
      minWidth: 120
    },
    {
      prop: 'pointPerDay',
      label: '每日扣除积分',
      minWidth: 120
    },
    {
      prop: 'returnReward',
      label: '按时还书奖励积分',
      minWidth: 150
    }
  ])
  
  const columnChecks = ref([])
  const pagination = ref(false) // 禁用分页
  const searchParams = ref({})

  /**
   * 搜索处理
   * @param params 搜索参数
   */
  const handleSearch = (params: Record<string, any>) => {
    // 搜索参数赋值
    Object.assign(searchParams, params)
    getData()
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
</style>
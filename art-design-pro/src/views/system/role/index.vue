<!-- 角色管理页面 -->
<template>
  <div class="art-full-height">
    <RoleSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></RoleSearch>

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
            <ElButton @click="showDialog('add')" v-ripple>新增角色</ElButton>
          </ElSpace>
        </template>
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

    <!-- 角色编辑弹窗 -->
    <RoleEditDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :role-data="currentRoleData"
      @success="refreshData"
    />

    <!-- 菜单权限弹窗 -->
    <RolePermissionDialog
      v-model="permissionDialog"
      :role-data="currentRoleData"
      @success="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, h, onMounted } from 'vue'
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import { fetchGetRoleList } from '@/api/system-manage'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import RoleSearch from './modules/role-search.vue'
  import RoleEditDialog from './modules/role-edit-dialog.vue'
  import RolePermissionDialog from './modules/role-permission-dialog.vue'
  import { ElTag, ElMessageBox, ElMessage } from 'element-plus'

  defineOptions({ name: 'Role' })

  type RoleListItem = Api.SystemManage.RoleListItem

  // 搜索表单
  const searchForm = ref({
    roleName: undefined,
    roleCode: undefined,
    description: undefined,
    enabled: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(false)

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const currentRoleData = ref<RoleListItem | undefined>(undefined)

  // 角色数据处理
  const data = ref<any[]>([])
  const loading = ref(false)
  
  // 角色映射
  const roleMap = {
    'SUPER_ADMIN': { name: '超级管理员', description: '拥有系统所有权限的管理员' },
    'ADMIN': { name: '管理员', description: '拥有系统管理权限的用户' },
    'USER': { name: '普通用户', description: '拥有基本操作权限的用户' }
  }
  
  // 获取角色列表
  const getData = async () => {
    loading.value = true
    try {
      const response = await fetchGetRoleList()
      if (response.code === 200) {
        // 转换数据格式
        data.value = response.data.map((roleCode: string) => ({
          roleId: roleCode,
          roleName: roleMap[roleCode].name,
          roleCode: roleCode,
          description: roleMap[roleCode].description,
          enabled: true,
          createTime: new Date().toISOString()
        }))
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
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
      prop: 'roleName',
      label: '角色名称',
      minWidth: 120
    },
    {
      prop: 'roleCode',
      label: '角色编码',
      minWidth: 120
    },
    {
      prop: 'description',
      label: '角色描述',
      minWidth: 150,
      showOverflowTooltip: true
    }
  ])
  
  const columnChecks = ref([])
  const pagination = ref(false) // 禁用分页
  const searchParams = ref({})

  const dialogType = ref<'add' | 'edit'>('add')

  const showDialog = (type: 'add' | 'edit', row?: RoleListItem) => {
    dialogVisible.value = true
    dialogType.value = type
    currentRoleData.value = row
  }

  /**
   * 搜索处理
   * @param params 搜索参数
   */
  const handleSearch = (params: Record<string, any>) => {
    // 处理日期区间参数，把 daterange 转换为 startTime 和 endTime
    const { daterange, ...filtersParams } = params
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    // 搜索参数赋值
    Object.assign(searchParams, { ...filtersParams, startTime, endTime })
    getData()
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: RoleListItem) => {
    switch (item.key) {
      case 'permission':
        showPermissionDialog(row)
        break
      case 'edit':
        showDialog('edit', row)
        break
      case 'delete':
        deleteRole(row)
        break
    }
  }

  const showPermissionDialog = (row?: RoleListItem) => {
    permissionDialog.value = true
    currentRoleData.value = row
  }

  const deleteRole = (row: RoleListItem) => {
    ElMessageBox.confirm(`确定删除角色"${row.roleName}"吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        // TODO: 调用删除接口
        ElMessage.success('删除成功')
        refreshData()
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
  }

  // 组件挂载时加载数据
  onMounted(() => {
    getData()
  })
</script>

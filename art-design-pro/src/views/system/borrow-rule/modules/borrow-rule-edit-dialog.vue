<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增借阅规则' : '编辑借阅规则'"
    width="600px"
    align-center
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <ElFormItem label="最大借阅天数" prop="maxBorrowDays">
        <ElInputNumber
          v-model="formData.maxBorrowDays"
          :min="1"
          :max="365"
          placeholder="请输入最大借阅天数"
        />
      </ElFormItem>
      
      <ElFormItem label="最大借阅数量" prop="maxBorrowNum">
        <ElInputNumber
          v-model="formData.maxBorrowNum"
          :min="1"
          :max="50"
          placeholder="请输入最大借阅数量"
        />
      </ElFormItem>
      
      <ElFormItem label="每日扣除积分" prop="pointPerDay">
        <ElInputNumber
          v-model="formData.pointPerDay"
          :min="0"
          :max="100"
          placeholder="请输入每日扣除积分"
        />
      </ElFormItem>
      
      <ElFormItem label="按时还书奖励积分" prop="returnReward">
        <ElInputNumber
          v-model="formData.returnReward"
          :min="0"
          :max="100"
          placeholder="请输入按时还书奖励积分"
        />
      </ElFormItem>
      
      <ElFormItem label="状态" prop="status">
        <ElSwitch
          v-model="formData.status"
          active-text="启用"
          inactive-text="禁用"
        />
      </ElFormItem>
    </ElForm>
    
    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { fetchAddBorrowRule, fetchUpdateBorrowRule } from '@/api/system-manage'

  interface Props {
    visible: boolean
    dialogType: 'add' | 'edit'
    ruleData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
  })

  const formRef = ref()
  const formData = reactive({
    id: undefined,
    maxBorrowDays: 30,
    maxBorrowNum: 5,
    pointPerDay: 1,
    returnReward: 10,
    status: true
  })

  // 校验规则
  const rules = {
    maxBorrowDays: [
      { required: true, message: '请输入最大借阅天数', trigger: 'blur' }
    ],
    maxBorrowNum: [
      { required: true, message: '请输入最大借阅数量', trigger: 'blur' }
    ],
    pointPerDay: [
      { required: true, message: '请输入每日扣除积分', trigger: 'blur' }
    ],
    returnReward: [
      { required: true, message: '请输入按时还书奖励积分', trigger: 'blur' }
    ]
  }

  // 监听 ruleData 变化，更新表单数据
  watch(() => props.ruleData, (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal)
    }
  }, { immediate: true })

  // 监听 dialogType 变化，重置表单
  watch(() => props.dialogType, () => {
    if (props.dialogType === 'add') {
      resetForm()
    }
  })

  // 重置表单
  const resetForm = () => {
    formData.id = undefined
    formData.maxBorrowDays = 30
    formData.maxBorrowNum = 5
    formData.pointPerDay = 1
    formData.returnReward = 10
    formData.status = true
    formRef.value?.resetFields()
  }

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate()
    
    try {
      if (props.dialogType === 'add') {
        await fetchAddBorrowRule(formData)
        ElMessage.success('新增成功')
      } else {
        await fetchUpdateBorrowRule(formData)
        ElMessage.success('更新成功')
      }
      emit('success')
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error('操作失败，请稍后重试')
    }
  }
</script>

<style scoped>
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
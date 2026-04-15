<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'borrow' ? '借阅图书' : '编辑借阅'"
    width="500px"
    align-center
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <ElFormItem label="图书ID" prop="bookId">
        <ElInput
          v-model="formData.bookId"
          placeholder="请输入图书ID"
          clearable
        />
      </ElFormItem>
      
      <ElFormItem label="借阅天数" prop="days">
        <ElInputNumber
          v-model="formData.days"
          :min="1"
          :max="90"
          placeholder="请输入借阅天数"
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
  import { ref, reactive, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { fetchBorrowBook } from '@/api/borrow'

  interface Props {
    visible: boolean
    dialogType: 'borrow' | 'edit'
    borrowData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = ref(props.visible)
  const formRef = ref()
  const formData = reactive({
    bookId: '',
    days: 30
  })

  // 校验规则
  const rules = {
    bookId: [
      { required: true, message: '请输入图书ID', trigger: 'blur' }
    ],
    days: [
      { required: true, message: '请输入借阅天数', trigger: 'blur' }
    ]
  }

  // 监听 visible 变化
  watch(() => props.visible, (newVal) => {
    dialogVisible.value = newVal
  })

  // 监听 borrowData 变化
  watch(() => props.borrowData, (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal)
    }
  }, { immediate: true })

  // 监听 dialogVisible 变化，向父组件传递
  watch(dialogVisible, (newVal) => {
    emit('update:visible', newVal)
  })

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate()
    
    try {
      await fetchBorrowBook(formData)
      ElMessage.success('借阅成功')
      emit('success')
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error('借阅失败，请稍后重试')
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
<template>
  <ElDialog
    v-model="dialogVisible"
    title="归还图书"
    width="400px"
    align-center
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <ElFormItem label="借阅记录ID">
        <ElInput
          v-model="formData.borrowId"
          :disabled="true"
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
  import { fetchReturnBook } from '@/api/borrow'

  interface Props {
    modelValue: boolean
    borrowId: string
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = ref(props.modelValue)
  const formRef = ref()
  const formData = reactive({
    borrowId: props.borrowId
  })

  // 校验规则
  const rules = {}

  // 监听 modelValue 变化
  watch(() => props.modelValue, (newVal) => {
    dialogVisible.value = newVal
  })

  // 监听 borrowId 变化
  watch(() => props.borrowId, (newVal) => {
    formData.borrowId = newVal
  })

  // 监听 dialogVisible 变化，向父组件传递
  watch(dialogVisible, (newVal) => {
    emit('update:modelValue', newVal)
  })

  // 提交表单
  const handleSubmit = async () => {
    await formRef.value?.validate()
    
    try {
      await fetchReturnBook(formData)
      ElMessage.success('归还成功')
      emit('success')
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error('归还失败，请稍后重试')
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
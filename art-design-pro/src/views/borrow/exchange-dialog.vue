<template>
  <ElDialog
    v-model="dialogVisible"
    title="积分兑换额外借阅时长"
    width="450px"
    align-center
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <ElFormItem label="兑换天数" prop="days">
        <ElInputNumber
          v-model="formData.days"
          :min="1"
          :max="30"
          placeholder="请输入兑换天数"
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
  import { fetchExchangePoints } from '@/api/borrow'

  interface Props {
    modelValue: boolean
    borrowId: string
    userPoint: number
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
    borrowId: props.borrowId,
    userPoint: props.userPoint,
    days: 1
  })

  // 校验规则
  const rules = {
    days: [
      { required: true, message: '请输入兑换天数', trigger: 'blur' }
    ]
  }

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
      await fetchExchangePoints(formData)
      ElMessage.success('兑换成功')
      emit('success')
      dialogVisible.value = false
    } catch (error) {
      ElMessage.error('兑换失败，请稍后重试')
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
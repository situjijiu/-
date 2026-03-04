<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加图书' : '编辑图书'"
    width="600px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="书名" prop="title">
            <ElInput v-model="formData.title" placeholder="请输入书名" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="作者" prop="author">
            <ElInput v-model="formData.author" placeholder="请输入作者" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="ISBN" prop="isbn">
            <ElInput v-model="formData.isbn" placeholder="请输入ISBN" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="出版社" prop="publisher">
            <ElInput v-model="formData.publisher" placeholder="请输入出版社" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="出版日期" prop="publishDate">
            <ElDatePicker
              v-model="formData.publishDate"
              type="date"
              placeholder="选择出版日期"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="价格" prop="price">
            <ElInputNumber
              v-model="formData.price"
              :min="0"
              :step="0.01"
              :precision="2"
              placeholder="请输入价格"
              style="width: 100%"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="封面图片">
            <ElUpload
              class="avatar-uploader"
              :action="'/api/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="formData.cover" :src="formData.cover" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </ElUpload>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="描述">
            <ElInput
              v-model="formData.description"
              type="textarea"
              :rows="4"
              placeholder="请输入书籍描述"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { fetchAddBook, fetchUpdateBook, type BookListItem } from '@/api/book'

interface Props {
  visible: boolean
  type: string
  bookData?: BookListItem | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 对话框显示控制
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const dialogType = computed(() => props.type)

// 表单实例
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  id: 0,
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  publishDate: '',
  price: 0,
  cover: '',
  description: ''
})

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入书名', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入作者', trigger: 'blur' }
  ],
  isbn: [
    { required: true, message: '请输入ISBN', trigger: 'blur' }
  ],
  publisher: [
    { required: true, message: '请输入出版社', trigger: 'blur' }
  ],
  publishDate: [
    { required: true, message: '请选择出版日期', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ]
}

/**
 * 初始化表单数据
 * 根据对话框类型（新增/编辑）填充表单
 */
const initFormData = () => {
  const isEdit = props.type === 'edit' && props.bookData
  const row = props.bookData

  Object.assign(formData, {
    id: isEdit && row ? row.id || 0 : 0,
    title: isEdit && row ? row.title || '' : '',
    author: isEdit && row ? row.author || '' : '',
    isbn: isEdit && row ? row.isbn || '' : '',
    publisher: isEdit && row ? row.publisher || '' : '',
    publishDate: isEdit && row ? row.publishDate || '' : '',
    price: isEdit && row ? row.price || 0 : 0,
    cover: isEdit && row ? row.cover || '' : '',
    description: isEdit && row ? row.description || '' : ''
  })
}

/**
 * 监听对话框状态变化
 * 当对话框打开时初始化表单数据并清除验证状态
 */
watch(
  () => [props.visible, props.type, props.bookData],
  ([visible]) => {
    if (visible) {
      initFormData()
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  },
  { immediate: true }
)

/**
 * 处理封面上传成功
 */
const handleAvatarSuccess = (response: any) => {
  formData.cover = response.data
}

/**
 * 上传前验证
 */
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 图片!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
  }
  
  return isJPG && isLt2M
}

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          // 添加图书
          await fetchAddBook(formData)
          ElMessage.success('添加成功')
        } else {
          // 编辑图书
          await fetchUpdateBook(formData)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        emit('submit')
      } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error('提交失败，请稍后重试')
      }
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #909399;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
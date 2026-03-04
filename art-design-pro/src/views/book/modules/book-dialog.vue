<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑图书' : '添加图书'"
    width="600px"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="80px"
    >
      <el-form-item label="书名" prop="title">
        <el-input v-model="formData.title" placeholder="请输入书名" />
      </el-form-item>
      
      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author" placeholder="请输入作者" />
      </el-form-item>
      
      <el-form-item label="ISBN" prop="isbn">
        <el-input v-model="formData.isbn" placeholder="请输入ISBN" />
      </el-form-item>
      
      <el-form-item label="出版社" prop="publisher">
        <el-input v-model="formData.publisher" placeholder="请输入出版社" />
      </el-form-item>
      
      <el-form-item label="出版日期" prop="publishDate">
        <el-date-picker
          v-model="formData.publishDate"
          type="date"
          placeholder="选择出版日期"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="价格" prop="price">
        <el-input-number
          v-model="formData.price"
          :min="0"
          :step="0.01"
          :precision="2"
          placeholder="请输入价格"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item label="封面图片">
        <el-upload
          class="avatar-uploader"
          :action="'/api/upload'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formData.cover" :src="formData.cover" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="请输入书籍描述"
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fetchAddBook, fetchUpdateBook, type BookListItem } from '@/api/book'

// 对话框可见性
const dialogVisible = ref(false)

// 表单引用
const formRef = ref<any>(null)

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

// 表单规则
const rules = {
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

// 图书数据
const props = defineProps({
  bookData: {
    type: Object as () => BookListItem | null,
    default: null
  }
})

// 事件
const emit = defineEmits(['update:modelValue', 'submit'])

// 是否为编辑模式
const isEdit = computed(() => !!props.bookData?.id)

// 监听bookData变化
watch(() => props.bookData, (newVal) => {
  if (newVal) {
    Object.assign(formData, newVal)
  } else {
    // 重置表单
    formData.id = 0
    formData.title = ''
    formData.author = ''
    formData.isbn = ''
    formData.publisher = ''
    formData.publishDate = ''
    formData.price = 0
    formData.cover = ''
    formData.description = ''
  }
}, { deep: true, immediate: true })

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:modelValue', newVal)
})

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
  
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      // 编辑图书
      await fetchUpdateBook(formData)
      ElMessage.success('编辑成功')
    } else {
      // 添加图书
      await fetchAddBook(formData)
      ElMessage.success('添加成功')
    }
    
    emit('submit')
  } catch (error) {
    console.error('提交失败:', error)
  }
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
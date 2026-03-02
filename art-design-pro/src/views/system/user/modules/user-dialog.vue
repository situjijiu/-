<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
    width="50%"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="用户名" prop="username">
            <ElInput v-model="formData.username" placeholder="请输入用户名" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="真实姓名" prop="realName">
            <ElInput v-model="formData.realName" placeholder="请输入真实姓名" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="手机号" prop="phone">
            <ElInput v-model="formData.phone" placeholder="请输入手机号" />
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="邮箱" prop="email">
            <ElInput v-model="formData.email" placeholder="请输入邮箱" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="性别" prop="sex">
            <ElSelect v-model="formData.sex">
              <ElOption label="男" value="1" />
              <ElOption label="女" value="0" />
              <ElOption label="保密" value="2" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="角色" prop="role">
            <ElSelect v-model="formData.role" :disabled="dialogType === 'edit'">
              <ElOption label="超级管理员" value="SUPER_ADMIN" />
              <ElOption label="管理员" value="ADMIN" />
              <ElOption label="普通用户" value="USER" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="地址" prop="address">
            <ElInput v-model="formData.address" placeholder="请输入地址" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="24">
          <ElFormItem label="签名" prop="signature">
            <ElInput type="textarea" v-model="formData.signature" placeholder="请输入签名" />
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElFormItem label="积分" prop="point">
            <ElInputNumber v-model="formData.point" :min="0" :max="10000" placeholder="请输入积分" />
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
  import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import type { FormInstance, FormRules } from 'element-plus'

  interface Props {
    visible: boolean
    type: string
    userData?: Partial<Api.SystemManage.UserListItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: typeof formData): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 角色列表数据
  const roleList = ref(ROLE_LIST_DATA)

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
    id: '',
    username: '',
    realName: '',
    phone: '',
    email: '',
    sex: '1',
    role: 'USER',
    address: '',
    signature: '',
    point: 0
  })

  // 表单验证规则
  const rules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    realName: [
      { required: true, message: '请输入真实姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
    address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
    point: [{ required: true, message: '请输入积分', trigger: 'blur' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    Object.assign(formData, {
      id: isEdit && row ? row.id || '' : '',
      username: isEdit && row ? row.username || '' : '',
      realName: isEdit && row ? row.realName || '' : '',
      phone: isEdit && row ? row.phone || '' : '',
      email: isEdit && row ? row.email || '' : '',
      sex: isEdit && row ? row.sex || '1' : '1',
      role: isEdit && row ? row.role || 'USER' : 'USER',
      address: isEdit && row ? row.address || '' : '',
      signature: isEdit && row ? row.signature || '' : '',
      point: isEdit && row ? row.point || 0 : 0
    })
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.userData],
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
   * 提交表单
   * 验证通过后触发提交事件
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
        dialogVisible.value = false
        emit('submit', formData)
      }
    })
  }
</script>

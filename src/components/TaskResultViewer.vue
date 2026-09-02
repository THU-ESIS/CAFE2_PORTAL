<template>
  <el-dialog
    title="分析结果"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
    append-to-body
  >
    <div class="result-container">
      <!-- REFACTOR: No change needed here, the full path is passed in the prop -->
      <img :src="imageUrl" @error="onImageError" alt="分析结果" class="result-image"/>
      <div v-if="imageError" class="error-message">
        <p>图片加载失败。</p>
        <p>请确认文件 <strong>{{ imageUrl }}</strong> 在服务器上存在并且路径正确。</p>
        <p>预期路径格式: ../RSTools/temp/{...}_visual.png</p>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TaskResultViewer',
  props: {
    visible: Boolean,
    imageUrl: String,
  },
  data() {
    return {
      imageError: false,
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      },
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.imageError = false;
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    onImageError() {
      this.imageError = true;
    }
  },
};
</script>

<style scoped>
.result-container {
  text-align: center;
}
.result-image {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 4px;
  background-color: #f5f7fa;
}
.error-message {
  margin-top: 20px;
  color: #f56c6c;
  padding: 15px;
  background-color: #fef0f0;
  border-left: 5px solid #f56c6c;
  text-align: left;
}
</style>

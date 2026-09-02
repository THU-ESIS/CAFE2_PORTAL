<template>
  <el-dialog
    :title="tool ? tool.name : '创建遥感分析任务'"
    :visible.sync="dialogVisible"
    width="600px"
    :before-close="handleClose"
    append-to-body
  >
    <el-form
      v-if="tool"
      ref="taskForm"
      :model="taskForm"
      :rules="rules"
      label-width="120px"
      v-loading="loading"
      :element-loading-text="loadingText"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="taskForm.taskName"
          placeholder="请输入任务名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="输入影像" prop="inputFile">
        <el-select
          v-model="taskForm.inputFile"
          placeholder="选择示例影像"
          filterable
          default-first-option
          style="width: 100%;"
        >
          <el-option
            v-for="item in sampleData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <div v-if="tool.id === 'spectral_indices'">
        <el-form-item label="光谱指数" prop="params.si">
          <el-select v-model="taskForm.params.si" placeholder="请选择光谱指数">
            <el-option label="NDVI (归一化植被指数)" value="ndvi"></el-option>
            <el-option label="EVI (增强型植被指数)" value="evi"></el-option>
            <el-option label="SAVI (土壤调整植被指数)" value="savi"></el-option>
            <el-option label="NDWI (归一化水体指数)" value="ndwi"></el-option>
            <el-option label="MNDWI (改进型归一化水体指数)" value="mndwi"></el-option>
            <el-option label="NDBI (归一化差异建筑指数)" value="ndbi"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div v-if="tool.id === 'image_enhancement'">
        <el-form-item label="增强方法" prop="params.method">
          <el-select v-model="taskForm.params.method" placeholder="请选择增强方法">
            <el-option label="直方图均衡化" value="histogram"></el-option>
            <el-option label="自适应直方图均衡化 (CLAHE)" value="clahe"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div v-if="tool.id === 'convolution_analysis'">
        <el-form-item label="滤波方法" prop="params.method">
          <el-select v-model="taskForm.params.method" placeholder="请选择滤波方法">
            <el-option label="边缘检测 (Sobel)" value="sobel"></el-option>
            <el-option label="边缘检测 (Prewitt)" value="prewitt"></el-option>
            <el-option label="边缘检测 (Laplacian)" value="laplacian"></el-option>
            <el-option label="边缘检测 (Scharr)" value="scharr"></el-option>
            <el-option label="边缘检测 (Canny)" value="canny"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div v-if="tool.id === 'cluster_analysis'">
        <el-form-item label="聚类方法" prop="params.method">
          <el-select v-model="taskForm.params.method" placeholder="请选择聚类方法">
            <el-option label="K-Means" value="kmeans"></el-option>
            <el-option label="高斯混合模型 (GMM)" value="gmm"></el-option>
            <el-option label="均值漂移 (MeanShift)" value="mean_shift"></el-option>
            <el-option label="谱聚类 (Spectral Clustering)" value="spectral_clustering"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="聚类数量" prop="params.clusters" v-if="taskForm.params.method !== 'mean_shift'">
          <el-input-number v-model="taskForm.params.clusters" :min="2" :max="20"></el-input-number>
        </el-form-item>
      </div>

      <div v-if="tool.id === 'image_segmentation'">
        <el-form-item label="分割方法" prop="params.method">
          <el-select v-model="taskForm.params.method" placeholder="请选择分割方法">
            <el-option label="Otsu 阈值法" value="otsu"></el-option>
            <el-option label="Yen 阈值法" value="yen"></el-option>
            <el-option label="Li 阈值法" value="li"></el-option>
            <el-option label="Minimum 阈值法" value="minimum"></el-option>
            <el-option label="Triangle 阈值法" value="triangle"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">提交任务</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { EventBus } from '../event-bus.js';

export default {
  name: 'CreateRemoteTaskModal',
  props: {
    visible: Boolean,
    tool: Object,
  },
  data() {
    return {
      loading: false,
      loadingText: '正在处理任务...',
      taskForm: {},
      sampleData: [
        { label: '示例数据: 湿地', value: 'wetlands' },
        { label: '示例数据: 农田', value: 'farmland' },
        { label: '示例数据: 城市', value: 'city' },
        { label: '示例数据: 森林', value: 'forest' },
      ],
      toolDefaults: {
        spectral_indices: { si: 'ndvi' },
        image_enhancement: { method: 'histogram' },
        convolution_analysis: { method: 'sobel' },
        cluster_analysis: { method: 'kmeans', clusters: 5 },
        image_segmentation: { method: 'otsu' },
      },
      rules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        inputFile: [{ required: true, message: '请选择影像', trigger: 'blur' }],
      },
    }
  },
  computed: {
    dialogVisible: {
      get() { return this.visible },
      set(value) { this.$emit('update:visible', value) },
    },
  },
  watch: {
    tool: {
      handler(newTool) {
        if (newTool) this.initializeForm(newTool)
      },
      immediate: true,
    },
    // --- ADDED: 监听聚类方法变化，如果是MeanShift则删除聚类数量参数 ---
    'taskForm.params.method'(newMethod) {
      if (this.tool.id === 'cluster_analysis') {
        if (newMethod === 'mean_shift' && this.taskForm.params.clusters) {
          // MeanShift不需要聚类数量，可以删除或忽略
          delete this.taskForm.params.clusters;
        } else if (newMethod !== 'mean_shift' && !this.taskForm.params.clusters) {
          // 切换回需要聚类数量的方法时，可以设置一个默认值
          this.$set(this.taskForm.params, 'clusters', 5);
        }
      }
    }
  },
  methods: {
    initializeForm(tool) {
      this.taskForm = {
        taskName: `${tool.name} - ${new Date().toLocaleString()}`,
        inputFile: this.sampleData[0].value,
        params: { ...this.toolDefaults[tool.id] },
      }
      this.$nextTick(() => {
        if (this.$refs.taskForm) this.$refs.taskForm.clearValidate()
      })
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const randomDelay = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000; // 1-4 seconds
          this.loadingText = '正在处理任务...'; // "Processing task..."


          const mainParam = this.taskForm.params.si || this.taskForm.params.method;
          const resultBasename = `${this.tool.id}_${this.taskForm.inputFile}_${mainParam}`;

          // FIX: Use the new relative path for results
          // const resultPathPrefix = `/temp_rs/${resultBasename}`;
          const resultPathPrefix = `http://39.96.170.13/temp_rs/${resultBasename}`;

          const newTask = {
            taskId: `proto-${Date.now()}`,
            taskName: this.taskForm.taskName,
            status: 'finished',
            createTime: Math.floor(Date.now() / 1000),
            updateTime: Math.floor(Date.now() / 1000),
            progress: 100,
            params: { ...this.taskForm.params, tool: this.tool.name, inputFile: this.taskForm.inputFile },
            resultFile: [
              { type: 'visualization', url: `${resultPathPrefix}_visual.png` },
              { type: 'data', url: `${resultPathPrefix}_data.tif` },
            ],
          };

          const existingTasks = JSON.parse(localStorage.getItem('prototype_tasks') || '[]');
          existingTasks.unshift(newTask);
          localStorage.setItem('prototype_tasks', JSON.stringify(existingTasks));

          setTimeout(() => {
            this.loading = false;
            this.$message.success('任务创建成功!');
            this.handleClose();
            EventBus.$emit('task-created');
            this.$router.push('/tasks');
          }, randomDelay);

        } else {
          this.$message.error('请检查表单输入!');
          return false;
        }
      });
    },
  },
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

* {
  font-family: 'Microsoft YaHei', sans-serif;
}

.el-select, .el-input-number {
  width: 100%;
}
</style>
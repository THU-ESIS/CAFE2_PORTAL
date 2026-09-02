<template>
  <div class="remote-analysis-container">
    <div class="content-wrapper">
      <h1 class="page-title">遥感影像分析工具箱</h1>
      <p class="page-description">
        选择一个遥感影像分析工具，配置参数并提交任务。
      </p>
      <el-row :gutter="20">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          v-for="tool in toolkits"
          :key="tool.id"
        >
          <el-card class="tool-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>{{ tool.name }}</span>
            </div>
            <div class="tool-card-body">
              <p class="tool-description">{{ tool.description }}</p>
              <el-button
                type="primary"
                icon="el-icon-s-tools"
                @click="openCreateTaskModal(tool)"
                >配置任务</el-button
              >
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <CreateRemoteTaskModal
      :visible.sync="isModalVisible"
      :tool="selectedTool"
      @task-complete="showResult"
    ></CreateRemoteTaskModal>

    <!-- REFACTOR: The result viewer is now triggered from the task detail page,
         but we'll leave it here in case you want to re-enable direct previews. -->
    <TaskResultViewer
      :visible.sync="isResultVisible"
      :image-url="resultImageUrl"
    ></TaskResultViewer>
  </div>
</template>

<script>
import CreateRemoteTaskModal from './create_remote_analysis.vue';
import TaskResultViewer from '../components/TaskResultViewer.vue';

export default {
  name: 'RemoteAnalysis',
  components: {
    CreateRemoteTaskModal,
    TaskResultViewer,
  },
  data() {
    return {
      isModalVisible: false,
      isResultVisible: false,
      selectedTool: null,
      resultImageUrl: '',
      toolkits: [
        { id: 'spectral_indices', name: '工具包1: 光谱指数计算', description: '计算植被指数、水体指数等多种常见光谱指数。' },
        { id: 'image_enhancement', name: '工具包2: 影像增强', description: '应用直方图均衡化、滤波等方法改善影像视觉效果。' },
        { id: 'convolution_analysis', name: '工具包3: 卷积分析', description: '通过不同的卷积核进行边缘检测、锐化等操作。' },
        { id: 'cluster_analysis', name: '工具包4: 聚类分析', description: '使用K-Means等非监督分类方法对影像进行聚类。' },
        { id: 'image_segmentation', name: '工具包5: 影像分割', description: '基于阈值或机器学习方法进行地物分类与提取。' },
      ],
    };
  },
  methods: {
    openCreateTaskModal(tool) {
      this.selectedTool = tool;
      this.isModalVisible = true;
    },
    // This method is kept for potential future use but is no longer the primary flow.
    showResult(imageUrl) {
      this.resultImageUrl = imageUrl;
      this.isResultVisible = true;
    },
  },
};
</script>

<style scoped>
.remote-analysis-container { padding: 40px; background-color: #f5f7fa; }
.content-wrapper { max-width: 1200px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
.page-title { font-size: 28px; font-weight: 600; color: #303133; text-align: center; margin-bottom: 10px; }
.page-description { text-align: center; color: #606266; margin-bottom: 40px; font-size: 16px; }
.tool-card { margin-bottom: 20px; border-radius: 8px; transition: all 0.3s ease; }
.tool-card:hover { transform: translateY(-5px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); }
.tool-card .clearfix span { font-weight: bold; font-size: 18px; color: #409eff; }
.tool-card-body { min-height: 120px; display: flex; flex-direction: column; justify-content: space-between; }
.tool-description { color: #606266; font-size: 14px; line-height: 1.5; margin-bottom: 20px; }
</style>

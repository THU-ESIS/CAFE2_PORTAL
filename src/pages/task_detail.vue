<template>
  <div class="wrapper">
    <h2>
      <el-button size="small" class="back-btn" icon="el-icon-arrow-left" @click="goBack"></el-button>
      {{ taskInfo.taskName }}
    </h2>
    <el-card class="content">
      <el-row :gutter="20">
        <el-col :span="18">
          <!-- IMPROVEMENT: Use Chinese labels -->
          <h3>任务信息</h3>
          <div class="content-list">
            <div class="item">
              <label>状态</label>
              <div class="item-content">
                <el-tag :type="statusTagType">{{ taskInfo.status }}</el-tag>
              </div>
            </div>
            <div class="item">
              <label>创建时间</label>
              <div class="item-content">{{ taskInfo.createTime }}</div>
            </div>
            <div class="item">
              <label>更新时间</label>
              <div class="item-content">{{ taskInfo.updateTime }}</div>
            </div>
            <div class="item">
              <label>任务参数</label>
              <div class="item-content">
                <!-- Pass the params object directly -->
                <TaskParamVisual :content="taskInfo.params" class="params" />
              </div>
            </div>
            <div class="item">
              <label>进度</label>
              <div class="item-content">
                <el-progress :percentage="taskInfo.progress" class="progress" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <h3>结果文件</h3>
          <div v-if="!taskInfo.resultFile || taskInfo.resultFile.length === 0" class="no-files">
             无可用结果文件
          </div>
          <div class="file" v-for="item in taskInfo.resultFile" :key="item.type">
            <div class="file-content">
              <i class="el-icon-document"></i>
              <div class="file-name" v-if="item.type === 'visualization'">可视化数据</div>
              <div class="file-name" v-else-if="item.type === 'data'">结果数据</div>
              <div class="file-name" v-else>{{ item.type.toUpperCase() }} file</div>
            </div>
            <el-button-group>
              <el-button v-if="item.type === 'visualization'" icon="el-icon-view" size="small" type="info" @click="preview(item.url)"></el-button>
              <el-button icon="el-icon-download" size="small" type="primary" @click="download(item.url)"></el-button>
            </el-button-group>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <TaskResultViewer :visible.sync="isResultVisible" :image-url="resultImageUrl"></TaskResultViewer>
  </div>
</template>

<script>
import { cafeClient } from '../clients';
import moment from 'dayjs';
import TaskParamVisual from '../components/TaskParamVisual';
import TaskResultViewer from '../components/TaskResultViewer.vue';

export default {
  name: 'TaskDetail',
  components: { TaskParamVisual, TaskResultViewer },
  computed: {
    statusTagType() {
      return { running: '', failed: 'danger', finished: 'success' }[this.taskInfo.status];
    },
  },
  data() {
    return {
      taskInfo: { status: 'running', resultFile: [], params: {} },
      isResultVisible: false,
      resultImageUrl: '',
    }
  },
  mounted() {
    this.getTaskDetail();
  },
  methods: {
    convertTaskInfo(taskInfo) {
        // Ensure params is an object, not a string
        let params = taskInfo.params;
        if (typeof params === 'string') {
            try {
                params = JSON.parse(params);
            } catch (e) {
                console.error("Failed to parse task params:", e);
                params = {};
            }
        }

        return {
            ...taskInfo,
            params: params, // Use the parsed object
            createTime: moment(taskInfo.createTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
            updateTime: moment(taskInfo.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
        };
    },
    getTaskDetail() {
      const { taskId } = this.$route.params;
      if (taskId.startsWith('proto-')) {
        const prototypeTasks = JSON.parse(localStorage.getItem('prototype_tasks') || '[]');
        const task = prototypeTasks.find(t => t.taskId === taskId);
        if (task) {
          this.taskInfo = this.convertTaskInfo(task);
        } else {
          this.$message.error('本地原型任务未找到!');
          this.taskInfo = { taskName: '未找到', status: 'failed', params: {} };
        }
      } else {
        cafeClient.getTaskDetail(taskId)
          .then(data => (this.taskInfo = this.convertTaskInfo(data)))
          .catch(e => this.$message.error(e.message));
      }
    },
    goBack() {
      this.$router.back();
    },
    download(link) {
      window.open(link, '_blank');
    },
    preview(link) {
      this.resultImageUrl = link;
      this.isResultVisible = true;
    }
  },
}
</script>

<style scoped lang="scss">
.wrapper { max-width: 1500px; min-width: 1000px; margin: 0 auto; > h2 { margin-bottom: 20px; display: flex; align-items: center; } }
.content { min-width: 1000px; min-height: 400px; }
.content-list { border-right: 1px solid #dedede; .item { display: flex; margin-bottom: 10px; > label { height: 32px; line-height: 32px; min-width: 120px; margin-right: 10px; font-weight: bold; color: #2f4152; } .item-content { min-height: 32px; line-height: 32px; } } .params { margin-top: 10px; margin-left: 5px; } .progress { width: 220px; margin-top: 10px; } }
.back-btn { margin-right: 20px; }
.file { height: 40px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2); border-radius: 4px; padding: 10px 20px; border: 1px solid #f5f5f5; color: #409dff; .file-content { display: flex; align-items: center; > i { margin-right: 15px; } } }
.no-files { color: #909399; font-size: 14px; padding: 20px; text-align: center; }
</style>

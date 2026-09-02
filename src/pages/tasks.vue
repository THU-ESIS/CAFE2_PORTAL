<template>
  <div class="tasks">
    <el-card class="tasks-content">
      <el-tabs v-model="selectStatus" class="tabs" @tab-click="handleSelectStatus">
        <el-tab-pane class="tab-pane" label="All Tasks" name="all"></el-tab-pane>
      </el-tabs>

      <el-table :data="data" border v-loading="loading">
        <el-table-column align="center" prop="taskIdSimple" label="ID"></el-table-column>
        <el-table-column align="center" prop="taskName" label="Task Name"></el-table-column>
        <el-table-column align="center" prop="models" label="Task Type">
          <template slot-scope="{ row }">
             <span v-if="row.taskId.startsWith('proto-')">遥感分析</span>
             <el-link v-else type="primary">{{ row.models ? row.models.length : 0 }} models</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="params" label="Task Params">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="Task Params" width="200" trigger="click">
              <TaskParamVisual :content="scope.row.params" />
              <el-link type="primary" size="small" slot="reference">Check Params</el-link>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="Create Time"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="Update Time"></el-table-column>
        <el-table-column align="center" prop="status" label="Status" width="100px">
          <template slot-scope="{ row }">
            <el-tag :type="{ running: '', failed: 'danger', finished: 'success' }[row.status]">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Actions" width="150px">
          <template slot-scope="scope">
            <el-link type="primary" @click="goDetail(scope.row)">Detail</el-link>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination :page-size="limit" :total="total" @current-change="handlePageChange"></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { cafeClient } from '../clients';
import moment from 'dayjs';
import TaskParamVisual from '../components/TaskParamVisual';
import { EventBus } from '../event-bus.js'; // BUG FIX: Import EventBus

export default {
  name: 'Tasks',
  components: { TaskParamVisual },
  data() {
    return {
      data: [],
      selectStatus: 'all',
      limit: 10,
      total: 0,
      page: 1,
      loading: false,
    }
  },
  mounted() {
    this.getTasks();
    // BUG FIX: Listen for the 'task-created' event
    EventBus.$on('task-created', this.getTasks);
  },
  beforeDestroy() {
    // BUG FIX: Clean up the event listener to prevent memory leaks
    EventBus.$off('task-created', this.getTasks);
  },
  methods: {
    async getTasks() {
      this.loading = true;
      try {
        const { list: realTasks, total: realTotal } = await cafeClient.getTaskList({
          limit: this.limit,
          offset: (this.page - 1) * this.limit,
        });

        const prototypeTasks = JSON.parse(localStorage.getItem('prototype_tasks') || '[]');

        const combinedList = ((this.page === 1) ? [...prototypeTasks, ...realTasks] : realTasks)
          .sort((a, b) => {
            const timeDifference = Number(b.createTime || 0) - Number(a.createTime || 0);
            if (timeDifference !== 0) return timeDifference;
            return String(b.taskId || '').localeCompare(String(a.taskId || ''));
          });

        this.data = this.convertData(combinedList);
        this.total = realTotal + prototypeTasks.length;

      } catch (e) {
        this.$message.error(`get tasks error: ${e.message}`);
      } finally {
        this.loading = false;
      }
    },
    handlePageChange(page) {
      this.page = page;
      this.getTasks();
    },
    convertData(list) {
      return list.map(item => ({
        ...item,
        createTime: moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment(item.updateTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
        taskIdSimple: item.taskId.slice(0, 8),
      }));
    },
    goDetail(task) {
      this.$router.push(`/tasks/${task.taskId}`);
    },
    handleSelectStatus(tabItem) {
      console.log(tabItem);
    },
  },
}
</script>

<style scoped lang="scss">
.tasks {
  width: 100%;
  padding: 20px 0;
}

.tasks-content {
  max-width: 1500px;
  margin: 0 auto;
  min-height: 400px;
}

.pagination-wrapper {
  margin: 20px 0;
}

.tabs {
  margin: 20px 0 30px 0;
}
</style>

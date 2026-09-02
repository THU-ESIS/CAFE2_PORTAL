<template>
  <div class="search">
    <div class="content">
      <SearchPanel
        @select="handleFilterChange"
        @toolbox-select="handleToolboxSelect"
      ></SearchPanel>
      <div class="table-wrapper">
        <el-table class="table" :data="data" border v-loading="loading">
          <el-table-column
            align="center"
            label="机构"
            prop="institute"
            width="80px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="模型"
            prop="model"
          ></el-table-column>
          <el-table-column align="center" label="试验" prop="experiment">
            <template slot-scope="{ row }">
              {{ translateContent('experiment', row.experiment) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="版本"
            prop="versionNumber"
          ></el-table-column>
          <el-table-column align="center" label="变量名称" prop="variableName">
            <template slot-scope="{ row }">
              {{ translateContent('variableName', row.variableName) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="系集成員"
            prop="ensembleMember"
          ></el-table-column>
          <el-table-column
            align="center"
            label="开始时间"
            prop="temporalStart"
            width="120px"
          ></el-table-column>
          <el-table-column
            align="center"
            label="结束时间"
            prop="temporalEnd"
            width="120px"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="120px"
            align="center"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button
                class="table-action-btn"
                :type="row.selected ? 'danger' : 'primary'"
                size="small"
                @click="toggleSelect(row)"
                >{{ row.selected ? '取消选择' : '选择' }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            :page-size="limit"
            :total="total"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      <div class="float-bottom-actions" v-sticky sticky-side="bottom">
        <div class="action">
          <div class="action-left">
            <label>已选择:</label> <span>{{ selectedItems.length }}</span>
          </div>
          <div class="action-right">
            <el-button
              type="danger"
              icon="el-icon-close"
              @click="unselectAll"
              v-if="selectedItems.length > 0"
              >全部取消</el-button
            >
            <el-button icon="el-icon-check" @click="selectAll"
              >全选</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              :disabled="selectedItems.length === 0"
              type="primary"
              icon="el-icon-edit-outline"
              @click="createTask"
              >创建任务</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <CreateTaskModal
      :visible.sync="showTaskCreateModal"
      :models="selectedItems"
      :selected-toolbox="selectedToolbox"
    ></CreateTaskModal>
  </div>
</template>

<script>
import { translate } from '../utils/translations'
import SearchPanel from '../components/SearchPanel'
import { cafeClient } from '../clients'
import CreateTaskModal from './create_task'

export default {
  name: 'Search',
  components: { CreateTaskModal, SearchPanel },
  data() {
    return {
      filter: {},
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      loading: false,
      showTaskCreateModal: false,
      shouldStick: true,
      // 新增：存储从 SearchPanel 传来的工具箱名称
      selectedToolbox: null,
    }
  },
  computed: {
    selectedItems() {
      return this.data.filter(i => i.selected)
    },
  },
  mounted() {},
  methods: {
    translateContent(field, value) {
      return translate(field, value)
    },
    handleFilterChange({ value }) {
      this.filter = value
      this.page = 1
      this.total = 0
      this.queryModelList()
    },
    // 新增：处理工具箱选择事件的方法
    handleToolboxSelect(toolboxName) {
      this.selectedToolbox = toolboxName
      console.log('当前选择的工具箱是:', this.selectedToolbox) // 可以在控制台查看效果
    },
    queryModelList() {
      this.loading = true
      cafeClient
        .queryModels({
          offset: (this.page - 1) * this.limit,
          limit: this.limit,
          ...this.filter,
        })
        .then(data => {
          const { modelList } = data
          const { list, rowCount } = modelList
          this.data = list.map(item => ({ ...item, selected: false }))
          this.total = rowCount

          this.$nextTick(() => {
            window.scrollTo(window.scrollX, window.scrollY - 1)
            window.scrollTo(window.scrollX, window.scrollY + 1)
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    handlePageChange(currentPage) {
      this.page = currentPage
      this.queryModelList()
    },
    toggleSelect(row) {
      row.selected = !row.selected
      this.data = [...this.data]
    },
    selectAll() {
      this.data = this.data.map(item => {
        item.selected = true
        return item
      })
    },
    unselectAll() {
      this.data = this.data.map(item => {
        item.selected = false
        return item
      })
    },
    createTask() {
      this.showTaskCreateModal = true
    },
  },
}
</script>

<style scoped lang="scss">
/* 样式部分保持不变 */
.search {
  width: 100%;
}
.table-wrapper {
  padding: 20px 40px;
  .table-action-btn {
    width: 80px;
  }
}
.content {
  max-width: 1500px;
  border: 1px solid #cecece;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background: #fff;
  margin: 0 auto;
}
.float-bottom-actions {
  height: 60px;
  background: #fff;
  border-top: 1px solid #c0c0c0;
  margin-top: 20px;
  box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);

  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }
  .action-left {
    font-size: 18px;
    label {
      color: #6a6d6f;
      margin-right: 10px;
    }
    span {
      color: #ffb323;
      font-weight: bolder;
    }
  }
}
.pagination-wrapper {
  margin: 20px 0;
}
</style>
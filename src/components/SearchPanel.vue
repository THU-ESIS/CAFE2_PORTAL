<template>
  <div class="search-panel-wrapper">
    <div class="toolbox-panel">
      <div class="toolbox-label">工具包:</div>
      <div class="toolbox-tags">
        <span v-for="tool in toolboxes" :key="tool" class="toolbox-tag">
          {{ tool }}
        </span>
      </div>
    </div>
    <div class="search-panel" v-loading="loading">
      <div
        class="search-panel-item"
        v-for="(items, key) in searchKeys"
        :key="key"
      >
        <div class="label">
          <label>{{ labelMapping[key] ? labelMapping[key] : key }}</label>
        </div>
        <div :class="{ tags: true, 'tags-oneline': !panelExpand }">
          <div class="tag" v-for="(tag, index) in items" :key="tag">
            <el-link
              :type="isTagSelected(tag, key) ? 'primary' : 'default'"
              @click="selectTag(tag, index, key)"
            >
              {{ translateContent(key, tag) }}
            </el-link>
          </div>
        </div>
      </div>
    </div>
    <div class="search-panel-handler" @click="togglePanelExpand">
      <el-icon :name="panelExpand ? 'arrow-up' : 'arrow-down'"></el-icon>
    </div>
  </div>
</template>

<script>
import { cafeClient } from '../clients'
// 导入翻译函数
import { translate } from '../utils/translations'

export default {
  name: 'SearchPanel',
  data() {
    return {
      // === 新增代码：静态的工具包数据 ===
      toolboxes: [
        '工具包6：长期基准分析',
        '工具包7：趋势分析',
        '工具包8：EOF分析',
        '工具包9：时序分析',
        '工具包10：季节循环分析',
      ],
      // === 新增代码结束 ===
      searchKeys: [],
      panelExpand: true,
      selected: {},
      loading: false,
      labelMapping: {
        institute: '机构',
        model: '模型',
        experiment: '试验',
        frequency: '频率',
        modelingRealm: '模拟域',
        ensembleMember: '系集成員',
        variableName: '变量',
        variable: '变量',
      },
    }
  },
  mounted() {
    this.queryFilterOptions().then(() => {
      this.$emit('select', { value: this.selected })
    })
  },
  methods: {
    // 新增方法，用于模板中调用翻译
    translateContent(field, value) {
      // 在labelMapping中查找字段的映射，因为searchKeys的key可能是variableName或variable
      const mappedField = Object.keys(this.labelMapping).find(
        k => this.labelMapping[k] === this.labelMapping[field]
      )
      return translate(mappedField || field, value)
    },
    queryFilterOptions() {
      this.loading = true

      return cafeClient
        .fetchFilterOptions()
        .then(data => {
          this.searchKeys = data
        })
        .catch(e => {
          this.$message.error(e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    togglePanelExpand() {
      this.panelExpand = !this.panelExpand
    },
    isTagSelected(tag, key) {
      return !!(this.selected[key] && this.selected[key].includes(tag))
    },
    selectTag(tag, index, key) {
      if (!this.selected[key]) {
        this.$set(this.selected, key, [])
      }
      if (!this.selected[key].includes(tag)) {
        this.selected[key].push(tag)
      } else {
        this.selected[key] = this.selected[key].filter(i => i !== tag)
      }
      this.selected = { ...this.selected }
      this.$emit('select', { value: this.selected, tag, key })
    },
  },
}
</script>

<style lang="scss" scoped>
/* === 新增代码：工具包行的专属样式 === */
.toolbox-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px 20px;
  background: linear-gradient(45deg, #409eff, #79bbff); /* 使用漂亮的蓝色渐变背景 */
  border-radius: 5px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.toolbox-label {
  color: #fff;
  font-weight: bold;
  font-size: 15px;
  margin-right: 15px;
  white-space: nowrap;
}

.toolbox-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 使用 gap 控制间距 */
}

.toolbox-tag {
  color: #337ecc; /* 深一些的蓝色字体 */
  background-color: rgba(255, 255, 255, 0.9); /* 半透明白色背景，更柔和 */
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: default; /* 表示不可点击 */
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* === 新增代码结束 === */

.search-panel-wrapper {
  margin-bottom: 20px;
}

.search-panel {
  position: relative;
  padding: 20px;
  box-shadow: 0 4px 5px -4px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #c0c0c0;
  min-height: 300px;
}

.search-panel-handler {
  width: 150px;
  margin: 0 auto;
  background: #fff;
  top: -1px;
  position: relative;
  border: 1px solid #c0c0c0;
  border-top: 0;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0 0 2px 2px;
  text-align: center;
  font-size: 20px;
  color: #c0c0c0;
}

.search-panel-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #e2e2e2;

  &:last-child {
    border-bottom: 0;
  }

  .label {
    width: 100px;
    min-width: 100px;
    margin-right: 20px;
    color: #6a6d6f;
    font-weight: bold;
    font-size: 12px;
  }

  .tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &.tags-oneline {
      height: 22px;
      overflow: hidden;
    }
  }

  .tag {
    margin: 0 10px 5px 5px;
    width: 110px;
    font-size: 12px;
    word-break: break-all;
    border: 1px solid #d2d2d2;
    border-radius: 2px;
    padding: 0 5px;

    .el-link {
      font-size: 12px;
      /* 确保长文本可以换行显示 */
      white-space: normal;
      line-height: 1.2;
      word-break: break-all;
    }
  }
}
</style>
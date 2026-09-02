<template>
  <div class="list">
    <!-- IMPROVEMENT: Iteratively display all params from the content object -->
    <div class="item" v-for="(value, key) in content" :key="key">
      <label>{{ paramLabels[key] || key }}</label>
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskParamVisual',
  props: {
    // Content can now be an object directly
    content: [String, Object],
  },
  data() {
    return {
      // A comprehensive mapping for all possible parameter keys
      paramLabels: {
        // Climate Task Params
        name: '方法',
        temporalStart: '开始时间',
        temporalEnd: '结束时间',
        lonMin: '最小经度',
        latMin: '最小纬度',
        lonMax: '最大经度',
        latMax: '最大纬度',
        // Remote Sensing Task Params
        tool: '分析工具',
        inputFile: '输入文件',
        si: '光谱指数',
        method: '处理方法',
        clusters: '聚类数量',
        kernel_size: '核大小',
        gamma: 'Gamma值',
        sigma: 'Sigma值',
      },
    }
  },
}
</script>

<style scoped>
.list {
  width: 100%;
  max-width: 230px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  line-height: 16px;
}

.item label {
  color: #ffba38;
  font-weight: bold;
  font-size: 12px;
  margin-right: 10px;
}

.item p {
  margin: 0;
  font-size: 12px;
  word-break: break-all;
}
</style>

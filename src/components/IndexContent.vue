<template>
  <div>
    <section>
      <h1>平台概述</h1>
      <div class="section-content">
        <p>
          为应对全球气候变化带来的海量、异构数据挑战，本平台提出“协同观测—协同管理—协同分析—协同研究”的计算范式。通过多点协同的数据云平台技术，平台旨在实现气候变化数据的高效共享和分析，支持国际气候变化数据的新型共享方式。平台集成了10个在线分析工具包，涵盖遥感图像与气候数据的多种主流分析方法。
        </p>
        <p>
          平台整合了分散的数据资源，用户可通过统一的可视化界面提交分析任务并获取计算结果。其关键技术包括数据索引自动提取、节点信息自动推送、全局数据高效检索及任务的智能调度与分发，极大地提升了数据组织和访问效率，为全球气候变化研究提供了强有力的技术支撑。
        </p>
      </div>
    </section>

    <section>
      <h1>系统架构</h1>
      <div class="section-content">
        <div class="float-left-content">
          <img src="../assets/figure1.jpg" alt="系统架构图" />
          <p>图1 气候变化协同分析系统架构</p>
        </div>
        <p>
          平台采用“对等”架构，首先构建单一数据节点的管理和分析能力，再通过设计多节点间的协同机制，实现协同分析。在单节点层面，系统实现了数据的高效存储、索引、检索及基本处理与分析功能。
        </p>
        <p>
          多个数据节点之间通过分布式调度和任务管理机制协同工作，确保分析任务能够合理分配至相应的数据存储节点执行，从而降低数据传输成本，提高计算效率。任务管理模块负责解析用户提交的任务，并将其拆解为多个子任务，依据数据存储位置进行分配，实现并行计算，提升处理效率。
        </p>
      </div>
    </section>

    <section>
      <h1>遥感影像分析</h1>
      <div class="section-content">
        <div class="float-right-content">
          <img src="../assets/figure6.png" alt="遥感影像分析流程图" />
          <p>图2 遥感影像分析流程示意图。</p>
        </div>
        <p>平台同样集成了面向遥感影像的在线分析工具，支持多种主流算法，帮助用户快速处理遥感数据。</p>

        <h3>工具包 1：光谱指数分析</h3>
        <p>通过不同波段的数学组合计算植被指数（NDVI）、水体指数（NDWI）等多种光谱指数，用于突出植被、水体、建筑等地物属性。</p>

        <h3>工具包 2：图像增强</h3>
        <p>通过直方图均衡化、滤波、锐化等技术优化遥感影像的对比度和清晰度，以突出特定地物特征，提高后续分析的准确性。</p>

        <h3>工具包 3：卷积滤波分析</h3>
        <p>应用卷积核实现影像的平滑、锐化、边缘检测和纹理增强，广泛用于遥感影像的去噪和地物边界提取。</p>

        <h3>工具包 4：聚类分析</h3>
        <p>采用K-Means等无监督机器学习方法，根据数据的相似性自动将像素划分为不同类别，适用于土地覆盖分类和环境变化监测。</p>

        <h3>工具包 5：图像分割</h3>
        <p>根据像素的光谱或空间特征，使用阈值法或机器学习方法将影像划分为具有相似特征的区域，常用于土地利用分类和地物识别。</p>
      </div>
    </section>

    <section>
      <h1>气候数据分析</h1>
      <div class="section-content">
        <div class="float-right-content">
          <img src="../assets/figure3.jpg" alt="CAFE工作流示意图" />
          <p>图3 EOF分析。</p>
        </div>
        <p>平台提供多种气候数据在线分析工具，用户可通过参数筛选、任务创建和结果查看的流程，完成复杂的科学计算。</p>

        <h3>工具包 6：长期基准分析</h3>
        <p>计算气候变量在特定时间段（如30年）的平均状态，为研究气候变化趋势、评估气候模型提供稳定基线。</p>

        <h3>工具包 7：趋势分析</h3>
        <p>通过线性回归等方法检测和量化气候变量（如全球气温、海冰面积）的长期变化趋势与速率。</p>

        <h3>工具包 8：EOF分析</h3>
        <p>采用经验正交函数（EOF）分解时空数据，提取气候与环境数据场中的主导变化模式，常用于ENSO、NAO等大尺度模态研究。</p>

        <h3>工具包 9：变化预测分析</h3>
        <p>基于历史气候数据的时间序列，结合回归模型进行外推，预测未来若干年气候变量的可能变化趋势。</p>

        <h3>工具包 10：季节循环分析</h3>
        <p>提取气候数据（如温度、降水）在年内的季节性周期特征，并分析其长期变化趋势，以研究全球变暖对季节模式的影响。</p>
      </div>
    </section>
    <footer>
      <a href="https://cloud.tsinghua.edu.cn/f/30981f3dd8ad4ec7b6c7/" target="_blank" rel="noopener noreferrer">用户操作手册</a>
    </footer>
  </div>
</template>

<script>
export default {
  name: "IndexContent"
};
</script>

<style scoped lang="scss">
/* 设置核心字体为“微软雅黑” */
section {
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  margin: 20px 0;
  padding: 20px 0;
  border-bottom: 1px solid #c0c0c0;

  h1 {
    font-size: 20px;
    padding-left: 15px;
    position: relative;
    font-weight: 600;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      height: 20px;
      width: 4px;
      background: rgb(255, 186, 56);
    }
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 25px;
  }

  p {
    text-align: justify;
    color: #2f4152;
    line-height: 1.8;
  }
}

$float-margin-size: 20px;
.float-left-content {
  float: left;
  margin-right: $float-margin-size;
}
.float-right-content {
  float: right;
  margin-left: $float-margin-size;
}
.float-left-content , .float-right-content {
  $image-size: 350px;
  width: $image-size;
  img {
    width: $image-size;
    border: 1px solid #eee; /* 为图片添加一个细边框 */
  }
  p {
    font-size: 12px; /* 调整图片注释字体大小 */
    color: #555;
    text-align: center;
    margin-top: 5px;
  }
}
.section-content {
  overflow: hidden; /* 使用 overflow: hidden 清除浮动 */
}
</style>
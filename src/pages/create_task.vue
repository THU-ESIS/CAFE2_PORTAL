<template>
  <el-dialog
    title="创建气候分析任务"
    :visible.sync="dialogVisible"
    width="750px"
    :before-close="handleClose"
  >
    <div>
      <el-form
        size="small"
        label-width="100px"
        ref="taskFrom"
        :model="taskForm"
        :rules="rules"
      >
        <el-form-item label="任务名称" prop="taskName">
          <el-input
            placeholder="请输入任务名称"
            v-model="taskForm.taskName"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始年份" prop="temporalStart">
          <el-select v-model="taskForm.temporalStart" placeholder="请选择">
            <el-option
              v-for="age in startAgeOptions"
              :value="age + '01'"
              :key="age"
              :label="age"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束年份" prop="temporalEnd">
          <el-select v-model="taskForm.temporalEnd" placeholder="请选择">
            <el-option
              v-for="age in endAgeOptions"
              :value="age + '12'"
              :key="age"
              :label="age"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分析方法" prop="name">
          <el-select v-model="taskForm.name" style="width: 100%" placeholder="请选择">
            <el-option
              v-for="(funcName, func) in functionOptions"
              :value="func"
              :key="func"
              :label="funcName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="geo-extent-form-item"
          prop="extent"
          label="空间范围"
        >
          <div class="map-container">
            <el-alert
              class="absolute-alert"
              v-if="!extentRectangle"
              title="请在地图上点击并拖拽以绘制矩形范围"
              type="warning"
              :closable="false"
            >
            </el-alert>
            <el-alert
              class="absolute-alert"
              v-if="extentRectangle"
              title="您可以拖动矩形的顶点来调整范围大小"
              type="warning"
              :closable="false"
            >
            </el-alert>
            <div class="map" ref="mapContainer"></div>
          </div>
          <div class="extent-wrapper">
            <el-input-number
              class="extent-input"
              controls-position="right"
              placeholder="最小经度"
              :min="-180"
              :max="taskForm.extent[2]"
              :step="0.01"
              v-model="taskForm.extent[0]"
              @change="handleExtentUpdate"
            ></el-input-number>
            <el-input-number
              class="extent-input"
              controls-position="right"
              placeholder="最小纬度"
              :min="-90"
              :max="taskForm.extent[3]"
              :step="0.01"
              v-model="taskForm.extent[1]"
              @change="handleExtentUpdate"
            ></el-input-number>
            <el-divider direction="vertical"></el-divider>
            <el-input-number
              style="margin-left: 5px"
              class="extent-input"
              controls-position="right"
              placeholder="最大经度"
              :min="taskForm.extent[0]"
              :max="180"
              :step="0.01"
              v-model="taskForm.extent[2]"
              @change="handleExtentUpdate"
            ></el-input-number>
            <el-input-number
              class="extent-input"
              controls-position="right"
              placeholder="最大纬度"
              :step="0.01"
              :min="taskForm.extent[1]"
              :max="90"
              v-model="taskForm.extent[3]"
              @change="handleExtentUpdate"
            ></el-input-number>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">创建任务</el-button>
    </span>
  </el-dialog>
</template>

<script>
// The script section remains the same, no changes needed here.
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import MapboxDrawRectangle from '../lib/mapbox_draw_rectangle'
import RectangleDirectMode from '../lib/rectangle_direct_override'
import { cafeClient } from '../clients'
import { FUNCTION_DICT } from '../constants'

const getYearOptionsFromRange = (start, end) => {
  const result = []
  for (let i = start; i <= end; i++) {
    result.push(i.toString())
  }
  return result
}

const getCompleteBoundaryYear = (value, isStart) => {
  const timestamp = String(value || '')
  const year = parseInt(timestamp.substring(0, 4), 10)
  const parsedMonth = parseInt(timestamp.substring(4, 6), 10)

  if (!Number.isFinite(year)) return NaN

  const month = Number.isFinite(parsedMonth) ? parsedMonth : (isStart ? 1 : 12)
  if (isStart && month > 1) return year + 1
  if (!isStart && month < 12) return year - 1
  return year
}

const DEFAULT_AGE_RANGE = [1950, 2014]
let mapboxgl
export default {
  name: 'CreateTaskModal',
  props: {
    visible: Boolean,
    models: Array,
  },
  data() {
    return {
      selected: [],
      loading: false,
      dialogVisible: false,
      // FIX: Initialize all properties of taskForm to make them reactive
      taskForm: {
        taskName: '',
        temporalStart: '',
        temporalEnd: '',
        name: '',
        extent: []
      },
      functionOptions: FUNCTION_DICT,
      extentRectangle: null,
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度应为 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        temporalStart: [
          { required: true, message: '请选择开始年份', trigger: 'blur' },
        ],
        temporalEnd: [
          { required: true, message: '请选择结束年份', trigger: 'blur' },
        ],
        name: [{ required: true, message: '请选择分析方法', trigger: 'blur' }],
        extent: [{ required: true, message: '请在地图上绘制范围', trigger: 'blur' }],
      },
    }
  },
  beforeMount() {
    import('mapbox-gl').then(({ default: mbgl }) => {
      // It's recommended to use your own Mapbox token
      mbgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN || ''
      mapboxgl = mbgl
    })
  },
  computed: {
    availableAgeRange() {
      const starts = (this.models || [])
        .map(model => getCompleteBoundaryYear(model.temporalStart, true))
        .filter(Number.isFinite)
      const ends = (this.models || [])
        .map(model => getCompleteBoundaryYear(model.temporalEnd, false))
        .filter(Number.isFinite)

      if (!starts.length || !ends.length) return DEFAULT_AGE_RANGE

      const range = [Math.max(...starts), Math.min(...ends)]
      return range[0] <= range[1] ? range : DEFAULT_AGE_RANGE
    },
    startAgeOptions() {
      const { temporalEnd } = this.taskForm
      return getYearOptionsFromRange(
        this.availableAgeRange[0],
        temporalEnd ? parseInt(temporalEnd.substring(0, 4), 10) : this.availableAgeRange[1],
      )
    },
    endAgeOptions() {
      const { temporalStart } = this.taskForm
      return getYearOptionsFromRange(
        temporalStart ? parseInt(temporalStart.substring(0, 4), 10) : this.availableAgeRange[0],
        this.availableAgeRange[1],
      )
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.onShow()
      } else {
        this.onHide()
      }
      this.dialogVisible = value
    },
    dialogVisible(value) {
      this.$emit('update:visible', value)
    },
  },
  mounted() {
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$refs.taskFrom.resetFields()
    },
    handleSubmit() {
      this.$refs.taskFrom.validate(valid => {
        if (!valid) {
          return this.$message.error('表单校验失败，请检查输入！')
        }
        const models = this.models
        const taskForm = this.taskForm
        this.loading = true
        cafeClient
          .createTask(this.convertFormContent(models, taskForm))
          .then(() => {
            this.$message.success('创建任务成功！')
            this.dialogVisible = false
            this.$emit('task-created'); // Notify parent to refresh list
          })
          .catch(e => this.$message.error(`创建任务失败: ${e.message}`))
          .finally(() => {
            this.loading = false
          })
      })
    },
    convertFormContent(
      models,
      { taskName, temporalStart, temporalEnd, name, extent },
    ) {
      return {
        models,
        nclScript: {
          taskName,
          temporalStart,
          temporalEnd,
          name,
          lonMin: extent[0],
          latMin: extent[1],
          lonMax: extent[2],
          latMax: extent[3],
        },
      }
    },
    onShow() {
      this.initMap()
    },
    handleExtentUpdate() {
      const value = this.taskForm.extent
      if (value && value.filter(i => typeof i === 'number').length === 4) {
        if (!this.extentRectangle) {
          this.createRectangleFromExtent(value)
        } else {
          this.updateRectangleFromExtent(value)
        }
      }
    },
    onHide() {
    },
    createRectangleFromExtent(extent) {
      const box = {
        type: 'Feature',
        properties: { isRectangle: true },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [extent[0], extent[1]],
              [extent[2], extent[1]],
              [extent[2], extent[3]],
              [extent[0], extent[3]],
              [extent[0], extent[1]],
            ],
          ],
        },
      }
      this.draw.set({
        type: 'FeatureCollection',
        features: [box],
      })

      this.map.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        { padding: 30 },
      )
    },
    updateRectangleFromExtent(extent) {
      const f = this.draw.get(this.extentRectangle.id)
      f.geometry.coordinates = [
        [
          [extent[0], extent[1]],
          [extent[2], extent[1]],
          [extent[2], extent[3]],
          [extent[0], extent[3]],
          [extent[0], extent[1]],
        ],
      ]
      this.draw.set({
        type: 'FeatureCollection',
        features: [f],
      })
      this.map.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        { padding: 30 },
      )
    },
    getExtentFromFeature(feature) {
      const bounds = new mapboxgl.LngLatBounds()
      feature.geometry.coordinates[0].forEach(item => {
        bounds.extend(item)
      })
      const min = bounds.getSouthWest()
      const max = bounds.getNorthEast()
      return [min.lng, min.lat, max.lng, max.lat]
    },
    initMap() {
      this.$nextTick(() => {
        if (this.map) return; // Prevent re-initialization
        this.map = new mapboxgl.Map({
          container: this.$refs.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [116.4, 39.9],
          zoom: 2,
        })
        const modes = MapboxDraw.modes
        modes.draw_rectangle = MapboxDrawRectangle
        modes.direct_select = RectangleDirectMode
        const draw = new MapboxDraw({
          modes,
          displayControlsDefault: false,
          controls: {
            trash: false,
          },
        })
        this.draw = draw
        this.map.addControl(draw)
        draw.changeMode('draw_rectangle')
        this.map
          .on('draw.create', ({ features }) => {
            const f = features[0]
            this.extentRectangle = f
            this.taskForm.extent = this.getExtentFromFeature(f)
            this.taskForm = { ...this.taskForm }
          })
          .on('draw.update', ({ features }) => {
            const f = features[0]
            this.taskForm.extent = this.getExtentFromFeature(f)
            this.taskForm = { ...this.taskForm }
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
}

.map {
  height: 400px;
}

.absolute-alert {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 10;
  width: 480px;
  opacity: 0.85;
  line-height: 18px;
}

.extent-input {
  margin-right: 5px;
}

.extent-wrapper {
  margin-top: 5px;
}
</style>

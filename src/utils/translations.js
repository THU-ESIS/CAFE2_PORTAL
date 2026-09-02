// src/utils/translations.js

// 变量的翻译
const variableMap = {
  pr: '降水量 (pr)',
  prsn: '降雪量 (prsn)',
  sic: '海冰密集度 (sic)',
  sit: '海冰厚度 (sit)',
  snd: '积雪厚度 (snd)',
  snoToIce: '雪-冰转化量 (snoToIce)',
  snomelt: '融雪量 (snomelt)',
  so: '海水盐度 (so)',
  tos: '海面温度 (tos)',
};

// 试验的翻译
const experimentMap = {
  historical: '历史模拟',
  piControl: '工业革命前控制',
  '1pctCO2': '1% CO2 增长模拟',
  // 如果有更多试验，请继续在此添加
};

// 模拟域的翻译
const realmMap = {
  ocean: '海洋',
  seaice: '海冰',
  // 如果有更多模拟域，请继续在此添加
};

// 频率的翻译
const frequencyMap = {
  mon: '月',
  // 如果有更多频率，请继续在此添加
};


// 将所有翻译字典组合到一个对象中
export const translations = {
  variableName: variableMap,
  variable: variableMap, // 兼容 search.vue 和 SearchPanel.vue 中可能不同的 key
  experiment: experimentMap,
  modelingRealm: realmMap,
  frequency: frequencyMap,
  // 您可以为其他字段（如 institute, model）继续添加翻译
};

/**
 * 通用翻译函数
 * @param {string} field - 要翻译的字段类别, e.g., 'experiment'
 * @param {string} value - 要翻译的英文原值, e.g., 'historical'
 * @returns {string} - 返回翻译后的中文，如果找不到则返回原值
 */
export function translate(field, value) {
  if (translations[field] && translations[field][value]) {
    return translations[field][value];
  }
  return value;
}
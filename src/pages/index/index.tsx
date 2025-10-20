import { useState, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import './index.less'

export default function Index() {
  // 天气和积水数据
  const [rainfall, setRainfall] = useState<number>(6.2)
  const [rainfallLevel, setRainfallLevel] = useState<string>('中雨')
  const [waterLevel, setWaterLevel] = useState<number>(4)
  const [riskIndex, setRiskIndex] = useState<number>(23)
  const [riskPrediction, setRiskPrediction] = useState<string>('建议中午避开此路段')
  const [searchText, setSearchText] = useState<string>('')
  const [currentLocation, setCurrentLocation] = useState<string>('上海市')
  
  // 模拟数据获取
  useEffect(() => {
    // 这里可以添加实际的数据获取逻辑
    console.log('获取天气和积水数据')
  }, [])
  
  // 格式化时间轴标签
  const timeLabels = ['现在', '9', '中午12', '3', '6', '9']

  return (
      <View className='page-index'>
        {/* 顶部地点信息 */}
        <View className='location-section'>
          <Text className='location-text'>{currentLocation}</Text>
          <Text className='location-icon'>📍</Text>
        </View>

        {/* 搜索栏 */}
        <View className='search-section'>
          <View className='search-bar'>
            <Text className='search-icon'>🔍</Text>
            <Input 
              className='search-input' 
              placeholder='搜索其他地区' 
              value={searchText}
              onInput={(e) => setSearchText(e.detail.value)}
            />
          </View>
        </View>

        {/* 顶部信息卡片 */}
        <View className='info-cards'>
          <View className='rainfall-card'>
            <Text className='card-title'>当前雨量</Text>
            <Text className='rainfall-value'>{rainfall}</Text>
            <Text className='rainfall-level'>{rainfallLevel}</Text>
            
          </View>
          <View className='water-card'>
            <Text className='card-title'>路面积水</Text>
            <Text className='water-value'>{waterLevel}</Text>
            <Text className='water-unit'>cm</Text>
          </View>
        </View>

        {/* 风险指数 */}
        <View className='risk-index-section'>
          <Text className='section-title'>风险指数</Text>
          <View className='risk-content'>
            <Text className='risk-value'>{riskIndex}</Text>
            <View className='risk-progress'>
              <View className='progress-ring'>
                <View className='progress-fill'></View>
              </View>
            </View>
          </View>
        </View>

        {/* 风险预测 */}
        <View className='prediction-section'>
          <Text className='section-title'>风险预测</Text>
          <Text className='prediction-text'>{riskPrediction}</Text>
          <View className='timeline'>
            {timeLabels.map((label, index) => (
              <View key={index} className={`time-item ${index === 2 ? 'high-risk' : ''}`}>
                <Text className='time-label'>{label}</Text>
              </View>
            ))}
          </View>
        </View>

      </View>
    )
}

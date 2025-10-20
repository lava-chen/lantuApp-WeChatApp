import { useEffect, useMemo, useState } from 'react'
import { View, Text, Map, Button } from '@tarojs/components'
import { getLocation } from '@tarojs/taro'
import './index.less'

type Coordinate = {
  latitude: number
  longitude: number
}

type RiskPoint = {
  id: string
  latitude: number
  longitude: number
  level: 'low' | 'medium' | 'high'
}

export default function MapPage() {
  // 当前位置（授权失败时使用默认坐标）
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null)
  // 顶部城市名（此处用 mock，可接入逆地理编码）
  const [city, setCity] = useState<string>('上海市')
  // 未来2小时内涝风险点（也可切换为热力图数据）
  const [riskPoints, setRiskPoints] = useState<RiskPoint[]>([])

  // mock 风险点数据（未来2小时）
  useEffect(() => {
    const mock: RiskPoint[] = [
      { id: 'p1', latitude: 31.2304, longitude: 121.4737, level: 'high' },
      { id: 'p2', latitude: 31.235, longitude: 121.48, level: 'medium' },
      { id: 'p3', latitude: 31.225, longitude: 121.47, level: 'low' }
    ]
    setRiskPoints(mock)
  }, [])

  // 获取当前位置（进入页面或刷新按钮）
  const locate = () => {
    getLocation({ type: 'gcj02' })
      .then((res) => {
        setCurrentLocation({ latitude: res.latitude, longitude: res.longitude })
        // TODO: 调用逆地理获取城市名，这里用 mock
        setCity('上海市')
      })
      .catch(() => {
        // 默认上海坐标（无授权时）
        setCurrentLocation({ latitude: 31.2304, longitude: 121.4737 })
        setCity('上海市')
      })
  }

  useEffect(() => {
    locate()
  }, [])

  // 将风险点映射为 markers
  const markers: any = useMemo(() => {
    return riskPoints.map((p, idx) => ({
      id: idx,
      latitude: p.latitude,
      longitude: p.longitude,
      width: 18,
      height: 18,
      iconPath:
        p.level === 'high'
          ? '/assets/marker-high.png'
          : p.level === 'medium'
          ? '/assets/marker-medium.png'
          : '/assets/marker-low.png',
      callout: {
        content: `未来2小时内涝: ${p.level}`,
        display: 'ALWAYS',
        padding: 4,
        borderRadius: 6
      }
    })) as any
  }, [riskPoints])

  return (
    <View className='page-map'>
      {/* 顶部：城市 + 刷新 */}
      <View className='topbar'>
        <Text className='city'>{city}</Text>
        <Button className='refresh-btn' onClick={locate}>刷新</Button>
      </View>

      {/* 地图占满剩余空间 */}
      <View className='map-container'>
        {currentLocation && (
          <Map
            className='map'
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
            scale={14}
            markers={markers}
            enableZoom
            enableScroll
            showCompass
            showLocation
            onError={() => {}}
          />
        )}
        {!currentLocation && <Text className='loading'>正在定位...</Text>}
      </View>
    </View>
  )
}
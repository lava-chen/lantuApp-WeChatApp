import { useEffect, useMemo, useState } from 'react'
import { View, Text, Map, Button, Image } from '@tarojs/components'
import { chooseImage, getLocation } from '@tarojs/taro'
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

export default function Index() {
  // 当前位置（授权失败时使用默认坐标）
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null)
  // 顶部城市名（此处用 mock，可接入逆地理编码）
  const [city, setCity] = useState<string>('上海市')
  // 未来2小时内涝风险点（也可切换为热力图数据）
  const [riskPoints, setRiskPoints] = useState<RiskPoint[]>([])
  // 用户上传的积水实况图片
  const [images, setImages] = useState<string[]>([])

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

  // 上传图片（本地预览 + 最多9张）
  const handleUpload = async () => {
    const res = await chooseImage({ count: 3, sizeType: ['compressed'], sourceType: ['album', 'camera'] })
    const newPaths = res.tempFilePaths || (res.tempFiles ? res.tempFiles.map(f => f.path) : [])
    setImages((prev) => [...newPaths, ...prev].slice(0, 9))
  }

  // 入口点击占位
  const onClickTravelAdvice = () => {}
  const onClickMoveCar = () => {}
  const onClickCampingAlert = () => {}
  const onRefreshCity = () => locate()

  return (
    <View className='page-index'>
      {/* 顶部：城市 + 刷新 */}
      <View className='topbar'>
        <Text className='city'>{city}</Text>
        <Button className='refresh-btn' onClick={onRefreshCity}>刷新</Button>
      </View>

      {/* 中部：三大入口卡片 */}
      <View className='cards'>
        <View className='card primary' onClick={onClickTravelAdvice}>
          <Text className='card-title'>出行建议</Text>
          <Text className='card-desc'>实时路线风险</Text>
        </View>
        <View className='card warn' onClick={onClickMoveCar}>
          <Text className='card-title'>挪车提醒</Text>
          <Text className='card-desc'>低洼区域告警</Text>
        </View>
        <View className='card safe' onClick={onClickCampingAlert}>
          <Text className='card-title'>露营安全预警</Text>
          <Text className='card-desc'>营地积水风险</Text>
        </View>
      </View>

      {/* 底部：地图占满剩余空间，展示风险点/热力图 */}
      <View className='map-section'>
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

      {/* 实况上传与预览（可收起或置底抽屉，当前简化） */}
      <View className='upload-section'>
        <View className='upload-bar'>
          <Text className='upload-title'>上传积水实况</Text>
          <Button className='upload-btn' onClick={handleUpload}>上传</Button>
        </View>
        <View className='image-grid'>
          {images.map((src, i) => (
            <View key={i} className='image-item'>
              <Image src={src} mode='aspectFill' className='image' />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

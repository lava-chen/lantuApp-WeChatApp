import { useMemo, useState } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import './index.less'

type RecordItem = {
  id: string
  time: string
  location: string
  risk: 'low' | 'medium' | 'high'
  suggestion: string
}

export default function Records() {
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const data = useMemo<RecordItem[]>(() => {
    const now = Date.now()
    return [
      {
        id: 'r1',
        time: new Date(now - 12 * 60 * 1000).toISOString(),
        location: '浦东新区 世纪公园',
        risk: 'high',
        suggestion: '请暂缓出行或绕行低洼路段'
      },
      {
        id: 'r2',
        time: new Date(now - 45 * 60 * 1000).toISOString(),
        location: '徐汇区 宜山路',
        risk: 'medium',
        suggestion: '注意观察路面积水，减速慢行'
      },
      {
        id: 'r3',
        time: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        location: '闵行区 七宝老街',
        risk: 'low',
        suggestion: '风险较低，注意雨具'
      }
    ]
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'all') return data
    return data.filter((d) => d.risk === filter)
  }, [data, filter])

  const onClickItem = (id: string) => {
    // 预留：跳转记录详情
    console.log('record id:', id)
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${day} ${hh}:${mm}`
  }

  return (
    <View className='page-records'>
      <View className='toolbar'>
        <Text className='title'>预警记录</Text>
        <View className='filters'>
          <Button className={filter === 'all' ? 'btn active' : 'btn'} onClick={() => setFilter('all')}>全部</Button>
          <Button className={filter === 'low' ? 'btn active low' : 'btn low'} onClick={() => setFilter('low')}>低</Button>
          <Button className={filter === 'medium' ? 'btn active medium' : 'btn medium'} onClick={() => setFilter('medium')}>中</Button>
          <Button className={filter === 'high' ? 'btn active high' : 'btn high'} onClick={() => setFilter('high')}>高</Button>
        </View>
      </View>

      <ScrollView className='list' scrollY>
        {filtered.map((item) => (
          <View key={item.id} className='card' onClick={() => onClickItem(item.id)}>
            <View className='card-head'>
              <Text className='loc'>{item.location}</Text>
              <Text className={`badge ${item.risk}`}>{item.risk === 'high' ? '高' : item.risk === 'medium' ? '中' : '低'}</Text>
            </View>
            <View className='card-body'>
              <Text className='time'>{formatTime(item.time)}</Text>
              <Text className='suggestion'>{item.suggestion}</Text>
            </View>
          </View>
        ))}
        {filtered.length === 0 && (
          <View className='empty'>
            <Text>暂无记录</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}



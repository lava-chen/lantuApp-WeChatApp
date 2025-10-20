import { useState } from 'react'
import { View, Text, Button, Image, Switch } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { login, logout, updateUserInfo } from '../../store/slices/userSlice'
import { wxLogin, mockWxLogin, uploadAvatar } from '../../services/api'
import type { RootState } from '../../store'
import './index.less'

export default function Mine() {
  const dispatch = useDispatch()
  const { isLoggedIn, nickname, avatar } = useSelector((state: RootState) => state.user)
  const [notifyCarMove, setNotifyCarMove] = useState(true)
  const [notifyCamping, setNotifyCamping] = useState(false)

  // 微信登录
  const handleLogin = async () => {
    try {
      Taro.showLoading({ title: '登录中...' })
      
      // 在实际环境中使用wxLogin，开发环境可使用mockWxLogin
      const isDev = process.env.NODE_ENV === 'development'
      let loginData, userProfile
      
      if (isDev) {
        // 开发环境使用mock数据
        loginData = await mockWxLogin()
        userProfile = loginData.userInfo
      } else {
        // 生产环境先获取登录凭证
        loginData = await wxLogin()
        
        // 获取用户微信头像和昵称
        const userProfileResult = await Taro.getUserProfile({
          desc: '用于完善用户资料',
          lang: 'zh_CN'
        })
        userProfile = userProfileResult.userInfo
        
        // 更新用户信息到后端
        try {
          await Taro.request({
            url: 'http://localhost:3000/user/update',
            method: 'POST',
            data: {
              nickname: userProfile.nickName,
              avatarUrl: userProfile.avatarUrl
            },
            header: {
              'Authorization': `Bearer ${Taro.getStorageSync('token')}`
            }
          })
        } catch (err) {
          console.error('更新用户信息到后端失败:', err)
        }
      }
      
      // 更新本地状态
      dispatch(login({
        openId: loginData.openId,
        unionId: loginData.unionId,
        nickname: userProfile?.nickName || userProfile?.nickname,
        avatar: userProfile?.avatarUrl || userProfile?.avatar
      }))
      
      Taro.hideLoading()
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '登录失败', icon: 'none' })
      console.error('登录失败:', error)
    }
  }

  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.removeStorageSync('token')
          dispatch(logout())
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }

  // 选择头像
  const handleChooseAvatar = (e: any) => {
    const { avatarUrl } = e.detail
    if (!avatarUrl) return
    
    Taro.showLoading({ title: '上传中...' })
    
    // 更新头像到服务器
    uploadAvatar(avatarUrl)
      .then(() => {
        // 更新本地状态
        dispatch(updateUserInfo({ avatar: avatarUrl }))
        Taro.showToast({ title: '头像更新成功', icon: 'success' })
      })
      .catch(() => {
        Taro.showToast({ title: '头像更新失败', icon: 'none' })
      })
      .finally(() => {
        Taro.hideLoading()
      })
  }


  const onClickAbout = () => {
    Taro.showModal({
      title: '关于澜图智衡',
      content: '澜图智衡 v1.0.0\n基于遥感与气象数据的城市内涝预测APP',
      showCancel: false
    })
  }

  const onClickFeedback = () => {
    Taro.navigateTo({
      url: '/pages/feedback/index'
    }).catch(() => {
      Taro.showToast({ title: '页面不存在', icon: 'none' })
    })
  }

  return (
    <View className='page-mine'>
      <View className='profile-card'>
        {isLoggedIn ? (
          <>
            <Button 
              open-type="chooseAvatar" 
              onChooseAvatar={handleChooseAvatar}
              className="avatar-btn"
            >
              <Image className='avatar' src={avatar} mode='aspectFill' />
            </Button>
            <View className='info'>
              <Text className='name'>{nickname}</Text>
              <Text className='desc'>点击头像可修改</Text>
            </View>
          </>
        ) : (
          <Button type="primary" className="login-btn" onClick={handleLogin}>
            使用微信登录
          </Button>
        )}
      </View>

      <View className='section'>
        <Text className='section-title'>通知与提醒</Text>
        <View className='cell'>
          <Text>挪车提醒</Text>
          <Switch checked={notifyCarMove} onChange={(e) => setNotifyCarMove(!!e.detail?.value)} />
        </View>
        <View className='cell'>
          <Text>露营安全预警</Text>
          <Switch checked={notifyCamping} onChange={(e) => setNotifyCamping(!!e.detail?.value)} />
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>更多</Text>
        <Button className='cell btn' onClick={onClickFeedback}>意见反馈</Button>
        <Button className='cell btn' onClick={onClickAbout}>关于澜图智衡</Button>
        {isLoggedIn && (
          <Button className='cell btn logout' onClick={handleLogout}>退出登录</Button>
        )}
      </View>


    </View>
  )
}



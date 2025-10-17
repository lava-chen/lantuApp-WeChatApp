import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { login } from './store/slices/userSlice'
import { mockWxLogin } from './services/api'

import './app.less'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    
    // 检查本地是否有token，如果有则尝试恢复登录状态
    const token = Taro.getStorageSync('token')
    if (token) {
      console.log('检测到登录状态，正在恢复...')
      
      // 在实际应用中，这里应该调用一个验证token有效性的接口
      // 为了演示，我们在开发环境下使用mock数据恢复登录状态
      const isDev = process.env.NODE_ENV === 'development'
      if (isDev) {
        // 模拟从服务器获取用户信息
        mockWxLogin().then(loginData => {
          const typedLoginData = loginData as { 
            openId: string,
            unionId: string,
            userInfo: { nickName: string, avatarUrl: string }
          };
          
          store.dispatch(login({
            openId: typedLoginData.openId,
            unionId: typedLoginData.unionId,
            nickname: typedLoginData.userInfo?.nickName,
            avatar: typedLoginData.userInfo?.avatarUrl
          }))
        }).catch(() => {
          console.log('恢复登录状态失败')
        })
      }
    }
  })

  return <><Provider store={store}>{children}</Provider></>
}

export default App



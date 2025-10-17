import axios from 'axios';
import Taro from '@tarojs/taro';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// 请求拦截器，添加token
api.interceptors.request.use(
  config => {
    const token = Taro.getStorageSync('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 微信登录相关接口
export const wxLogin = async () => {
  try {
    // 1. 获取微信登录code
    const { code } = await Taro.login();
    
    // 2. 调用后端接口换取openId和session_key
    const { data } = await api.post('/auth/wxlogin', {
      code
    });
    
    // 3. 存储token
    if (data.token) {
      Taro.setStorageSync('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('微信登录失败:', error);
    throw error;
  }
};

// 上传用户头像
export const uploadAvatar = async (tempFilePath: string) => {
  try {
    const { data } = await Taro.uploadFile({
      url: `${api.defaults.baseURL}/user/avatar`,
      filePath: tempFilePath,
      name: 'avatar',
      header: {
        'Authorization': `Bearer ${Taro.getStorageSync('token')}`
      }
    });
    return JSON.parse(data);
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

// 更新用户信息
export const updateUserInfo = async (userInfo: {
  nickname?: string;
  avatarUrl?: string;
}) => {
  try {
    const { data } = await api.post('/user/update', userInfo);
    return data;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

// 其他业务接口
export const getFloodData = () => api.get('/flood');

// 模拟登录接口（用于开发测试）
export const mockWxLogin = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        openId: 'mock_openid_' + Date.now(),
        unionId: 'mock_unionid_' + Date.now(),
        token: 'mock_token_' + Date.now(),
        userInfo: {
          nickName: '微信测试用户',
          avatarUrl: 'https://dummyimage.com/120x120/1677ff/ffffff&text=微信用户'
        }
      };
      Taro.setStorageSync('token', mockData.token);
      resolve(mockData);
    }, 500);
  });
};

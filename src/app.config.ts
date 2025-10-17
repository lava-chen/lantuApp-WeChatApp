export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/records/index',
    'pages/mine/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '澜图智衡',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#1677ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/images/home.png',
        selectedIconPath: './assets/images/home_active.png'
      },
      {
        pagePath: 'pages/records/index',
        text: '预警记录',
        iconPath: './assets/images/records.png',
        selectedIconPath: './assets/images/records_active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './assets/images/user.png',
        selectedIconPath: './assets/images/user_active.png'
      }
    ]
  }
})

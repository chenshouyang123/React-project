import React,{useEffect,useState} from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import { withRouter } from 'react-router-dom';
import {
  UserOutlined
} from '@ant-design/icons';

import axios from 'axios'

const { Sider } = Layout;
const { SubMenu } = Menu

//模拟数组结构
const  menuList = [
  {
    key:"/home",
    title:"首页",
    icon:<UserOutlined />
  },
  {
    key:"/user-manage",
    title:"用户管理",
    icon:<UserOutlined />,
    children:[
      {
        key:"/user-manage/list",
        title:"用户列表",
        icon:<UserOutlined />
      }
    ]
  },
  {
    key:"/right-manage",
    title:"权限管理",
    icon:<UserOutlined />,
    children:[
      {
        key:"/right-manage/role/list",
        title:"角色列表",
        icon:<UserOutlined />
      },
      {
        key:"/right-manage/right/list",
        title:"权限列表",
        icon:<UserOutlined />
      }
    ]
  }
]

// 根据路径取相应的图标
const iconList = {
  "/home":<UserOutlined/>,
  "/user-manage":<UserOutlined/>,
  "/user-manage/list":<UserOutlined/>,
  "/right-manage":<UserOutlined/>,
  "/right-manage/role/list":<UserOutlined/>,
  "/right-manage/right/list":<UserOutlined/>,
}

function SideMenu(props) {
  const [menu,setMenu] = useState([])
 useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
      console.log(res.data);
      setMenu(res.data)
    })
  },[])

  const checkPagePermission = item=>{
    return item.pagepermisson === 1
  }

  const renderMenu = (menuList)=> {
    return menuList.map(item=>{
      if(item.children?.length>0 && checkPagePermission(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item 
      key={item.key} 
      icon={iconList[item.key]}
      onClick={()=>{
        console.log(props);
        props.history.push(item.key)
      }}
      >{item.title}</Menu.Item>
    })
  }

// 根据路径来设置高亮效果
  const seleckeys = [props.location.pathname]
  const openkeys = ["/"+props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{display:"flex",height:"100%","flexDirection":"column"}}>

      <div className="logo" >全球新闻发布管理系统</div>
      <div style={{flex:1,"overflow":"auto"}}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={seleckeys}
      defaultOpenKeys={openkeys}>
   
   {renderMenu(menu)}
     {/* <Menu.Item key="1" icon={<UserOutlined/>}>
       首页
         </Menu.Item>
     <Menu.Item key="2" icon={<VideoCameraOutlined />}>
       nav 2
         </Menu.Item>
     <Menu.Item key="3" icon={<UploadOutlined />}>
       nav 3
         </Menu.Item>
     <SubMenu key="sub4" icon={<UploadOutlined />} title="用户管理 Three">
       <Menu.Item key="9">Option 9</Menu.Item>
       <Menu.Item key="10">Option 10</Menu.Item>
       <Menu.Item key="11">Option 11</Menu.Item>
       <Menu.Item key="12">Option 12</Menu.Item>
     </SubMenu> */}


   </Menu>
  
      </div>
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)

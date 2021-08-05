import React, { useState, useEffect,useRef } from 'react'
import { Button, Table, Modal, Switch} from 'antd'
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setdataSource] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)

    
    // 获取下拉表单角色数据
    const [roleList, setroleList] = useState([])
    // 下拉表单区域数据
    const [regionList, setregionList] = useState([])

    /* 这是用户列表里面的操作，点击弹出更新数据的操作 */
    const [isUpdateVisible,setisUpdateVisible] = useState(false)

    // 设置禁用的数据值，把值传到UserForm.js里面
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)

    // 这是保存点击更新后里面的数据
    const [current,setcurrent] = useState(null)

    const addForm = useRef(null)
    const updateForm = useRef(null)




    // 获取数据
    useEffect(() => {
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/regions").then(res => {
            const list = res.data
            setregionList(list)
        })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => {
            const list = res.data
            setroleList(list)
        })
    }, [])



    const columns = [
        {
            title: '区域',
            dataIndex: 'region',

            // 这里添加筛选框
            filters: [
               ...regionList.map(item=>(
                {
                    text:item.title,
                    value:item.value
                }
               )),
               {
                   text:"全球",
                   value:"全球"
               }
            ],
            onFilter: (value, item) => {
                if(value === "全球"){
                    return item.region === ""
                }
                return item.region === value

            },


            render: (region) => {
                return <b>{region == "" ? '全球' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default}
                onChange={()=>handleChange(item)}></Switch>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />
                    &nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} 
                    onClick={()=>handleUpdate(item)}/>
                </div>
            }
        }
    ]

 /* 这是用户列表里面的操作，点击弹出更新数据的操作 */
const handleUpdate = (item) =>{
    setTimeout(()=>{
        setisUpdateVisible(true)
        if(item.roleId === 1){
            // 禁用
            setisUpdateDisabled(true)
        }else{
            // 取消禁用
            setisUpdateDisabled(false)
        }
        // 这是可以动态的获取的表单上的值的一种方法
        updateForm.current.setFieldsValue(item)

    },0)
    // 这是先保存，获取点击更新后的数据，方便后面使用
    setcurrent(item)
}

// 这是对用户状态的操作
    const handleChange = (item) =>{
            item.roleState = !item.roleState
            setdataSource([...dataSource])
            // 对后端数据进行补丁
            axios.patch(`http://localhost:5000/users/${item.id}`,{
                roleState:item.roleState
            })
    }

    // 点击删除弹出提示框
    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }

    //删除
    const deleteMethod = (item) => {
        // console.log(item)
        // 当前页面同步状态 + 后端同步
        setdataSource(dataSource.filter(data=>data.id !== item.id))
        axios.delete(`http://localhost:5000/users/${item.id}`)

    }

    const addFormOK =() =>{
            addForm.current.validateFields().then(value=>{
                setisAddVisible(false)

                addForm.current.resetFieldValue()
                // post到后端，生成id,再设置dataSource,方便后面的删除和更新
                axios.post(`http://localhost:5000/users`,{
                    ...value,
                    "roleState":true,
                    "default":false,
                }).then(res=>{
                    console.log(res.data);
                    setdataSource([...dataSource,{
                        ...res.data,
                        role:roleList.filter(item=>item.id===value.roleId)[0]
                    }])
                })
            }).catch(err=>{
                console.log(err);
            })
        
    }

    // 这是点击更新按钮
    const updateFormOK = () =>{
        // validateFields 这是获取里面的数据的方法
        updateForm.current.validateFields().then(value => {
            console.log(value);
            setisUpdateVisible(false)
            setdataSource(dataSource.map(item=>{
                if(item.id === current.id){
                    return{
                        ...item,
                        ...value,
                        role:roleList.filter(data=>data.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setisUpdateDisabled(!isUpdateDisabled)

            // 吧数据更新到后端数据
            axios.patch(`http://localhost:5000/users/${current.id}`,value)
        })

    }

    return (
        <div>
            {/* 添加用户按钮 */}
            <Button type="primary" onClick={()=>{
                setisAddVisible(true)
            }}>添加用户</Button>

            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} rowKey={item => item.id}>

            </Table>


            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setisAddVisible(false)
                }}
                onOk={() => addFormOK()}
            >
                <UserForm ref={addForm} roleList={roleList} regionList={regionList}></UserForm>
            </Modal>
            {/* 这是用户列表里面的操作，点击弹出更新数据 */}
            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm isUpdateDisabled={isUpdateDisabled} ref={updateForm} roleList={roleList} regionList={regionList}></UserForm>
            </Modal>
        </div>
    )
}

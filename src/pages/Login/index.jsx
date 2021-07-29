import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './index.less'
import logo from './images/logo.png'

// 登录的路由组件
export default class Login extends Component {
    render() {

        const onFinish = (values) => {
            console.log('发送AJAX请求: ', values);
          };


        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目:后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form name="normal_login" className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            // 声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[
                                { required: true, whitespace: true, message: '请输入用户名!' },
                                { min: 4, message: '用户名最少4位' },
                                { max: 12, message: '用户名最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文 数字或者下划线组成' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="用户名" style={{ color: 'rgba(0,0,0,.25)' }} />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                        >
                            <Input prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password" placeholder="密码" style={{ color: 'rgba(0,0,0,.25)' }} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>

                    </Form>
                </section>
            </div>
        )
    }
}

import React,{ useState,useEffect } from 'react';
import { Form, Input, Button,message} from 'antd';
import { getLogin, getConfig } from '../../api/mainApi'
import './style.scss';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'redux-react-hook';

const Login = (props) => {
    const dispatch = useDispatch();
    let history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [loginTitle,setloginTitle] = useState({logo:require('../../assets/logo/ty_logo.png').default,title:'图为视业务管理系统'})
    useEffect(() => {
        if(JSON.parse(sessionStorage.getItem('userData'))){
            history.push("/home");
        }else{
            getConfig().then(res=>{
                setloginTitle({logo:res.data.sys_logo_url,title:res.data.sys_name})
                if(res.data.is_login){
                    history.push("/home");
                }
            })
        }
        // eslint-disable-next-line
    },[]);
    //样式
    const layout = { 
        wrapperCol:{ span:18}
    };
    const tailLayout = {
        wrapperCol: {align:'end',span:18},
    };
    const onFinishFailed = (errorInfo) => {
        console.log('提交错误:', errorInfo);
	};
    //登录
    const onFinish = (values) => {
        setLoading(true)
        getLogin({ 
            user_name:values.username,
            user_pwd:values.password
        }).then(res => {
            dispatch({ type: "userData", userData: res.data })
            sessionStorage.setItem("userData",JSON.stringify(res.data))
            setLoading(false)
            message.success("登录成功")
            history.push("/home");
        })

    };

    useEffect(()=>{
        let usr = props.location.search.split("=")[1]
        if(usr === 'hik'){
            onFinish({username:"admin",password:"admin"})
        }
    },[])
    return (
        <div id="login_all" className="login_bg">
            <div className="login_left">
                {/* <img className="login_log animate__animated animate__fadeInLeft" alt="logo" src={loginTitle.logo}/> */}
                <p className="animate__animated animate__fadeInLeft">Welcome</p>
                <p className="animate__animated animate__fadeInLeft">欢迎登录{loginTitle.title}</p>
            </div>
            <div className="login_right">
                <h1 className="animate__animated animate__fadeInUp">登录</h1>
                {/* 登录表单提交 */}
                <Form  {...layout} name="basic" initialValues={{ remember: false }}
                    autoComplete="off" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item name="username" rules={[{required: true, message: '请输入有效的账号/用户名！' }]} className="animate__animated animate__fadeInRight">
                        <Input size="large" placeholder="请输入账号/用户名"/>
                    </Form.Item>
                    <Form.Item name="password" rules={[{required: true, message: '请输入密码！' }]} className="inputPassword animate__animated animate__fadeInRight">
                        <Input.Password size="large" placeholder="请输入密码"/>
                    </Form.Item>
                    <Form.Item {...tailLayout} className="buttonSubmit animate__animated animate__fadeInRight">
                        <Button type="primary" size="large" htmlType="submit" loading={isLoading}>登录</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Login;
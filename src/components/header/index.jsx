import React, { useState, useEffect } from 'react';
import './style.scss'
import { getLogin, getConfig, layoutList,cameraList_S } from '../../api/mainApi'
import { useDispatch, useMappedState } from 'redux-react-hook';
import { Common } from '../../utils/mapMethods';
import { message } from 'antd'
import { useHistory } from "react-router-dom";
import { Model } from '../../utils/map3d';


function Header(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const mp_light = useMappedState(state => state.map3d_light);
    const top_count = useMappedState(state => state.top_navigation_count);
    const [timeNow, setTime] = useState()
    const [systemTitle, setST] = useState()
    const [titleModule, setTM] = useState([])
    const [iconShow,setIconShow] = useState(true)

    useEffect(() => {
        var filterDatas = [
            { num: "1", page: 'videoSurveillance'},
            { num: "2", page: 'faceApplication'},
            { num: "3", page: 'doorApply'},
            { num: "4", page: 'electronicPatrol'},
        ]
        if(props.pageCount){
            console.log(props.pageCount,'props.pageCountprops.pageCountprops.pageCountprops.pageCount')
            if (mp_light) {
                // Common.navigationClose(mp_light)
            }
            props.animate("animate__fadeInLeft")
            dispatch({ type: "handleTop", top_navigation_count: props.pageCount-1 });
            dispatch({ type: "handleModule", top_navigation_module: filterDatas.filter(item => item.num===props.pageCount)[0].page});
        }
    }, [props.pageCount])

    useEffect(() => {
        showtime()
        login_user()
        // eslint-disable-next-line
    }, [top_count])
    // move time
    const showtime = () => {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        if (month < 10) { month = "0" + month }
        if (day < 10) { day = "0" + day }
        if (hours < 10) { hours = "0" + hours }
        if (minutes < 10) { minutes = "0" + minutes }
        if (seconds < 10) { seconds = "0" + seconds }
        var time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        setTime(time)
        setTimeout(showtime, 1000)
    }
    // login
    const login_user = () => {
        if(JSON.parse(sessionStorage.getItem('userData'))){
            console.log("有登录记录",JSON.parse(sessionStorage.getItem('userData')))
            getConfig().then(res => {
                if (res.msg === "success") {
                    setST(res.data.sys_name)
                    get_layout_list(res.data.scenarios_id, res.data.versions_id)
                }
            })
        }else{
            getConfig().then(res => {
                if (res.msg === "success") {
                    if(res.data.is_login){
                        getLogin({ user_name: 'admin', user_pwd: 'admin' }).then(res => {
                            if (res.msg === "success") {
                                dispatch({ type: "userData", userData: res.data })
                                sessionStorage.setItem("userData",JSON.stringify(res.data))
                                console.log("没有登录记录",res.data)
                                getConfig().then(res => {
                                    if (res.msg === "success") {
                                        setST(res.data.sys_name)
                                        get_layout_list(res.data.scenarios_id, res.data.versions_id)
                                    }
                                })
                            }
                        })
                    }else{
                        // history.push("/login");
                    }
                }
            })
        }
    }
    // get header_module_list
    const get_layout_list = (sid, vid) => {
        layoutList({ scenarios_id: sid, versions_id: vid }).then(res => {
            if (res.msg === "success") {
                setTM(res.data.top_navigation)
            }
        })
    }
    // handle top
    const handle_top = (item, index) => {
        if (mp_light) {
            Common.navigationClose(mp_light)
        }
        props.animate("animate__fadeInLeft")
        dispatch({ type: "handleTop", top_navigation_count: index });
        dispatch({ type: "handleModule", top_navigation_module: item.page });
    }

    const handle_title = () => {
        Model.closeIcon(mp_light)
        if(iconShow){
            setIconShow(false)
        }else{
            cameraList_S().then(res => {
                var results = res.data;
                let shinei = []
                results.forEach(element => {
                    if (!element.indoor) {
                        shinei.push(element)
                    }
                })
                Common.add_iconModel(0, shinei, mp_light,()=>{
                    message.success('所有模型加载完毕!')
                })
            }) 
            setIconShow(true)
        }
    }

    return (
        <div className="header">
            <div className="header_line"></div>
            <div className="header_content">
                <div className="fogemt">
                    <div className="header_c_title" onClick={()=>handle_title()}>
                        <div className="title_left">
                            <h1>{systemTitle}</h1>
                            <img src={require('../../assets/header_img/title_light.png').default} alt="light_bg" />
                        </div>
                        <div className="title_right_img">
                            <img src={require('../../assets/header_img/title_point.png').default} alt="" />
                        </div>
                    </div>
                    <div className="header_title_list">
                        <ul>
                            {titleModule.map((item, index) => {
                                return (
                                    <li key={index} className={top_count === index ? "active_LI" : null} onClick={() => handle_top(item, index)}>{item.modules_name}</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="header_time_user">
                    <div className="line"></div>
                    <div className="time">
                        <span>{timeNow}</span>
                    </div>
                    <img src={require('../../assets/header_img/user.png').default} alt="user" />
                </div>
            </div>
        </div>
    )
}
export default Header;
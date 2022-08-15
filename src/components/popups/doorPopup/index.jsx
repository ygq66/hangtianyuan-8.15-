import React,{ useState,useEffect } from 'react';
import { SPCC_doControl, SPCC_DoorState } from '../../../api/mainApi';
import { message } from 'antd';
import './style.scss'

const DoorPopup = (props) => {
    const [show,setShow] = useState(false)
    const [count, setCount] = useState()
    const [dooState, setDoorState] = useState('暂无')//门禁状态
    const [handleList] = useState([
        {type:"开门",path:"km",num:1},
        {type:"关门",path:"gb",num:2},
        {type:"常开",path:"ck",num:0},
        {type:"常关",path:"door-cb",num:3}
    ])
    useEffect(()=>{
        if(props.msgdata){
            setShow(true)
            SPCC_DoorState({ doorIndexCodes: [props.msgdata.device_code] }).then(res => {
                if (res.msg === "success") {
                    let resState = res.data.authDoorList[0].doorState;
                    if (resState === 0) {
                        resState = "常开"
                    } else if (resState === 1) {
                        resState = "开门"
                    } else if (resState === 2) {
                        resState = "关门"
                    } else if (resState === 3) {
                        resState = "常闭"
                    }
                    setDoorState(resState)
                }
            })
        }

    },[props])
    const handleDoor = (data,index)=>{
        SPCC_doControl({ doorIndexCodes: [props.msgdata.device_code], controlType: data.num }).then(res => {
            if (res.msg === "success") {
                if (res.data[0].controlResultCode === 0) {
                    message.success("操作成功");
                    setCount(index)
                } else {
                    message.warning("操作失败", res.data[0]);
                }
            }
        })
    }
    return (
        <>
            {
                show?<div className={`${"animate_speed animate__animated"} ${"animate__zoomIn"}`} id="DoorPopup">
                    <div className="dp_title">
                        <div className="wenzi">
                            <span>{props.msgdata.device_name}</span>
                            <span>状态：{dooState}</span>
                        </div>
                        <img src={require('../../../assets/images/closeBtn.png').default} alt="close" onClick={()=>{setShow(false)}}/>
                    </div>
                    <div className="dp_content">
                        <ul>
                            {
                                handleList.map((item,index)=>{
                                    return(
                                        <li onClick={()=>handleDoor(item,index)} key={index}>
                                            <img src={require('../../../assets/images/'+item.path+'.png').default} alt="" className="icon"/>
                                            <span>{item.type}</span>
                                            {
                                                count === index?<img src={require('../../../assets/images/xz-s.png').default} className="point" alt=""/>:
                                                <img src={require('../../../assets/images/xzz.png').default} className="point" alt=""/>
                                            }
                                        </li>
                                    )
                                })   
                            }
                        </ul>
                    </div>
                </div>:null
            }
        </>

    )
}

export default React.memo(DoorPopup);
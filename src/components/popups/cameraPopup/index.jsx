import React,{ useState,useEffect } from 'react';
import './style.scss'

const CarmerPopup = (props) => {
    const [show,setShow] = useState(false)
    const [msgdata,setMSG] = useState({device_name:"111111",category_name:"22222222",deviceStatus:"33333333"})
    // const [c_status,setStatus] = useState("离线")
    useEffect(() => {
        if(props.msgdata){
            setShow(true)
            setMSG(props.msgdata)
            //接口获取状态
            // findResources({
            //     resourceType:"ENCODE_DEVICE",
            //     indexCode:props.msgdata.device_code
            // }).then(res => {
            //     if (res.msg === "SUCCESS") {
            //         var status=''
            //         // 0离线，1在线
            //         if(res.data.status==='1'){
            //             status="在线"
            //         }else{
            //             status="离线"
            //         }
            //         setStatus(status)
            //     }else{
            //         console.log("请求接口报错")
            //         setStatus("离线")
            //     }
            // })
        }
    },[props])
    return (
        <>
            {
                show?<div className={`${"animate_speed animate__animated"} ${"animate__zoomIn"}`} id="cameraPopup">
                    <div className="cp_title">
                        <span>设备</span>
                        <img src={require('../../../assets/images/closeBtn.png').default} alt="close" onClick={()=>{setShow(false)}}/>
                    </div>
                    <div className="cp_content">
                        <div className="titleName">
                            <p><span>设备名称:</span><span title={msgdata.device_name} className="hidden">{msgdata.device_name}</span></p>
                            {/* <p><span>设备状态：</span><span>{c_status}</span></p> */}
                        </div>
                    </div>
                </div>:null
            }
        </>
    )
}

export default React.memo(CarmerPopup);
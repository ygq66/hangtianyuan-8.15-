import React, { useState, useEffect } from 'react';
import { Select, Empty } from 'antd';
import './style.scss'
import { timeFormat } from '../../../utils/untils'
import { CaretDownOutlined } from '@ant-design/icons';
import { Model } from '../../../utils/map3d'
import { useMappedState } from 'redux-react-hook';
import { infoUpdate, cameraList_S, cameraRegion } from '../../../api/mainApi';
import { Common } from '../../../utils/mapMethods'

const { Option } = Select;
const AlarmPopup = (props) => {
    const mapDark = useMappedState(state => state.map3d_dark);
    const alarmPolygons = useMappedState(state => state.alarmMsg);
    const [threeM, setThree] = useState([])
    const [fiveM, setFive] = useState([])
    const [tenM, setTen] = useState([])
    const [fifteenM, setFifteen] = useState([])
    const [alarmEventlist, setAlist] = useState([])
    const [show, setShow] = useState(false)
    const [imgShow, setImgshow] = useState(false)
    const [problems] = useState([
        { id: 3, name: "3分钟有效报警信息" },
        { id: 5, name: "5分钟有效报警信息" },
        { id: 10, name: "10分钟有效报警信息" },
        { id: 15, name: "15分钟有效报警信息" }
    ])
    const [faceUrl, setfaceUrl] = useState({face:"",image:"",name:"",address:""})

    useEffect(() => {
        if (props.msgdata) {
            //人脸抓拍
            if(props.msgdata.event_type.id === "1644175361" || props.msgdata.event_type.id === "1644171265"){
                setfaceUrl({
                    face:props.msgdata.face.faceurl,
                    image:props.msgdata.face.imageUrl,
                    name:props.msgdata.event_type.id === "1644175361"?props.msgdata.face.name:"未知",
                    address:props.msgdata.event_info[0].device_name
                })
                setImgshow(true)
            }
            setShow(true)
            //当前报警信息
            let array = [...alarmEventlist]
            array.unshift(props.msgdata)
            setAlist(array)

            //缓存报警信息时间段
            setTimeout(() => {
                let arrayt = [...threeM]
                arrayt.unshift(props.msgdata)
                setThree(arrayt)
            }, 180000)

            setTimeout(() => {
                let arrayfiveM = [...fiveM]
                arrayfiveM.unshift(props.msgdata)
                setFive(arrayfiveM)
            }, 300000)

            setTimeout(() => {
                let arraytenM = [...tenM]
                arraytenM.unshift(props.msgdata)
                setTen(arraytenM)
            }, 600000)

            setTimeout(() => {
                let arrayff = [...fifteenM]
                arrayff.unshift(props.msgdata)
                setFifteen(arrayff)
            }, 900000)
        }
        // eslint-disable-next-line
    }, [props.msgdata])

    //选择时间段
    const handleEquipment = (value) => {
        if (value === 3) {
            setAlist(threeM)
        } else if (value === 5) {
            setAlist(fiveM)
        } else if (value === 10) {
            setAlist(tenM)
        } else if (value === 15) {
            setAlist(fifteenM)
        }
    }

    //忽略||确认
    const handleAlarm = (type, ele) => {
        infoUpdate({ id: ele.event_info[0].id, handle: type })
        let result = []
        let array = [...alarmEventlist]
        array.forEach(element => {
            if (element.event_info[0].id !== ele.event_info[0].id) {
                result.push(element)
            }
        })
        setAlist(result)

        cameraList_S({ device_code: ele.event_info[0].device_code }).then(res => {
            if (res.msg === "success") {
                let results = res.data[0]
                var pos = {
                    x: Common.filter(results.center.x) / 100,
                    y: Common.filter(results.center.y) / 100
                }
                cameraRegion({ positions: pos }).then(res => {
                    if (res.msg === "success") {
                        //清除文字和线和底座圆
                        if(res.data.length>0){
                            Model.removeGid(mapDark, "BjX_" + res.data[0].real_name)
                            Model.removeGid(mapDark, "BjZ_" + res.data[0].real_name)
                            Model.removeGid(mapDark, "BjY_" + res.data[0].real_name)
                            //清除面
                            alarmPolygons.forEach(element => {
                                if (element.gid === res.data[0].real_name) {
                                    Model.updatePolygon(mapDark, element, element.style)
                                }
                            })
                        }else{
                            Model.removeGid(mapDark, "BjX_" + results.device_code.replace(/\./g,'_'))
                            Model.removeGid(mapDark, "BjZ_" + results.device_code.replace(/\./g,'_'))
                            Model.removeGid(mapDark, "BjY_" + results.device_code.replace(/\./g,'_'))
                        }
                    }
                })
            }
        })
    }
    return (
        <>
            {
                show ? <div id="alarmPopup" className="">
                    <div className="alarmPopup_content">
                        <img className="closeImg" src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => setShow(false)} />
                        <div className="alarmPopup_select">
                            <Select
                                onChange={handleEquipment}
                                placeholder="请选择类别"
                                defaultValue="3分钟有效报警信息"
                                suffixIcon={<CaretDownOutlined />}
                                showArrow={true}
                            >
                                {
                                    problems.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <img className="line" src={require("../../../assets/images/line.png").default} alt="" />
                        <div className="alarmPopup_table">
                            <table>
                                <thead><tr><td>报警时间</td><td>报警位置</td><td>报警描述</td><td>操作</td></tr></thead>
                                <tbody>
                                    {
                                        alarmEventlist.length > 0 ? alarmEventlist.map((ele, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td title={timeFormat(ele.event_info[0].start_time)}>{timeFormat(ele.event_info[0].start_time)}</td>
                                                    <td title={ele.event_info[0].device_name}>{ele.event_info[0].device_name}</td>
                                                    <td title={ele.event_info[0].event_name}>{ele.event_info[0].event_name}</td>
                                                    <td className="button">
                                                        <div className="queren" onClick={() => handleAlarm("1", ele)}>确认</div>
                                                        <div className="hulue" onClick={() => handleAlarm("2", ele)}>忽略</div>
                                                    </td>
                                                </tr>
                                            )
                                        }) : <Empty style={{ marginTop: "60px" }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="alarmPopup_footer"></div>
                    {
                        imgShow?<div className="faceImg">
                            <img className="closeImg" src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => setImgshow(false)} />
                            <div className="titleName">位置：<span>{faceUrl.address}</span></div>
                            <div className="titleName">姓名：<span>{faceUrl.name}</span></div>
                            <div className="faceImgContent">
                                <div class="faceUrl">
                                    <span>{faceUrl.name !== "未知"?"人脸库照片":"人脸抓拍"}</span>
                                    <img src={faceUrl.face} alt=""/>
                                </div>
                                <div class="imageUrl">
                                    <span>人脸抓拍</span>
                                    <img src={faceUrl.image} alt=""/>
                                </div>
                            </div>
                        </div>:null
                    }
                </div> : null
            }
        </>
    )
}
export default AlarmPopup;
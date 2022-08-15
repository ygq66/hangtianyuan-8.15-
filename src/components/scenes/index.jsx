import React, { useState, useEffect } from 'react';
import { locationAdd,locationDelete,locationUpdate,locationList_h } from '../../api/mainApi';
import { Common } from '../../utils/mapMethods';
import { useMappedState } from 'redux-react-hook';
import { createMap } from '../../utils/map3d';
import { Input, Button, message } from 'antd';
import './style.scss';

const Scenes = (props) => {
    const mp_light = useMappedState(state => state.map3d_light);
    const [scenseList, setScenes] = useState([])
    const [animate_bottom, setAnimateb] = useState(false)
    const [locationName, setName] = useState("")
    const [locationName2, setName2] = useState("")
    useEffect(()=>{
        getScenesList()
    },[])
    //查询列表
    const getScenesList = ()=>{
        locationList_h().then(res=>{
            if(res.msg === "success"){
                setScenes(res.data)
            }
        })
    }
    //截图
    const exportVideoImg = (callback) => {
        var video = document.querySelector('#streamingVideo');
        video.crossorigin = 'anonymous'
        var canvas = document.getElementById('VideCanvas');
        var cobj = canvas.getContext('2d'); //获取绘图环境
        cobj.drawImage(video, 0, 0, 200, 300);
        let base64 = canvas.toDataURL('image/jpeg', 0.5)
        if (callback) {
            callback(base64);
        }
    }
    //添加||修改
    const scenes_AddorUpdate = (handleWhat,data)=>{
        new Promise(resolve => {
            createMap.getCurrent(mp_light,msg => {
                resolve(msg)
            })
        }).then(val => {
            return new Promise(resolve => {
                exportVideoImg(res => {
                    resolve({ positions: val, pic: res })
                })
            })
        }).then(item => {
            if(handleWhat){
                if(locationName !== ""){
                    locationAdd({ location_name: locationName, pic: item.pic, positions: JSON.parse(item.positions) }).then(res => {
                        message.success("保存成功");
                        setName("")
                        getScenesList()
                    })
                }else{
                    message.warning("请输入位置名称")
                }
            }else{
                locationUpdate({ id: data.id, location_name: locationName2 || data.location_name, pic: item.pic, positions: JSON.parse(item.positions) }).then(res => {
                    message.success("修改成功");
                    getScenesList()
                })
            }
        })
    }
    //删除
    const scenesDelete = (data)=>{
        locationDelete({ id:data.id }).then(res => {
            message.success("删除成功");
            getScenesList()
        })
    }
    return (
        <div id="scenes" className={`${"animate_speed animate__animated"} ${"animate__fadeInUp"}`}>
            <div className="scenes_title">
                <h2>场景</h2>
                <img src={require('../../assets/images/cha.png').default} alt="" onClick={() => { props.close(false) }} />
            </div>
            <div className="scenes_content">
                <ul>
                    {scenseList.map((item, index) => {
                        return (
                            <li key={index}>
                                <img src={item.pic} alt="" />
                                <span className="scenesName">{item.location_name}</span>
                                <div className="do_somethig">
                                    <div className="name">
                                        <span>当前名称：</span>
                                        <Input placeholder="" size="small" defaultValue={item.location_name} onChange={(e) =>setName2(e.target.value)}/>
                                    </div>
                                    <div className="buttons">
                                        <Button type="primary" size="small" onClick={()=> Common.mapFly(mp_light,{center:{
                                            x:item.positions.x,
                                            y:item.positions.y,
                                            z:item.positions.z,
                                            pitch:item.positions.pitch,
                                            yaw:item.positions.yaw,
                                            roll:item.positions.roll
                                        }})}>定位</Button>
                                        <Button type="primary" size="small" onClick={()=>scenes_AddorUpdate(false,item)}>修改</Button>
                                        <Button type="primary" size="small" onClick={()=>scenesDelete(item)}>删除</Button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                    <li className="add_scenes">
                        {
                            !animate_bottom?<div className="handleAdd"  onClick={()=>setAnimateb(true)}>
                                <img src={require('../../assets/images/add.png').default} alt="" />
                                <span>添加位置</span>
                            </div>:null
                        }
                        <div className="add_somethig" style={{top:`${animate_bottom?"0":"-100%"}`}}>
                            <div className="name">
                                <span>名称：</span>
                                <Input placeholder="" size="small" value={locationName} onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className="buttons">
                                <Button type="primary" size="small" onClick={()=>scenes_AddorUpdate(true)}>保存</Button>
                                <Button type="primary" size="small" onClick={()=>setAnimateb(false)}>取消</Button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <canvas id="VideCanvas" width="180" height="150" backgroundcolor='#ccc' style={{ display: "none" }}></canvas>
        </div>
    )
}

export default Scenes;
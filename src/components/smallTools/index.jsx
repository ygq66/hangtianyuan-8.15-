import React, { useState, useCallback } from 'react';
import { Common } from '../../utils/mapMethods';
import { useMappedState } from 'redux-react-hook';
import { roamflyList, buildList } from '../../api/mainApi';
import { Event, Build } from '../../utils/map3d'
import { message } from 'antd';
import './style.scss'
import Scenes from '../scenes' //场景

const SmallTools = () => {
    const [isRoam, setRoam] = useState(false)
    const [isScenes, setScenes] = useState(false);//图层是否显示
    const [isLayer, setLayer] = useState(false);//图层是否显示
    const [buildingList, setBuild] = useState([]);//所有建筑列表
    const [showBuild, setShowBuild] = useState(new Set());//存储当前炸裂状态下的建筑id
    const iconList = [{ icon: "fuwei", name: "复位" }, { icon: "changjing", name: "场景" }, { icon: "zhibeizhen", name: "指北" }, { icon: "roam", name: "漫游" }, { icon: "tuceng", name: "图层" }]
    const [roamList, setRoamList] = useState([])
    const [count, setCount] = useState()
    const [count2, setCount2] = useState()
    const [show, setShow] = useState(false)
    const mp_light = useMappedState(state => state.map3d_light);
    const mp_dark = useMappedState(state => state.map3d_dark);
    const [isOver, setOver] = useState(true)

    //获取漫游列表
    const getRoamList = () => {
        roamflyList().then(res => {
            if (res.msg === "success") {
                setRoamList(res.data)
            }
        })
    }
    const handleTool = useCallback((index) => {
        switch (index) {
            case 0:
                if (!(Object.keys(mp_dark).length === 0)) {
                    Common.initializationPosition(mp_dark)
                }
                if (!(Object.keys(mp_light).length === 0)) {
                    Common.initializationPosition(mp_light)
                }
                break;
            case 1:
                setScenes(true)
                setLayer(false);
                setRoam(false)
                break;
            case 3:
                setScenes(false)
                setLayer(false);
                getRoamList()
                setRoam(true)
                break;
            case 4:
                setScenes(false)
                setRoam(false);
                getBuilding();
                setLayer(true);
                break;
            default:
                console.log(iconList[index].name)
        }
        //eslint-disable-next-line
    }, [mp_light, mp_dark])

    const roamLine = (type, item, index) => {
        setOver(false)
        if (isOver || count2 === index) {
            let ndatas = item.postions.points
            if (type === "stop") {
                setCount(index)
                Event.pausePatrolPath(mp_light)
            } else if (type === "Go_on") {
                setCount()
                Event.continuePatrolPath(mp_light)
            } else if (type === "start") {
                setCount()
                setCount2(index)
                let trajectory = []
                ndatas.forEach(element => {
                    trajectory.push({
                        id: item.id,
                        x: element.x,
                        y: element.y,
                        z: element.z,
                        floor: "F1"
                    })
                });
                let goTrajectory = {
                    "visible": false,
                    "style": "sim_arraw_Cyan",
                    "width": 200,
                    "speed": 35,
                    "geom": trajectory
                }
                Event.createRoute(mp_light, goTrajectory, false)
                Event.playPatrolPath(mp_light, msg => {
                    if (msg.x === trajectory[trajectory.length - 1].x) {
                        console.log("巡逻结束")
                        setOver(true)
                        setCount()
                        setCount2()
                        Event.clearPatrolPath(mp_light);
                    }
                })
            } else if (type === "end") {
                if (count2 === index) { setOver(true) }
                setCount()
                setCount2()
                Event.clearPatrolPath(mp_light)
                Common.initializationPosition(mp_light)
            }
        } else {
            if (type === "end" && count2 === index) {
                setOver(true)
            } else {
                message.warning("请先结束当前漫游路线");
            }
        }
    }
    // 获取所有建筑信息
    const getBuilding = () => {
        buildList().then(res => {
            setBuild(res.data);
        })
    }
    //关闭漫游列表
    const closeRoam = () => {
        setOver(true)
        setCount()
        setCount2()
        Event.clearPatrolPath(mp_light);
        Common.initializationPosition(mp_light);
    }
    // 爆炸分离
    const SplitBuild = (buildId) => {
        showBuild.add(buildId);
        setShowBuild(new Set(showBuild));
        Build.splitBuild(mp_light, buildId, 5);
    }
    // 分离恢复
    const SplitBuildReset = (buildId) => {
        showBuild.delete(buildId);
        setShowBuild(new Set(showBuild));
        Build.splitBuildReset(mp_light, buildId);
    }

    return (
        <div id="smallTools">
            {
                show ? <div className={`${"st_iconlist animate_speed animate__animated"} ${"animate__slideInRight"}`}>
                    <div className="iconTools">
                        <ul>
                            {iconList.map((item, index) => {
                                return (
                                    <li key={index} onClick={() => handleTool(index)}>
                                        <img className="img_active" src={require('../../assets/images/' + item.icon + '.png').default} alt="icon" />
                                        <span>{item.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {
                        isRoam ? <div className="roam animate_speed animate__animated animate__fadeIn">
                            <div className="roamTitle">
                                <h2>漫游</h2>
                                <img src={require('../../assets/images/cha.png').default} alt="" onClick={() => { closeRoam(); setRoam(false) }} />
                            </div>
                            <ul>
                                {roamList.map((item, index) => {
                                    return (
                                        <li key={index} className={count2 === index ? "active" : ""}>
                                            <span>{item.roam_name}</span>
                                            <div className="doSomething">
                                                <img src={require('../../assets/images/roamStart.png').default} alt="" onClick={() => roamLine("start", item, index)} />
                                                {
                                                    index === count ? <img src={require('../../assets/images/roamGo_on.png').default} alt="" onClick={() => roamLine("Go_on", item, index)} />
                                                        : <img src={require('../../assets/images/roamStop.png').default} alt="" onClick={() => roamLine("stop", item, index)} />
                                                }
                                                <img src={require('../../assets/images/roamEnd.png').default} alt="" onClick={() => roamLine("end", item, index)} />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div> : null
                    }
                    {
                        isLayer ? <div className="roam animate_speed animate__animated animate__fadeIn">
                            <div className="roamTitle">
                                <h2>图层</h2>
                                <img src={require('../../assets/images/cha.png').default} alt="" onClick={() => { setLayer(false) }} />
                            </div>
                            <ul>
                                {buildingList.map((item, index) => {
                                    return (
                                        <li key={index} className={count2 === index ? "active" : ""}>
                                            <span>{item.build_name}</span>
                                            <div className="doSomething">
                                                <span style={{ color: showBuild.has(item.build_id) ? "red" : "" }} onClick={() => { SplitBuild(item.build_id) }}>分离</span>
                                                <span onClick={() => { SplitBuildReset(item.build_id) }}>恢复</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div> : null
                    }
                    {
                        isScenes?<div className="scenes_tool">
                            <Scenes close={setScenes}/>
                        </div>: null
                    }
                </div> : null
            }
            <div className="st_button" onClick={() => setShow(!show)}>
                <img src={require('../../assets/images/gongju-icon.png').default} alt="icon" />
                <span>小工具</span>
            </div>
        </div>
    )
}

export default SmallTools;
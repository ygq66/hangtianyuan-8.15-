import React, { useState, useEffect } from 'react';
import { Tree, Input, Button, Spin } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { regionList, cameraList_S, labelList, traceDrag,SPCC_GetvideoStream } from '../../../api/mainApi';
import { Common } from '../../../utils/mapMethods';
import { videoPlay } from '../../../utils/untils'
import { useMappedState, useDispatch} from 'redux-react-hook';
import { createMap, Model, Build } from '../../../utils/map3d'
import { message } from 'antd';
import './style.scss';

const { DirectoryTree } = Tree;

const VideoSurveillance = (props) => {
    const dispatch = useDispatch();
    const mp_light = useMappedState(state => state.map3d_light);
    const [carmealist, setlist] = useState([]);
    const [Dotlinelist, setlinelist] = useState([]);
    const [spinning, setSpinning] = useState(true)
    const [allPolygonObj, setapj] = useState([])
    const [isPolygon, setPolygon] = useState(true)
    const [isPoint, setDrowPoint] = useState(true)
    const [isLine, setLine] = useState(true)
    const [fenceng, setSF] = useState({build_id:"",allfloor:""})
    //Compiled with warnings
    useEffect(() => {
        regionList({ category_id: "10001",onmap:true}).then(res => {
            if (res.msg === "success") {
                let listarry = []
                antdTree(res.data, listarry)
                setlist(res.data)//视频列表
                setSpinning(false)
                if(res.data[0].children && res.data[0].children.length>0){
                    setExpandedKeys([res.data[0].key, res.data[0].children[0].key])//默认展开
                }
            }
        })
        return() =>{
            closePolygon()
        }
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    const getToTal = (arr) => {
        let num = 0;
        arr.forEach(element => {
            if (element.children) {
                num += getToTal(element.children)
                getToTal(element.children)
            } else {
                num += 1;
            }
        });
        return num;
    }

    //获取点线追踪数据的接口
    const getDragList = (type,center) => {
        traceDrag({ type: type, positions: center }).then(res => {
            if (res.msg === "success") {
                let allList = JSON.parse(JSON.stringify(Dotlinelist))
                if(type === "point"){
                    allList.push({name:"点追踪",children:res.data})
                }else{
                    allList.push({name:"线追踪",children:res.data})
                }
                console.log(allList,'真几把服了')
                setlinelist(allList)
            }
        })
    }

    //关闭点绘画
    const closePoint = () =>{
        Model.endEditing(mp_light);
        Model.closeCircle(mp_light);
        setDrowPoint(true)
    }

    function Dotlineselect(ort) {
        switch (ort) {
            case 1:
                createMap.getMousePosition(mp_light,msg=>{
                    const position = { ...msg, z: Number(msg.z) + 50 }
                    console.log(position,'回调得到得')
                    getDragList("point",[position])
                    closePoint()
                })
                setDrowPoint(!isPoint)
                if(!isPoint){closePoint()}
                break;
            case 2:
                setLine(false)
                closePoint()
                Model.drawLine(mp_light,msg=> {
                    getDragList("linestring",msg.points)
                    Model.endEditing(mp_light);
                    Model.closeLine(mp_light);
                    setLine(true)
                })
                break;
            case 3:
                closePoint()
                if (isPolygon) {
                    Common.initializationPosition(mp_light)
                    cameraList_S({ device_code: "" }).then(res => {
                        if (res.msg === "success") {
                            let neendObj = []
                            res.data.forEach(element => {
                                if (!(JSON.stringify(element.position) === "{}") && !(element.position === null) && element.position.points !== null) {
                                    Model.createPolygon(mp_light, element.position.points, ((msg) => {
                                        neendObj.push(JSON.parse(msg))
                                    }))
                                }
                            });
                            setapj(neendObj)
                        }
                    })
                    setPolygon(false)
                } else {
                    closePolygon()
                    setPolygon(true)
                }
                break;
            default:
                break;
        }
    }

    //antd树菜单
    function antdTree(list, objstr) {
        if (Array.isArray(list) && list.length > 0) {
            list.forEach(function (v, i) {
                objstr[i] = {};
                objstr[i].title = v.title;
                objstr[i].key = v.id;
                let arr = [];
                antdTree(v.children, arr)
                objstr[i].children = arr;
            });
        }
    }
    function dotLineclose() {
        // eslint-disable-next-line
        setlinelist(new Array())
    }
    //显示单摄像头的区域
    const showArea = (data)=>{
        closePolygon()
        if (!(JSON.stringify(data.position) === "{}") && !(data.position === null) && data.position.points !== null) {
            Model.createPolygon(mp_light, data.position.points, ((msg) => {
                const gid_areaList = [...allPolygonObj]
                gid_areaList.push(JSON.parse(msg))
                setapj(gid_areaList)
            }))
        }
    }
    const onSelect = (selectedKeys, info) => {
        if (!info.node.children) {
            Model.clearHighlight(mp_light)
            Model.modelHighlight(mp_light,info.node.title.props.item.model_id)
            if (info.node.title.props.item.detail_info) {
                SPCC_GetvideoStream({ 
                    cameraIndexCode: info.node.title.props.item.device_code,
                    streamType:0,
                    protocol:"wss"
                }).then(res => {
                    if (res.msg === "success") {
                        dispatch({ type: "checkVideoUrl", video_url: res.data.url });
                    }
                })
            } else {
                message.warning("缺少_detail_info");
            }
            cameraList_S({ device_code: info.node.title.props.item.device_code }).then(res => {
                if (res.msg === "success") {
                    if (res.data.length > 0) {
                        var results = res.data[0]
                        console.log(results)
                        //飞行
                        Common.mapFly(mp_light, results)
                        if(fenceng.build_id !== "" && fenceng.allfloor !== ""){
                            Build.showFloor(mp_light, fenceng.build_id, "all", fenceng.allfloor)
                        }
                        showArea(results)
                        //分层
                        if (results.build_id) {
                            labelList({ build_id: results.build_id }).then(res2 => {
                                if (res2.msg === "success") {
                                    let floorList_s = res2.data[0].floor_name;
                                    let nfloor = [];
                                    floorList_s.forEach(element => {
                                        nfloor.push(element.floor_id.split("#")[1])
                                    });
                                    setSF({build_id:results.build_id,allfloor:nfloor})
                                    Build.showFloor(mp_light, results.build_id, results.floor_id.split("#")[1], nfloor)

                                    //弹出楼层列表
                                    let messageData = {
                                        switchName: 'buildLable',
                                        SPJK: false,
                                        Personnel: results.build_id,
                                        index: Number(results.floor_id.charAt(results.floor_id.length - 1)),
                                        floor_id:results.floor_id
                                    }
                                    window.parent.postMessage(messageData, '*')
                                }
                            })
                        }

                    } else {
                        message.warning("暂未上图");
                    }
                }
            })
        }
    }
    //删除可视区域面
    const closePolygon = () => {
        allPolygonObj.forEach(element => {
            Model.removeGid(mp_light, element.gid)
        });
    }

    //树结构搜索格式化
    const dataList = [];
    const generateList = data => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key, title } = node;
            dataList.push({ key, title: title });
            if (node.children) {
                generateList(node.children);
            }
        }
    };
    generateList(carmealist);

    //递归1
    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    const [expandedKeys, setExpandedKeys] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [autoExpandParent, setAutoExpandParent] = useState(true)

    const onExpand = expandedKeys => {
        setExpandedKeys(expandedKeys)
        setAutoExpandParent(false)
    };

    const OnSearch = (e) => {

        var nvalue = e.target.value
        const expandedKeysd = dataList.map(item => {
            if (item.title.indexOf(nvalue) > -1) {
                return getParentKey(item.key, carmealist);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        setExpandedKeys(expandedKeysd)
        setSearchValue(nvalue)
        setAutoExpandParent(true)
    }
    const loop = data => data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
            index > -1 ? (
                <span item={item}>
                    {beforeStr}
                    <span className="site-tree-search-value">{searchValue}</span>
                    {
                        item.children ? <span>{afterStr}<span style={{ color: "yellow" }}>&nbsp;(总数：{getToTal(item.children)})</span></span> : <span>{afterStr}</span>
                    }
                </span>
            ) : (
                <span>
                    {
                        item.children ? <span>{item.title}<span style={{ color: "yellow" }}>&nbsp;(总数：{getToTal(item.children)})</span></span> : <span>{item.title}</span>
                    }
                </span>
            );
        if (item.children) {
            return { title, key: item.key, children: loop(item.children) };
        }
        return { title, key: item.key };
    });

    //关闭这个页面
    const closeVideoSur = () =>{
        props.close();
        closePolygon(); 
        Build.allShow(mp_light, true);
        Model.clearHighlight(mp_light)
    }
    return (
        <div id="VideoSurveillance" className="VideoSurveillance">
            <div className="VideoSurveillance_top">
                <h1>视频列表</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() =>closeVideoSur()} />
            </div>
            <div className="VideoSurveillance_list">
                <div className="VideoSurveillance_title">
                    <span className={isPoint ? null : "span_active"} onClick={() => Dotlineselect(1)}>点查</span>
                    <span className={isLine ? null : "span_active"} onClick={() => Dotlineselect(2)}>线查</span>
                    <span className={isPolygon ? null : "span_active"} onClick={() => { Dotlineselect(3) }}>可视区域</span>
                </div>
                <div className="Treelist">
                    <p>视频列表 </p>
                    <Input placeholder="输入名称" className="Basic-txt" onChange={(e) => OnSearch(e)} /><Button icon={<SearchOutlined />} ></Button>
                    <div className="treeDiv">
                        <Spin spinning={spinning} tip="加载中...">
                            {
                                carmealist.length > 0 ? <DirectoryTree
                                    className="carmeTree"
                                    showLine={{ showLeafIcon: false }}
                                    showIcon={false}
                                    switcherIcon={<DownOutlined />}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    onSelect={onSelect}
                                    onExpand={onExpand}
                                    treeData={loop(carmealist)}
                                >
                                </DirectoryTree> : null
                            }
                        </Spin>
                    </div>
                </div>
            </div>

            {
            Dotlinelist.length>0 ?
                <div className="Dotline">
                    <div className="Dotline-tit"><span>追查过程</span><img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => dotLineclose()}></img></div>
                    {
                        Dotlinelist.map((item, index) => {
                            return (
                                <div className="Dotline-Nr">
                                    <p><span className="Dotline-Nr-tit">{index+1}.{item.name}</span></p>
                                    <div className="allpath">
                                        {
                                            item.children.map((str, key) => {
                                                return (
                                                    key++, <span>({key})  :&nbsp;&nbsp;&nbsp;{str.device_name}</span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                    {/* <div className="Dotline-exp">导出报告</div> */}
                </div> : null
            }
        </div>
    )

}
export default VideoSurveillance;
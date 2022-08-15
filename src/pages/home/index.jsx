import React, { useState, useEffect, useLayoutEffect, Suspense, lazy, Fragment, useRef, useCallback } from 'react';
import './style.scss'
import Header from '../../components/header'
import MapLight from '../../components/map_light'
import MapDark from '../../components/map_dark'
import { Model, createMap } from '../../utils/map3d'
import { useMappedState, useDispatch } from 'redux-react-hook';
import Site from '../../components/site' //数字化工具
import SmallTools from '../../components/smallTools' //小工具
import Alarm from '../../components/alarmTotal' //报警
import FloorList from '../../components/floorList' //楼层
import AlarmPopup from '../../components/popups/alarmPopup' //报警气泡
import InterphonePopup from '../../components/popups/interphonePopup' //对讲气泡
import Reflv from '../../components/reflv'
import VideoWss from '../../components/videoWss'
import Player from '../../components/videoRtsp'


import CameraPopup from '../../components/popups/cameraPopup' //摄像头气泡
import DoorPopup from '../../components/popups/doorPopup' //摄像头气泡
import BedDetails from '../../components/bedDetails' //床位列表
import { cameraList_S, cameraRegion, getConfig_L, SPCC_GetvideoStream } from '../../api/mainApi'
import { ASocekt as alarmS } from '../../api/address';
import { videoPlay } from '../../utils/untils'
import { Common } from '../../utils/mapMethods'
import { message, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { videodurl as videoDonwload_url } from '../../api/address';


function Home(props) {
  const ws = useRef(null);
  const timerRef = useRef(null);//动画延迟计时器
  const siteRef = useRef(null);
  const mapDark = useRef(null)//黑暗地图延迟加载的问题
  const MapLight_M = useRef(null)//黑暗地图延迟加载的问题
  const liandong = useRef(null)//联动立即执行问题
  const dispatch = useDispatch();
  const top_module = useMappedState(state => state.top_navigation_module);
  const mp_light = useMappedState(state => state.map3d_light);
  const mp_dark = useMappedState(state => state.map3d_dark);
  const videoShow = useMappedState(state => state.isVideo);
  const [ContentPage, setContentPage] = useState("div");//模块组件容器
  const [m_data, setData] = useState();//给子元素传值
  // eslint-disable-next-line
  const [c_data, setDataC] = useState();//摄像气泡传值
  // eslint-disable-next-line
  const [b_data, setDataB] = useState();//床位传值
  const [d_data, setDataD] = useState();//门禁传值
  const [dark, setDark] = useState(false)//切换场景
  const [dark_width, setDw] = useState("50%")//切换场景
  const [darkall, setDa] = useState(false)
  const [readyState, setReadyState] = useState('alarm_socket loading...');
  const [linkage, setLinkage] = useState(false)
  const [alarmData, setAlarmdata] = useState()
  const [animateName, setAnimateName] = useState("animate__fadeInLeft")
  const isSame = useRef(null) //防止重复点击
  const isSame2 = useRef(null) //防止重复点击
  const isSame3 = useRef(null) //防止重复点击
  const [pageCount, setPageCount] = useState()
  const [videohls,setvideohls] = useState()
  const openNotification = () => {
    notification.open({
      message: '温馨提示',
      description: <div><span>视频控件是否打开如未下载请点击<a href={videoDonwload_url}>控件</a>下载...</span></div>,
      icon: <SmileOutlined style={{ color: '#faad14' }} />,
      duration: 0,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };
  //监听窗口事件
  useEffect(() => {
    // window.addEventListener('beforeunload', function () {
    //     Model.closeIcon(mp_light)
    //     Build.allShow(mp_light, true)
    // });
    if (videoShow !== "") { openNotification() }
    // eslint-disable-next-line
  }, [videoShow]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [top_module])
  // 报警联动
  const webSocketInit = useCallback(() => {
    console.log('%c 报警socketReadyState:', "color: blue;font-size:13px", readyState)
    const stateArr = ['正在连接中', '已经连接并且可以通讯', '连接正在关闭', '连接已关闭或者没有连接成功'];
    var beforeMsg = []
    if (!ws.current || ws.current.readyState === 3) {
      ws.current = new WebSocket(alarmS)
      ws.current.onopen = _e => {
        ws.current?.send("subscribe")
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      }
      ws.current.onclose = _e =>
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onerror = e =>
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onmessage = e => {
        console.log(e, '报警收到的信息（非首次')
        if (e.data.length > 10) {
          setAlarmdata(JSON.parse(e.data))
          setDark(true)
          siteRef.current.open(2, 'parents')
          //报警~弹视频控件
          videoPlay(JSON.parse(e.data).event_info[0], 'LinkAlarm')
          //延迟地图方法
          setTimeout(() => {
            cameraList_S({ device_code: JSON.parse(e.data).device_info.device_code }).then(res => {
              if (res.msg === "success") {
                if (res.data.length > 0) {
                  var results = res.data[0]
                  var pos = {
                    x: Common.filter(results.center.x) / 100,
                    y: Common.filter(results.center.y) / 100
                  }
                  cameraRegion({ positions: pos }).then(res => {
                    if (res.msg === "success") {
                      if (liandong.current) {
                        /** 报警定位废弃
                         *  Common.mapFly(mapDark.current,results)
                         *  Common.mapFly(MapLight_M.current,results)
                         */
                      } else {
                        if (res.data.length > 0) {
                          //报警闪闪
                          createMap.findObjectById(mapDark.current, res.data[0].real_name, msg => {
                            const usebeforeMsg = { ...msg }
                            Model.updatePolygon(mapDark.current, msg, "SplineOrangeHighlight1")
                            beforeMsg.push(usebeforeMsg)
                            dispatch({ type: "alarmMsg", alarmMsg: beforeMsg });
                          })
                          //加线和文字
                          setTimeout(() => {
                            var points = results.list_style ? results.list_style : results.center
                            var points2 = {
                              x: Common.filter(points.x),
                              y: Common.filter(points.y),
                              z: Common.filter(points.z),
                              pitch: Common.filter(points.pitch),
                              yaw: Common.filter(points.yaw),
                              roll: Common.filter(points.roll)
                            }
                            Model.createLineBj(mapDark.current, res.data[0].real_name, points2, JSON.parse(e.data).device_info.device_name, 400, "#cef810")
                          }, 300)
                        } else {
                          message.warning("此次报警无坐标值_cameraRegion");
                          setTimeout(() => {
                            var points = results.list_style ? results.list_style : results.center
                            var points2 = {
                              x: Common.filter(points.x),
                              y: Common.filter(points.y),
                              z: Common.filter(points.z),
                              pitch: Common.filter(points.pitch),
                              yaw: Common.filter(points.yaw),
                              roll: Common.filter(points.roll)
                            }
                            Model.createLineBj(mapDark.current, results.device_code.replace(/\./g, '_'), points2, JSON.parse(e.data).device_info.device_name, 400, "#cef810")
                          }, 300)
                        }
                      }
                    }
                  })
                } else {
                  message.warning("此次报警无坐标值");
                }
              }
            })
          }, 800)
        } else {
          console.log(e.data, '报警socket进行了首次连接')
        }
      };
    }
    // eslint-disable-next-line
  }, [ws, readyState, linkage]);
  // 关闭模块
  const closePage = () => {
    setAnimateName("animate__fadeOutLeft")
    dispatch({ type: "handleTop", top_navigation_count: "" });
    timerRef.current = setTimeout(() => {
      dispatch({ type: "handleModule", top_navigation_module: "" });
    }, 500);
  }
  // 监听点击模型
  const getModel_s = (map3d) => {
    if (map3d) {
      window.receiveMessageFromIndex = function (e) {
        if (e !== undefined) {
          switch (e.data.switchName) {
            case 'image':
              SPCC_GetvideoStream({
                cameraIndexCode: e.data.Personnel.attr.device_code,
                streamType: 0,
                protocol: "wss"
              }).then(res => {
                if (res.msg === "success") {
                  dispatch({ type: "checkVideoUrl", video_url: res.data.url });
                }
              })
              break;
            case 'model':
              console.log("点击了模型");
              Model.clearHighlight(mp_light)
              let msg = e.data.Personnel
              if (isSame.current !== msg) {
                isSame.current = msg
                //点击对讲模型
                if (msg.attr.type_name === "对讲") {
                  setData(msg.attr)
                } else if (msg.attr.type_name === "门禁") {
                  setDataD(msg.attr)
                } else {
                  //弹出视频控件
                  if (msg.attr.device_code) {
                    Model.modelHighlight(mp_light, msg.attr.model_url)
                    SPCC_GetvideoStream({
                      cameraIndexCode: msg.attr.device_code,
                      streamType: 0,
                      protocol: "wss"
                    }).then(res => {
                      if (res.msg == "success") {
                        dispatch({type: "checkVideoUrl", video_url: res.data.url});
                      }

                    })
                    // videoPlay(msg.attr, "playVideo", ((msg) => {
                    //   let timestamp = Date.parse(new Date()) + "video";
                    //   dispatch({ type: "checkVideo", isVideo: timestamp });
                    // }))
                  }
                  else {
                    message.warning("暂无视频编码");
                  }
                  //视频状态
                  // setDataC(msg.attr)
                }
              }
              break;
            case 'ImagePC':
              let iconMsg = e.data.Personnel;
              if (isSame2.current !== iconMsg) {
                isSame2.current = iconMsg
                // if(iconMsg.attr.category_name === "摄像头"){
                //     if (iconMsg.attr.detail_info) {
                //         videoPlay(iconMsg.attr,"playVideo",((msg)=>{
                //             let timestamp = Date.parse(new Date())+"video";
                //             dispatch({ type: "checkVideo", isVideo: timestamp });
                //         }))
                //     } else {
                //         message.warning("暂无视频编码");
                //     }
                // }   
              }
              break;
            case 'polygon':
              let labelMsg = e.data.Personnel;
              if (isSame3.current !== labelMsg) {
                isSame3.current = labelMsg
                setDataB(labelMsg)
              }
              break;
            default:
              return null;
          }
        }
        return;
      }
      //监听message事件
      window.addEventListener("message", window.receiveMessageFromIndex, false);
    }
  }
  // 切换模块
  useLayoutEffect(() => {
    if (top_module !== "") {
      setContentPage(lazy(() => import(`../../components/module/${top_module}`)))

    }
  }, [top_module])

  useEffect(() => {
    setTimeout(() => {
      if (!(Object.keys(mp_light).length === 0)) {
        getModel_s(mp_light)
        MapLight_M.current = mp_light;
      }
      if (!(Object.keys(mp_dark).length === 0)) {
        mapDark.current = mp_dark;
        liandong.current = linkage;
      } else {
        // webSocketInit()
      }
    }, 1000)
    // eslint-disable-next-line
  }, [mp_light, mp_dark, webSocketInit, linkage])

  // 获取地图url配置
  const getMapURL = () => {
    getConfig_L().then(res => {
      if (res.msg === "success") {
        let configMap = res.data[0]
        console.log('接口获取地图url配置:', configMap)
        dispatch({ type: "mp_light_url", mapLight_url: configMap.map_database_url });
        dispatch({ type: "mp_dark_url", mapDark_url: configMap.digit_model_url });
      }
    })
  }
  useEffect(() => {
    getMapURL()
    setPageCount(props.location.search.split("=")[1])
    // eslint-disable-next-line
  }, [])
  return (
    <div className="home">
      <Header animate={setAnimateName} pageCount={pageCount} />
      <div className="conent">
        {
          dark ? <div className="map">
            {
              darkall ? <MapDark setWidth={dark_width} /> :
                <Fragment>
                  <MapLight setWidth="50%" />
                  <MapDark setWidth={dark_width} />
                </Fragment>
            }
          </div> : <div className="map"><MapLight setWidth="100%" /></div>
        }
        {top_module !== "" && <Suspense fallback={<div>"loading"</div>}>
          <div className={`${"popup animate_speed animate__animated"} ${animateName}`}>
            <ContentPage close={closePage} />
          </div>
        </Suspense>}
        <div className="untils_site">
          <Site ctrlcheck={setDark} ctrlwidth={setDw} ctrlall={setDa} ref={siteRef} stl={setLinkage} />
        </div>
        <div className="untils_sTools">
          <SmallTools />
        </div>
        {/* <div className="untils_alarm">
          <Alarm />
        </div> */}
        <div className="untils_floor">
          <FloorList />
        </div>
        <div className="untils_alarm2">
          <AlarmPopup msgdata={alarmData} />
        </div>
        <div className="untils_interPhone">
          <InterphonePopup msgdata={m_data} />
        </div>
        <div className="untils_cameraPopup">
          <CameraPopup msgdata={c_data} />
        </div>
        <div className="untils_bedDetails">
          <BedDetails msgdata={b_data} />
        </div>
        <div className="untils_doorPopup">
          <DoorPopup msgdata={d_data} />
        </div>
        <div className='untils_video'>
          <VideoWss />
        </div>

      </div>
    </div>
  )
}

export default Home;
import React, {useState, useEffect, useRef, Fragment} from 'react';
import {DatePicker, Select, Space, Empty, Spin} from 'antd';
import {
  lineLista,
  lineAlllist,
  HZPatrolrecord,
  HZPatrolplan,
  SPCC_GetvideoStream,
  labelList
} from '../../../api/mainApi';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {useMappedState, useDispatch} from 'redux-react-hook';
import {Common} from '../../../utils/mapMethods'
import {videoPlay, getDistance} from '../../../utils/untils'
import {Event, Build, Model} from '../../../utils/map3d'
import moment from 'moment';
import './style.scss'

const {Option} = Select;
const ElectronicPatrol = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const mp_light = useMappedState(state => state.map3d_light);
  const [UploadImg, setImg] = useState(require('../../../assets/images/up_load.png').default)
  const [isChangeImg, setici] = useState(false)
  // eslint-disable-next-line
  const [tabs, setTabs] = useState(["视频巡逻路线", "电子巡更记录", "电子巡更计划"])
  const [tabs2, setTabs2] = useState(["暂停", "退出", "异常上传"])
  const [show, setShow] = useState(true)//叉
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState()
  const [ycsb_show, setYcsb] = useState(false) //异常上报页面
  // eslint-disable-next-line
  const [problems, setProblem] = useState([{name: "撒打算", value: "0"}, {name: "撒打算", value: "1"}, {
    name: "撒打算",
    value: "2"
  }])
  const [show2, setShow2] = useState(false)//开始之后
  // eslint-disable-next-line
  const [timeList, setTimeList] = useState([])
  const [jihuaList, setJhList] = useState([])
  // eslint-disable-next-line
  const [lineList, setLineList] = useState([])
  const [speed, setSpeed] = useState(15)
  const [stop, setStop] = useState(true)
  const [time, setTime] = useState({stime: "", etime: ""})
  const [spinning, setSpinning] = useState(false)
  const [spinning2, setSpinning2] = useState(false)

  useEffect(() => {
    getLinepatrol()
  }, []);
  //获取巡逻路线
  const getLinepatrol = () => {
    lineLista().then(res => {
      if (res.msg === "success") {
        setLineList(res.data)
      }
    })
  }
  const onChange = (date, dateString, type) => {
    setTime({...time, [type]: dateString})
  }
  //搜索电子巡更记录
  const handleSearch = () => {
    setSpinning(true)
    HZPatrolrecord({
      "startTime": time.stime,
      "endTime": time.etime
    }).then(res => {
      if (res.success === 200) {
        setTimeList(res.data)
        setSpinning(false)
      }
    })
  }
  //搜索计划巡更记录
  const handleSearch2 = () => {
    setSpinning2(true)
    HZPatrolplan({
      "startTime": time.stime,
      "endTime": time.etime
    }).then(res => {
      if (res.success === 200) {
        setJhList(res.data)
        setSpinning2(false)
      }
    })
  }
  //巡游备份
  const startXL = (value) => {
    setShow(false)
    setShow2(true)
    setCount2(9)
    lineAlllist({id: value.id}).then(res => {
      if (res.msg === "success") {
        var before_lines = res.data.patrol_line_subsection
        var trajectory = []
        before_lines.forEach(element => {
          trajectory.push({
            id: res.data.id,
            // x: element.options.line[0],
            // y: element.options.line[1],
            x: element.options[0].x,
            y: element.options[1].y,
            z: 400,
            floor: "F1",
            cameraList: element.patrol_camera
          })

        });

        trajectory.push({
          id: res.data.id,
          // x: before_lines[before_lines.length - 1].options.noodles[0][2],
          // y: before_lines[before_lines.length - 1].options.noodles[0][3],
          x: before_lines[before_lines.length - 1].options[1].x,
          y: before_lines[before_lines.length - 1].options[1].y,
          z: 400,
          floor: "F1",
          cameraList: before_lines[before_lines.length - 1].patrol_camera
        })

        let goTrajectory = {
          "visible": true, // 路线是否可见
          "style": "sim_arraw_Cyan",
          "width": 200,
          "speed": 150,
          "geom": trajectory,
          "pitch": 25,
          "distance": 3500
        }

        console.log("创建路线的数据", trajectory)
        Event.createRoute(mp_light, goTrajectory, false)

        // setTimeout(() => {

        if (before_lines[0].patrol_camera.length > 0) {
          console.log()
          console.log(before_lines[0].patrol_camera, "before_lines[0].patrol_camera都有啥")

          before_lines[0].patrol_camera.forEach((elcs, index) => {

            (function (index) {
              setTimeout(() => {
                // ------中院
                // videoPlay(elcs,"Patrol")
                // ------汉中
                SPCC_GetvideoStream({
                  cameraIndexCode: elcs.camera_code,
                  streamType: 0,
                  protocol: "wss"
                }).then(res => {
                  if (res.msg === "success") {
                    dispatch({type: "checkVideoUrl", video_url: res.data.url});
                  }
                })

              }, index * 1500)
            }(index))
          })
        }
        let lastCameraCode = null
        Event.playPatrolPath(mp_light, ((msg) => {
          trajectory.forEach(element => {
            if (element.cameraList.length === 0) {
              return;
            }
            element.cameraList.forEach((elc, index) => {
              if (
                Math.abs(elc.camera_info.list_style.x - msg.x) < 500
                && Math.abs(elc.camera_info.list_style.y - msg.y) < 500
                && Math.abs(elc.camera_info.list_style.z - msg.z) < 500
              ) {
                if (lastCameraCode === elc.camera_code) {
                  console.log('不重复播放', elc.camera_code)
                  return
                }
                lastCameraCode = elc.camera_code
                // ------汉中
                setTimeout(() => {
                  // ------中院
                  // videoPlay(elc,"Patrol")
                  // ------汉中
                  SPCC_GetvideoStream({
                    cameraIndexCode: elc.camera_code,
                    streamType: 0,
                    protocol: "wss"
                  }).then(res => {
                    if (res.msg === "success") {
                      dispatch({type: "checkVideoUrl", video_url: res.data.url});
                    }
                  })
                }, index * 1500)
              }
            })
          });
        }))

      }
    })
  }
  const handle_top2 = (index) => {
    setCount2(index)
    if (index === 1) {
      setShow(true)
      setShow2(false)
      setCount(0)
      setYcsb(false)
      //退出变回继续
      tabs2[0] = "暂停"
      setTabs2(tabs2)
      setStop(true)
      //退出清除路线
      Event.clearPatrolPath(mp_light)
      Common.initializationPosition(mp_light)
    } else if (index === 2) {
      setYcsb(true)
    } else {
      setYcsb(false)
      if (stop) {
        tabs2[0] = "继续"
        setTabs2(tabs2)
        Event.pausePatrolPath(mp_light)
        setStop(false)
      } else {
        tabs2[0] = "暂停"
        setTabs2(tabs2)
        Event.continuePatrolPath(mp_light)
        setStop(true)
      }
    }
  }
  const handleEquipment = (value) => {

  }
  const changImg = async (event) => {
    var imgFile;
    let reader = new FileReader(); //html5读文件
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (event) { //读取完毕后调用接口
      imgFile = event.target.result;
      setImg(imgFile)
      setici(true)
    }
  }
  return (
    <div id="electronicPatrol">
      {
        !show2 ? <div className="elp_top">
          <ul>
            {tabs.map((item, index) => {
              return (
                <li className={count === index ? "li_active" : ""} key={index} onClick={() => {
                  setCount(index);
                  setShow(true)
                }}>{item}</li>
              )
            })}
          </ul>
        </div> : null
      }
      {
        count === 0 && show ?
          <div className="elp_content animate_speed animate__animated animate__fadeInLeft" style={{width: "357px"}}>
            <div className="content_top">
              <h2>巡逻路线</h2>
              <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={() => {
                setShow(false);
                Event.clearPatrolPath(mp_light);
                setCount(10)
              }}/>
            </div>
            <div className="content_list">
              <ul>
                {lineList.map((item, index) => {
                  return (
                    <li key={index}>
                      <span>{item.line_name}</span>
                      <div className="button" onClick={() => startXL(item)}>开始</div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="content_top2">
              <h2>巡逻速度</h2>
            </div>
            <div className="xunluo_speed">
              <div className="change1">
                <span>无设备路线速度：</span>
                <input type="text"/>
                <span>秒</span>
              </div>
              <div className="change2">
                <span>单个设备速度：</span>
                <input type="text" onChange={(e) => setSpeed(e.target.value)}/>
                <span>秒</span>
              </div>
            </div>
          </div> : null
      }
      {
        count === 1 && show ? <div className="elp_content animate_speed animate__animated animate__fadeInLeft">
          <Spin spinning={spinning}>
            <div className="content_top">
              <h2>巡更历史记录</h2>
              <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={() => {
                setShow(false);
                setCount(10)
              }}/>
            </div>
            <div className="timeChange">
              <Space><span>起始时间：</span><DatePicker onChange={(time, timeString) => {
                onChange(time, timeString, "stime")
              }} format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" locale={locale}
                                                   showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}/></Space>
              <Space><span>结束时间：</span><DatePicker onChange={(time, timeString) => {
                onChange(time, timeString, "etime")
              }} format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" locale={locale}
                                                   showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}/></Space>
              <div className="search" onClick={() => handleSearch()}>搜索</div>
            </div>
            <div className="thead">
              <ul>
                <li>开始时间</li>
                <li>结束时间</li>
                <li>路线名称</li>
                <li style={{flex: "2"}}>巡逻人名</li>
                <li style={{flex: "3"}}>点位名称</li>
                <li style={{flex: ".7"}}>巡逻结果</li>
              </ul>
            </div>
            <div className="timeList">
              {
                timeList.length > 0 ? <ul>
                  {
                    timeList.map((item, index) => {
                      return (
                        <li key={index}>
                          <span title={item.begin_time.replace("T", " ")}>{item.begin_time.replace("T", " ")}</span>
                          <span title={item.end_time.replace("T", " ")}>{item.end_time.replace("T", " ")}</span>
                          <span title={item.patrol_route_name}>{item.patrol_route_name}</span>
                          <span title={item.person_names} style={{flex: "2"}}>{item.person_names}</span>
                          <span title={item.point_names}
                                style={{flex: "3", textAlign: "left"}}>{item.point_names}</span>
                          <span style={{flex: ".7"}}
                                title={item.patrol_result.toString().replace("1", "错巡").replace("2", "错巡").replace("3", "漏巡").replace("4", "漏巡")}>{item.patrol_result.toString().replace("1", "错巡").replace("2", "错巡").replace("3", "漏巡").replace("4", "漏巡")}</span>
                        </li>
                      )
                    })
                  }
                </ul> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" style={{marginTop: "200px"}}/>
              }
            </div>
          </Spin></div> : null
      }
      {
        count === 2 && show ? <div className="elp_content animate_speed animate__animated animate__fadeInLeft jihua">
          <Spin spinning={spinning2}>
            <div className="content_top">
              <h2>电子巡更计划</h2>
              <img className="cha" src={require('../../../assets/images/cha.png').default} alt="" onClick={() => {
                setShow(false);
                setCount(10)
              }}/>
            </div>
            <div className="timeChange">
              <Space><span>起始时间：</span><DatePicker onChange={(time, timeString) => {
                onChange(time, timeString, "stime")
              }} format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" locale={locale}
                                                   showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}/></Space>
              <Space><span>结束时间：</span><DatePicker onChange={(time, timeString) => {
                onChange(time, timeString, "etime")
              }} format="YYYY-MM-DD HH:mm:ss" placeholder="请选择日期" locale={locale}
                                                   showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}}/></Space>
              <div className="search" onClick={() => handleSearch2()}>搜索</div>
            </div>
            <div className="thead">
              <ul>
                <li>开始时间</li>
                <li>结束时间</li>
                <li style={{flex: "2"}}>计划路线</li>
                <li>巡更周期</li>
              </ul>
            </div>
            <div className="timeList">
              {
                jihuaList.length > 0 ? <ul>
                  {
                    jihuaList.map((item, index) => {
                      return (
                        <li key={index}>
                          <span>{item.begin_date.replace("T", " ")}</span>
                          <span>{item.end_date.replace("T", " ")}</span>
                          <span style={{flex: "2"}} title={item.plan_name}>{item.plan_name}</span>
                          <span>{item.patrol_cycle.toString().replace("0", "每天").replace("1", "每周").replace("2", "每月")}</span>
                        </li>
                      )
                    })
                  }
                </ul> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" style={{marginTop: "200px"}}/>
              }
            </div>
          </Spin></div> : null
      }
      {
        !show && show2 ? <div className="startXL animate_speed animate__animated animate__fadeInLeft">
          <div className="start_top">
            <ul>
              {
                tabs2.map((item, index) => {
                  return (
                    <li className={count2 === index ? "li_active2" : ""} key={index}
                        onClick={() => handle_top2(index)}>{item}</li>
                  )
                })
              }
            </ul>
          </div>
          {
            ycsb_show ? <div className="error_upload animate_speed animate__animated animate__fadeInLeft">
              <img className="cha" src={require('../../../assets/images/cha.png').default} alt=""
                   onClick={() => setYcsb(false)}/>
              <div className="upload_top">
                <h2>异常上传</h2>
              </div>
              <div className="upload_data">
                <div className="camera_name">
                  <span>相机名称：</span>
                  <input type="text"/>
                </div>
                <div className="problems">
                  <span>常见问题：</span>
                  <Select style={{width: 180}} onChange={handleEquipment} placeholder="请选择类别">
                    {
                      problems.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
                <div className="problems2">
                  <span>常见问题：</span>
                  <textarea></textarea>
                </div>
                <div className="img_upload">
                  <span>上传文件：</span>
                  <div className="upload">
                    <input type="file" id='optUrl' ref={inputRef} hidden accept=".jpg,.jpeg,.png,.mp4"
                           onChange={(e) => changImg(e)}/>
                    <div className="imgBox" onClick={() => {
                      inputRef.current.click()
                    }}>
                      {
                        isChangeImg ? <img className="img2" src={UploadImg} alt=""/> : <Fragment>
                          <img className="img1" src={UploadImg} alt=""/>
                          <h5>点击上传</h5>
                        </Fragment>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="upload_button">保存信息</div>
            </div> : null
          }
        </div> : null
      }
    </div>
  )
}

export default ElectronicPatrol;
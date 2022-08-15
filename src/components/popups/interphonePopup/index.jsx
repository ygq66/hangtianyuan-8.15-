import React, {useState, useEffect} from 'react';
import {intercomPlay, intercomPlayinit} from '../../../utils/untils';
import {infoList} from '../../../api/mainApi';
import {Checkbox, message} from 'antd';
import './style.scss'
import {iSocket as intercomS} from "../../../api/address";

const InterphonePopup = (props) => {
  const [show, setShow] = useState(false)
  const [msgdata, setMSG] = useState({device_name: "111111", category_name: "22222222"})
  const [duijianglist, setList] = useState([])
  useEffect(() => {

    if (props.msgdata) {
      console.log(props.msgdata, '对讲窗口接收到的数据')
      setMSG(props.msgdata)
      infoList({category_id: props.msgdata.category_id}).then(res => {

        if (res.msg === "success") {
          let results = res.data
          //当前对讲机能呼叫的对讲机数据处理
          let duijiang_after = []
          if (props.msgdata.category_name === "对讲分机") {
            results.forEach((ele) => {
              if (props.msgdata.device_code.length > 4) {
                if (ele.device_code.slice(0, 2) === props.msgdata.device_code.slice(0, 2) && ele.category_name === "对讲主机" && ele.device_code.length > 4) {
                  ele.enable = false
                  duijiang_after.push(ele)
                }
              } else {
                if (ele.device_code.slice(0, 2) === props.msgdata.device_code.slice(0, 2) && ele.category_name === "对讲主机" && ele.device_code.length < 5) {
                  ele.enable = false
                  duijiang_after.push(ele)
                }
              }
            })
          } else {
            results.forEach((ele) => {
              if (props.msgdata.device_code.length > 4) {
                console.log(ele, "results.forEach((ele)=>{}")
                if (ele.device_code.slice(0, 2) === props.msgdata.device_code.slice(0, 2) && ele.category_name === "对讲分机" && ele.device_code.length > 4) {
                  ele.enable = false
                  duijiang_after.push(ele)
                }
              } else {
                if (ele.device_code.slice(0, 2) === props.msgdata.device_code.slice(0, 2) && ele.category_name === "对讲分机" && ele.device_code.length < 5) {
                  ele.enable = false
                  duijiang_after.push(ele)
                }
              }
            })
          }
          duijiang_after.push({
            device_name: "总主机",
            device_code: "2000",
            enable: false
          })

          setList(duijiang_after)
        }

      })
      setShow(true)

    }
    // eslint-disable-next-line


  }, [props])


  const intercomPlayAAA = (data) => {
    const webSocket = new WebSocket(intercomS)
    let sion = []

    duijianglist.forEach(element => {
      if (element.enable) {
        sion.push(element.device_code)
      }
    });
    webSocket.onopen = function (e) {
      if (msgdata.category_name == "对讲主机") {

        let json = {
          cmd: 2001,
          mst_num: msgdata.device_code,  // 主机号
          slave_num: sion[0], // 分机号
          ter_num: msgdata.device_code, // 设备编号
          error_id: '4', // 错误编号
          audio_file: 'gsm.mp3', // 语音文件
          bc_count: '6', // 广播次数
          group_num: '7', // 广播组号
          cb_reg_type: 0,  // 普通分机=0    门口机=1
          cb_lock: 1       // 开锁编号   1=0  2=1
        }

        webSocket.send(JSON.stringify(json))

      } else if (msgdata.category_name == "对讲分机") {

        let json = {
          cmd: 2001,
          mst_num: sion[0],  // 主机号
          slave_num: msgdata.device_code, // 分机号
          ter_num: msgdata.device_code, // 设备编号
          error_id: '4', // 错误编号
          audio_file: 'gsm.mp3', // 语音文件
          bc_count: '6', // 广播次数
          group_num: '7', // 广播组号
          cb_reg_type: 0,  // 普通分机=0    门口机=1
          cb_lock: 1       // 开锁编号   1=0  2=1
        }

        webSocket.send(JSON.stringify(json))
      }


    }
    webSocket.onmessage = function (e) {

    }

  }


  //操作
  const handleDJ = (cmd) => {
    intercomPlayAAA()
    setTimeout(() => {
      let dj_data;
      if (msgdata.category_name === "对讲主机") {
        //总主机对讲
        if (msgdata.device_code === 2000) {
          dj_data = {
            cmd: cmd,
          }
        } else {
          //主机对讲
          dj_data = {
            cmd: cmd,
          }
        }
      } else {
        dj_data = {
          cmd: cmd,

        }
      }
      intercomPlay(dj_data)
    }, 1000)

  }
  //多选
  const checkChange = (e, index) => {
    if (msgdata.category_name !== "对讲主机") {
      let ccount = 0;
      duijianglist.forEach(element => {
        if (element.enable) {
          ccount++;
        }
      });
      if (ccount > 1) {
        message.success("最多一个")
      } else {
        const selectlist = [...duijianglist]
        selectlist[index].enable = e.target.checked;
        setList(selectlist)
      }
    } else {
      let iszong;
      duijianglist.forEach(element => {
        if (element.device_code === "1000") {
          iszong = element.enable
        }
      });
      if (!iszong) {
        const selectlist = [...duijianglist]
        selectlist[index].enable = e.target.checked;
        setList(selectlist)
      } else {
        message.success("已经选择总主机")
      }
    }
  }
  return (
    <>
      {
        show ? <div className={`${"animate_speed animate__animated"} ${"animate__zoomIn"}`} id="InterphonePopup">
          <div className="cp_title">
            <span>对讲</span>
            <img src={require('../../../assets/images/closeBtn.png').default} alt="close" onClick={() => {
              setShow(false)
            }}/>
          </div>
          <div className="cp_content">
            <div className="titleName">
              <div className="content_item"><span>设备名称：</span><span>{msgdata.device_name}</span></div>
              <div className="content_item"><span>设备类型：</span><span>{msgdata.category_name}</span></div>
            </div>
            <div className="cp_list">
              <ul>
                {
                  duijianglist.map((item, index) => {
                    return (
                      <li key={index}>
                        <Checkbox checked={item.enable}
                                  onChange={(e) => checkChange(e, index)}>{item.device_name}</Checkbox>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          {
            msgdata.category_name === "对讲主机" ?
              <div className="cp_button">
                <span onClick={() => {
                  handleDJ(1001)
                }}>呼叫</span>
                <span onClick={() => {
                  handleDJ(1003)
                }}>挂断</span>
                <span onClick={() => {
                  handleDJ(1006)
                }}>多人通话</span>
                <span onClick={() => {
                  handleDJ(1008)
                }}>多人挂断</span>
              </div> :
              <div className="cp_button">
                <span onClick={() => {
                  handleDJ(1001)
                }}>呼叫</span>
                <span onClick={() => {
                  handleDJ(1003)
                }}>挂断</span>
              </div>
          }
        </div> : null
      }
    </>

  )
}

export default React.memo(InterphonePopup);
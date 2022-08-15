import { vSocekt as videoS, iSocket as intercomS } from '../api/address';
import { message } from 'antd';

//打开视频控件
export function videoPlay(data,wm,callback) {
    const webSocket = new WebSocket(videoS)
    webSocket.onclose  =function(e){
        if (callback) {
            callback();
        }
    }
    webSocket.onopen = function (e) {
        console.log('%c video websocket is open:',"color: red;font-size:13px")
        let json;
        /* _海康_汉中_赵猛 */
        json ={
            "type": "play",
            "cameraCode":data.device_code
        }
        /* _海康_杭州中院_张源 */
        // if(wm === "LinkAlarm"){
        //     json ={
        //         "type": wm,
        //         "cameraCode":data
        //     }
        // }else{
        //     json ={
        //         "type": wm || "playVideo",
        //         "cameraCode":data.detail_info
        //     }
        // }
        /* _海康__卫录屏 */
        // json ={
        //     "type": "PlayVideo",
        //     "detailInfo": data.detail_info
        // }
        webSocket.send(JSON.stringify(json))
    }
}
//初始化websocket
export function intercomPlayinit(data) {
    const ws = new WebSocket(intercomS)
    ws.onopen = function (e) {
        console.log('%c intercom websocket is open:',"color: red;font-size:13px")
        var jsoninit = {
            cmd: data.cmd,
            mst_num: data.mst_num,  // 主机号
            slave_num: data.slave_num, // 分机号
            ter_num: data.ter_num, // 设备编号
            error_id: '4', // 错误编号
            audio_file: 'gsm.mp3', // 语音文件
            bc_count: '6', // 广播次数
            group_num: '7', // 广播组号
            cb_reg_type: 0,  // 普通分机=0    门口机=1
            cb_lock: 1       // 开锁编号   1=0  2=1
        };
        console.log(JSON.stringify(jsoninit),"JSON.stringify(json)")
        ws.send(JSON.stringify(jsoninit));
    }
    ws.onmessage = function (e) {
        console.log("已成功初始化连接")
    }


}
//对讲功能
export function intercomPlay(data) {
    console.log(data,"websocket data有什么")
    const webSocket = new WebSocket(intercomS)
    webSocket.onopen = function (e) {
        console.log('%c intercom websocket is open:',"color: red;font-size:13px")
        var json = {
            cmd: data.cmd,
        };
        console.log(JSON.stringify(json),"JSON.stringify(json)")
        webSocket.send(JSON.stringify(json));
    }
    webSocket.onmessage = function (e) {

        console.log(data,"onmessage里面有什么")
        let datamsg = "操作成功"
        if(data.IsRead === 1){
            datamsg = "呼叫成功"
        }else if(data.IsRead === 2){
            datamsg = "挂断成功"
        }else if(data.IsRead === 3){
            datamsg = "多人呼叫成功"
        }else if(data.IsRead === 4){
            datamsg = "多人挂断成功"
        }
        if(e.data){message.success(datamsg)}
    }
    console.log(data,"111")

}

export function video_need_socket(data) {
    const webSocket = new WebSocket(intercomS)
    webSocket.onopen = function (e) {
        console.log('%c intercom websocket is open:',"color: red;font-size:13px")
        var json ={
            "host": data.host,
            "soin": data.soin,
            "IsRead": data.IsRead
        }
        webSocket.send(JSON.stringify(json))
    }
    webSocket.onmessage = function (e) {
        if(e.data){message.success(e.data)}
    }
}

//格式化时间
export function timeFormat(date) {
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}

export function getDistance(start, end) {
    return Math.sqrt(Math.pow(start.x  - end.x, 2) + Math.pow(start.y - end.y, 2))
}
import $ from 'jquery';
var ApiUrl;//张源接口
var ApiUrl2;//李晓飞接口
var videoS;//相机视频socket
var alarmS;//报警socket
var luWang;//路网接口
var luwangName;//路网名字
var doorUrl;//门禁接口
var intercomS;//对讲机
var videoDonwload_url;//视频下载地址
var pj1;
var pj2;
var tk1;
var tk2;
var purl;

$.ajax({
    url: "./config.json",
    type: "get",
    async: false,
    success: function (response) {
        let projectAddrass = window.location.host;
        console.log('%c config.json配置:',"color: red;font-size:13px",response)
        console.log('%c 本机IP:',"color: blue;font-size:13px",projectAddrass)
        // 返回当前的URL协议,既http协议还是https协议
        // let protocol = document.location.protocol;
        // const interfaceIp = `${protocol}//${projectAddrass}/api`;
        ApiUrl = response.Url;
        ApiUrl2= response.Url2;
        videoS = response.videoSocket;
        alarmS = response.alarmSocket;
        luWang = response.luwangIp;
        luwangName = response.luwangName;
        doorUrl = response.doorInterface;
        intercomS = response.intercomSocket;
        videoDonwload_url = response.videoDownload;

        pj1 = response.projectId;
        pj2 = response.projectId2;
        tk1 = response.token;
        tk2 = response.token2;
        purl = response.photoUrl;
    }
})

export var api1 = ApiUrl
export var api2 = ApiUrl2
export var vSocekt = videoS
export var ASocekt = alarmS
export var lwIP = luWang
export var lwName = luwangName
export var doorInurl = doorUrl
export var iSocket = intercomS
export var videodurl = videoDonwload_url
export var p_url = purl

export var wpj1 = pj1
export var wpj2 = pj2
export var wtk1 = tk1
export var wtk2 = tk2



import { api1 as ApiUrl, api2 as ApiUrl2, doorInurl as doorUrl } from './address';

// 接口集合
const constant =  {
  //登录
  getLogin : `${ApiUrl}/sys/user/list`,

  //获取平台配置
  getConfig : `${ApiUrl}/sys/config/list`,

  //头部模块列表
  layoutList : `${ApiUrl}/layout/config/list`,

  // --->相机列表
  infoList : `${ApiUrl}/device/info/list`,
  
  //视频监控树
  regionList:`${ApiUrl}/device/region/list`,

  //报警统计
  infoCount : `${ApiUrl}/event/info/count`,

  //七日报警
  weekCount : `${ApiUrl}/event/info/week/count`,

  //所有的设备类型
  categoryList : `${ApiUrl}/device/category/list`,

  //报警记录
  infoInfoList : `${ApiUrl}/event/info/type/list`,

  //确定忽略
  infoUpdate : `${ApiUrl}/event/info/update`,

  //查询设备属于哪个网格
  cameraRegion:`${ApiUrl2}/camera/region`,

  //巡逻路线
  lineList:`${ApiUrl2}/patrol/line/list`,
  
  //根据id查路线
  lineAlllist:`${ApiUrl2}/patrol/line/alllist`,

  //建筑id查建筑和楼层数据
  labelList:`${ApiUrl2}/figure/label/listId`,

  //查询黑白地图url配置
  getConfig_L : `${ApiUrl2}/sys/config/list`,

  //获取所有建筑信息
  buildList : `${ApiUrl2}/map/build/list`,

  //获取初始化位置接口
  locationList : `${ApiUrl2}/init/location/list`,

  //查种类设备详情
  infoListS : `${ApiUrl2}/device/info/listS`,

  //查文字标注
  labelLists : `${ApiUrl2}/figure/label/list`,
  
  //点线追查
  traceDrag : `${ApiUrl2}/trace/drag`,

  //查询漫游列表
  roamflyList : `${ApiUrl2}/roam/fly/list`,
  
  //资源图谱相机计总
  Cameratotal : `${ApiUrl2}/device/category/count`,

  //资源图谱树图
  Treetotal : `${ApiUrl2}/Resource/map`,

  //所有相机模型列表
  cameraList_S : `${ApiUrl2}/device/camera/listS`,

  //人脸应用  --->人脸库
  businessFace : `${ApiUrl2}/business/selectFacebank`,

  // --->历史轨迹查询
  businessSearch : `${ApiUrl2}/business/SearchImg`,

  //监区楼层查面坐标
  roomList : `${ApiUrl2}/bed/room/list`,

  //场景接口--->添加
  locationAdd : `${ApiUrl2}/map/location/add`,
  //--->删除
  locationDelete : `${ApiUrl2}/map/location/delete`,
  //--->修改
  locationUpdate : `${ApiUrl2}/map/location/update`,
  //--->查询
  locationList_h : `${ApiUrl2}/map/location/list`,

  //门禁控制
  SPCC_doControl : `${doorUrl}/SPCC/doControl`,
  
  //门禁状态
  SPCC_DoorState : `${doorUrl}/SPCC/DoorState`,

  //门禁进出记录
  SPCC_DoorList : `${doorUrl}/SPCC/DoorList`,

  //床位信息查询 -- 犯人列表
  GKBedInformationRoom : `${doorUrl}/SPCC/GKBedInformationRoom`,

  //电子巡更记录
  HZPatrolrecord : `${doorUrl}/SPCC/HZPatrolrecord`,
  //巡更计划
  HZPatrolplan : `${doorUrl}/SPCC/HZPatrolplan`,
  //报警轨迹记录
  HZFaceAlarmRecord : `${doorUrl}/SPCC/HZFaceAlarmRecord`,

    //报警轨迹记录
    SPCC_GetvideoStream : `${doorUrl}/SPCC/GetVideoStream`,

  //获取所有床位信息
  getBedList: `${ApiUrl2}/bed/list`
} 

export default constant;
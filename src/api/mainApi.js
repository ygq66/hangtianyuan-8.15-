// 引用api公共地址
import constant from './constent'
// 引用接口公共方法
import request from './request'

export function getLogin(paramsData) {
    return request({
        url: constant.getLogin,
        method: 'post',
        data: paramsData
    })
}
export function getConfig() {
    return request({
        url: constant.getConfig,
        method: 'get'
    })
}
export function layoutList(paramsData) {
    return request({
        url: constant.layoutList,
        method: 'post',
        data: paramsData
    })
}
export function Cameratotal() {
    return request({
        url: constant.Cameratotal,
        method: 'get'
    })
}
export function Treetotal(paramsData){
    return request({
        url:constant.Treetotal,
        method:'post',
        data: paramsData
    })
}
export function cameraList_S(paramsData) {
    return request({
        url: constant.cameraList_S,
        method: 'post',
        data: paramsData
    })
}
export function cameraRegion(paramsData) {
    return request({
        url: constant.cameraRegion,
        method: 'post',
        data: paramsData
    })
}
export function infoList(paramsData) {
    return request({
        url: constant.infoList,
        method: 'post',
        data: paramsData
    })
}
export function lineLista() {
    return request({
        url: constant.lineList,
        method: 'get',
    })
}
export function lineAlllist(paramsData) {
    return request({
        url: constant.lineAlllist,
        method: 'post',
        data: paramsData
    })
}
export function labelList(paramsData) {
    return request({
        url: constant.labelList,
        method: 'post',
        data: paramsData
    })
}
export function getConfig_L() {
    return request({
        url: constant.getConfig_L,
        method: 'get'
    })
}
export function buildList() {
    return request({
        url: constant.buildList,
        method: 'get'
    })
}
export function locationList() {
    return request({
        url: constant.locationList,
        method: 'get'
    })
}
export function infoListS(paramsData) {
    return request({
        url: constant.infoListS,
        method: 'post',
        data: paramsData
    })
}
export function labelLists() {
    return request({
        url: constant.labelLists,
        method: 'get'
    })
}
export function infoCount() {
    return request({
        url: constant.infoCount,
        method: 'get'
    })
}
export function weekCount() {
    return request({
        url: constant.weekCount,
        method: 'get'
    })
}
export function businessFace(paramsData) {
    return request({
        url: constant.businessFace,
        method: 'post',
        data: paramsData
    })
}
export function businessSearch(paramsData) {
    return request({
        url: constant.businessSearch,
        method: 'post',
        data: paramsData
    })
}
export function regionList(paramsData) {
    return request({
        url: constant.regionList,
        method: 'post',
        data: paramsData
    })
}
export function categoryList() {
    return request({
        url: constant.categoryList,
        method: 'get'
    })
}
export function infoInfoList(paramsData) {
    return request({
        url: constant.infoInfoList,
        method: 'post',
        data: paramsData
    })
}
export function infoUpdate(paramsData) {
    return request({
        url: constant.infoUpdate,
        method: 'post',
        data: paramsData
    })
}
export function roamflyList() {
    return request({
        url: constant.roamflyList,
        method: 'get'
    })
}
export function roomList(paramsData) {
    return request({
        url: constant.roomList,
        method: 'post',
        data: paramsData
    })
}

//门禁
export function SPCC_doControl(paramsData) {
    return request({
        url: constant.SPCC_doControl,
        method: 'post',
        data: paramsData
    })
}
export function SPCC_DoorState(paramsData) {
    return request({
        url: constant.SPCC_DoorState,
        method: 'post',
        data: paramsData
    })
}
export function SPCC_DoorList(paramsData) {
    return request({
        url: constant.SPCC_DoorList,
        method: 'post',
        data: paramsData
    })
}
export function traceDrag(paramsData) {
    return request({
        url: constant.traceDrag,
        method: 'post',
        data: paramsData
    })
}
export function GKBedInformationRoom(paramsData) {
    return request({
        url: constant.GKBedInformationRoom,
        method: 'post',
        data: paramsData
    })
}
export function locationAdd(paramsData) {
    return request({
        url: constant.locationAdd,
        method: 'post',
        data: paramsData
    })
}
export function locationDelete(paramsData) {
    return request({
        url: constant.locationDelete,
        method: 'post',
        data: paramsData
    })
}
export function locationUpdate(paramsData) {
    return request({
        url: constant.locationUpdate,
        method: 'post',
        data: paramsData
    })
}
export function locationList_h() {
    return request({
        url: constant.locationList_h,
        method: 'get'
    })
}
export function HZPatrolrecord(paramsData) {
    return request({
        url: constant.HZPatrolrecord,
        method: 'post',
        data: paramsData
    })
}
export function HZPatrolplan(paramsData) {
    return request({
        url: constant.HZPatrolplan,
        method: 'post',
        data: paramsData
    })
}
export function HZFaceAlarmRecord(paramsData) {
    return request({
        url: constant.HZFaceAlarmRecord,
        method: 'post',
        data: paramsData
    })
}
export function getBedList() {
    return request({
        url: constant.getBedList,
        method: 'get'
    })
}
export function SPCC_GetvideoStream(paramsData) {
    return request({
        url: constant.SPCC_GetvideoStream,
        method: 'post',
        data: paramsData
    })
}

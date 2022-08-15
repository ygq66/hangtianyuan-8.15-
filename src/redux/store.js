import { createStore } from 'redux';
import reducer from './reducers';

export function makeStore() {
    return createStore(reducer, {
        userData:{},//用户数据
        top_navigation_count:"",//模块选择的下标
        top_navigation_module:"",//模块组件名
        map3d_light:{},//白地图对象
        map3d_dark:{},//黑地图对象
        mapLight_url:"",//白地图url
        mapDark_url:"",//黑地图url
        alarmMsg:[],//报警闪光的对象合集
        isVideo:"",//控件下载提示
        video_url:""//
    })
}
import React, { useEffect } from 'react';
import { createMap, Model, Build } from '../../utils/map3d';
import { Common } from '../../utils/mapMethods';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { cameraList_S, labelLists } from '../../api/mainApi';
import { wpj1 as pj1, wtk1 as tk1 } from '../../api/address';
import { message } from 'antd'
import './style.scss'

const MapLight = (props) => {
    const dispatch = useDispatch();
    const mapUrl = useMappedState(state => state.mapLight_url);
    useEffect(() => {
        if (mapUrl) {
            createMapsss("https://" + mapUrl)
        }
        // eslint-disable-next-line
    }, [mapUrl])
    const createMapsss = (url) => {
        var map_light = createMap.createMap({
            id: "mapv3dContainer_light",
            url: url,
            projectId: pj1,
            token: tk1
            // id: "mapv3dContainer_light",
            // url: "http://192.168.0.178:19901/aimapvision3d",
            // projectId: "50c0042d1fa94ad6962d9b60a17998d1",
            // token: "38b56b60d7538e242518e7a32b9be88c"

        }, (() => {
            console.log("创建地图的参数", url, pj1, tk1);
            dispatch({ type: "mp_light", map3d_light: map_light });
            //初始化位置
            Common.initializationPosition(map_light)
            // setTimeout(() => {
            //     window.open("https://10.0.160.70:6014/", '_blank', 'noopener,noreferrer')
            // }, 100);
            Build.allShow(map_light, true)



            cameraList_S().then(res => {
                var results = res.data;

                map_light.Clear()
                map_light.Stop()
                Model.clearMouseCallBack(map_light)

                // Common.addModel(0, results, map_light)
                let modelResource = results.map(data => Common.createModelConfig(data))

                Common.batchedAddModel(map_light, modelResource, 10, res => {
                    let shinei = []
                    results.forEach(element => {
                        if (!element.indoor) {
                            shinei.push(element)
                        }
                    })
                    Common.add_iconModel(0, shinei, map_light,()=>{
                        // message.success('所有模型加载完毕!')

                    })
                    // Model.getModel(map_light)
                })
            })
            //创建文字标注
            // labelLists().then(res=>{
            //     if(res.msg === "success"){
            //         var res2Data = res.data;
            //         res2Data.forEach((element2,index2)=>{
            //             var labelData = JSON.parse(element2.label_style.model)
            //             var labelPosition = labelData.location
            //             Model.labelLoading(map_light,{
            //                 text:element2.label_name,
            //                 attr:element2,
            //                 location:{
            //                     x:Common.filter(labelPosition.x),
            //                     y:Common.filter(labelPosition.y),
            //                     z:Common.filter(labelPosition.z),
            //                     pitch:Common.filter(labelPosition.pitch),
            //                     yaw:Common.filter(labelPosition.yaw),
            //                     roll:Common.filter(labelPosition.roll)
            //                 },
            //                 fontcolor:labelData.fontcolor,
            //                 fontsize:labelData.fontsize
            //             })
            //         })
            //     }
            // })
        }))
    }
    return (
        <div id="mapv3dContainer_light" style={{ width: props.setWidth }}></div>
    )
}

export default MapLight;
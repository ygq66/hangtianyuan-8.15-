import React,{ useEffect } from 'react';
import {createMap} from '../../utils/map3d'
import virtualization from '../../utils/virtualization'
import { useMappedState,useDispatch } from 'redux-react-hook';
import { wpj2 as pj2, wtk2 as tk2,api2 as ApiUrl2 } from '../../api/address';

import './style.scss'

 const Map = (props) => {
    let view3d = '';
    const dispatch = useDispatch();
    const mapUrl = useMappedState(state => state.mapDark_url);
    useEffect(() => {
        if(mapUrl){
          createMapsss("https://"+mapUrl)
        }
        setTimeout(()=>{
            virtualization.getPolygon({view3d:view3d,url:ApiUrl2+'/digitalize/map'})
        },500)
        // eslint-disable-next-line
    },[mapUrl])
    const createMapsss =(url)=>{
        view3d = createMap.createMap({
            id: "mapv3dContainer_dark",
            url:url,
            projectId: pj2,
            token:tk2

        },()=>{})
        dispatch({type:"mp_dark",map3d_dark:view3d});
    }

    return (
        <div id="mapv3dContainer_dark" style={{width:props.setWidth}}></div>
    )
}
export default Map;
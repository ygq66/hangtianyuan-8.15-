export default function reducer(state, action) {
    switch(action.type) {
        case "userData": {
            return { ...state,userData: action.userData }
        }
        case "handleTop": {
            return { ...state,top_navigation_count: action.top_navigation_count }
        }
        case "handleModule": {
            return { ...state,top_navigation_module: action.top_navigation_module }
        }
        case "mp_light": {
            return { ...state,map3d_light: action.map3d_light }
        }
        case "mp_dark": {
            return { ...state,map3d_dark: action.map3d_dark }
        }
        case "mp_light_url": {
            return { ...state,mapLight_url: action.mapLight_url }
        }
        case "mp_dark_url": {
            return { ...state,mapDark_url: action.mapDark_url }
        }
        case "alarmMsg": {
            return { ...state,alarmMsg: action.alarmMsg }
        }
        case "checkVideo": {
            return { ...state,isVideo: action.isVideo }
        }
        case "checkVideoUrl": {
            return { ...state,video_url: action.video_url }
        }
        default:
            return state
    }
}
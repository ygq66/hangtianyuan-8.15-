import React, { useState, useEffect } from 'react';
import { useMappedState, useDispatch} from 'redux-react-hook';
import './style.scss';

var player;
function VideoWss() {

  const dispatch = useDispatch();
  const videoUrl_http_flv = useMappedState(state => state.video_url);
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (videoUrl_http_flv) {
      setShow(true)
      setTimeout(() => {
        createPlayer()
        window.addEventListener('resize', () => {
          player.JS_Resize()
        })
        realplay(videoUrl_http_flv)
      }, 100);
    }
  }, [videoUrl_http_flv])

  const realplay = (url) => {
    function mode() {
      return 'mse' === 'mse' ? 0 : 1
    }
    player.JS_Play(url, { url, mode }, player.currentWindowIndex).then(
      () => {
        console.log('realplay success')
      },
      e => {
        console.error(e)
      }
    )
  };

  const createPlayer = () => {
    player = new window.JSPlugin({
      szId: 'player',
      szBasePath: "./",
      iMaxSplit: 1,
      iCurrentSplit: 1,
      openDebug: true,
      oStyle: {
        borderSelect: '#000'
      }
    })

    // 事件回调绑定
    player.JS_SetWindowControlCallback({
      windowEventSelect: function (iWndIndex) { //插件选中窗口回调
        console.log('windowSelect callback: ', iWndIndex);
      },
      pluginErrorHandler: function (iWndIndex, iErrorCode, oError) { //插件错误回调
        console.log('pluginError callback: ', iWndIndex, iErrorCode, oError);
      },
      windowEventOver: function (iWndIndex) { //鼠标移过回调
        //console.log(iWndIndex);
      },
      windowEventOut: function (iWndIndex) { //鼠标移出回调
        //console.log(iWndIndex);
      },
      windowEventUp: function (iWndIndex) { //鼠标mouseup事件回调
        //console.log(iWndIndex);
      },
      windowFullCcreenChange: function (bFull) { //全屏切换回调
        console.log('fullScreen callback: ', bFull);
      },
      firstFrameDisplay: function (iWndIndex, iWidth, iHeight) { //首帧显示回调
        console.log('firstFrame loaded callback: ', iWndIndex, iWidth, iHeight);
      },
      performanceLack: function () { //性能不足回调
        console.log('performanceLack callback: ');
      }
    });
  };

  const closeVideoWss = ()=>{
    dispatch({ type: "checkVideoUrl", video_url: null });
    setShow(false)
  }

  const quanping = ()=>{
    player.JS_FullScreenDisplay(true).then(
      () => {
        console.log(`wholeFullScreen success`)
      },
      e => {
        console.error(e)
      }
    )
  }

  return (
    <>
      {
        show ? <div id="videoWss">
          <div className='video_header'>
            <span>视频监控</span>
            <div className='vh_right'>
              <span className='qping' onClick={()=>quanping()}>全屏</span>
              <img src={require("../../assets/images/closeBtn.png").default} alt="" onClick={() => closeVideoWss()} />
            </div>
          </div>
          <div id='player'></div>
        </div> : null
      }
    </>

  )
}

export default VideoWss;
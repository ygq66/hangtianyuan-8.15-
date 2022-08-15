import React, { useMemo, useState, useEffect,useDispatch } from 'react';
import videojs from 'video.js';
// //样式文件注意要加上
import 'video.js/dist/video-js.css'
import "videojs-contrib-hls"
import './index.scss'

const Player = (props) => {
  console.log(props);
  const [videoNode, setVideoNode] = useState();
  const [player, setPlayer] = useState();
  const [show, setshow] = useState(false)
  // const dispatch = useDispatch();
  //   const url = 'rtmp://58.200.131.2:1935/livetv/hunantv';

  useEffect(()=>{
    if(props.msgdata !== undefined){
      setshow(true)
    }
  })
  useMemo(() => {
    if (videoNode) {
      
      const videoJsOptions = {
        autoplay: true, // 自动播放
        language: 'zh-CN',
        preload: 'auto', // 自动加载
        errorDisplay: true, // 错误展示
        width: 475, // 宽
        height: 300,
        flash: {
          swf: '/video-js.swf',
        },
        sources: [
          {
            src: props.msgdata,
            
            type: 'application/x-mpegURL'
          },
        ],
      };

        console.log(videoJsOptions,'videoJsOptions啊啊啊啊啊啊');
      const videoPlayer = videojs(videoNode, videoJsOptions);
      setPlayer(videoPlayer);
    }
  }, [videoNode]);

  useEffect(() => {
    return (() => {
      if (player) player.dispose()
    })
  }, [])

  return (
    <>
      {
        show ? <video
          ref={(node) => {
            setVideoNode(node);
          }}
          id={props.ids}
          className="video-js vjs-default-skin vjs-big-play-centered"
          width="100%"
          height="100%"
        >
          
          <track kind="captions" />
          <p className="vjs-no-js">您的浏览器不支持HTML5，请升级浏览器。</p>
        </video>
        :null
    }

    </>
  )
}

export default Player;

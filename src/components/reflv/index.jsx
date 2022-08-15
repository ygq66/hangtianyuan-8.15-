import React, { useRef, useEffect } from 'react';
import flvjs from 'flv.js';
import './style.scss';

var flvPlayer
function Reflv(props) {
  const initFlv = useRef()
  useEffect(() => {
    let videoDom = initFlv.current
    if (props.url) {
      if (videoDom) {
        if (flvjs.isSupported()) {
          let initflvPlayer = flvjs.createPlayer({ ...props }, props.config)
          initflvPlayer.attachMediaElement(videoDom)
          initflvPlayer.load()
          initflvPlayer.play()
          flvPlayer = initflvPlayer
        }
      }
    }
    return () => {
      console.log('离开视频了', flvPlayer)
      if (flvPlayer) {
        flvPlayer.pause()
        flvPlayer.unload()
        flvPlayer.detachMediaElement()
        flvPlayer.destroy()
        flvPlayer = null
      }
    }
  }, [props])

  return (
    <video
      muted
      className={props.className}
      style={props.style}
      ref={initFlv}
      controls
    />
  )
}

export default Reflv;
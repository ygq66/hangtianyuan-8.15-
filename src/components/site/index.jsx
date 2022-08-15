import React,{ forwardRef,useImperativeHandle,useState,useEffect,Fragment} from 'react';
import './style.scss'
import FullScrenn from '../../utils/fullScreen';
const Site = forwardRef((props,ref) => {
    const [isZhankai,setZK] = useState(false)
    const [siteList,setSite] = useState([{icon:"quanping",isopen:false},{icon:"liandong",isopen:false},{icon:"shuzihua",isopen:false}])
    useEffect(()=>{
        FullScrenn.init(function(){})
    },[]);
    const checkSite =(index,parents)=>{
        let array = [...siteList];
        if(parents === "chrilen"){
            array[index].isopen = !array[index].isopen
        }else{
            array[index].isopen = true
        }
        setSite(array)
        if(siteList[index].icon === "shuzihua"){
            //数字化
            if(siteList[index].isopen){
                setZK(true)
                props.ctrlcheck(true)
            }else{
                props.ctrlcheck(false)
                setZK(false)
            }
        }else if(siteList[index].icon === "quanping"){
            //全屏
            if(array[index].isopen === true){
                FullScrenn.enterFullScreen();
                props.ctrlwidth("100%")
                props.ctrlall(true)

            }else{
                FullScrenn.exitFullScreen();
                props.ctrlwidth("50%")
                props.ctrlall(false)
            }
        }else if(siteList[index].icon === "liandong"){
            props.stl(siteList[index].isopen)
        }
    }
    useImperativeHandle(ref, () => ({
        open(index,parents) {
            checkSite(index,parents)
        }
    }))
    return (
        <div id="site">
            <ul>
                {siteList.map((item,index) => {
                    return (
                        <Fragment key={index}>
                            {
                                isZhankai || item.icon === "shuzihua"?
                                    <li key={index} className={item.isopen?'li_xz':null}  onClick={()=>checkSite(index,"chrilen")}>
                                        {item.isopen?(<img className="img_active" src={require('../../assets/site/'+item.icon+'-xz.png').default} alt="icon"/>
                                        ):<img src={require('../../assets/site/'+item.icon+'.png').default} alt="icon"/>}
                                </li>:null
                            }
                        </Fragment>
                    );
                })}
            </ul>
        </div>
    )
})

export default Site;
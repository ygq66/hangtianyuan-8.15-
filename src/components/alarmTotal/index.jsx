import React,{ useState,useEffect } from 'react';
import * as echarts from 'echarts';
import './style.scss'
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { Empty,Popover,message,Spin } from 'antd';
import { infoCount,weekCount,categoryList,infoInfoList,infoUpdate } from '../../api/mainApi';
import { timeFormat } from '../../utils/untils'

echarts.use([GridComponent, LineChart, CanvasRenderer]);
const Alarm = () => {
    const [show,setShow] = useState(false)//报警conten显示隐藏
    const [showEcharts,setEcahrts] = useState(true) //图表统计
    const [showAtype,setAtype] = useState(false)//报警类型
    const [showEvent,setEvent] = useState(false)//事件列表
    const [alarmTypelist,setAlarmType] = useState([])
    const [count,setCount] = useState()
    const [totals,setTotals] = useState([])
    const [alarmName,setAname] = useState("默认")
    const [recordNum,setRecordNum] = useState(0)
    const [alarmEventlist,setAlarmList] = useState([])
    const [spinning,setSpinning]= useState(false)

    useEffect(()=>{
        if(show && showEcharts){alarm_echarts()}
    },[show,showEcharts]);
    //获取报警统计
    const getAlarm_count =() =>{
        infoCount().then(res=>{
            if(res.msg === "success"){
                setTotals(res.data)
            }
        })
    } 
    //加载报警折线图
    const alarm_echarts = () =>{
        weekCount().then(res=>{
            if(res.msg === "success"){
                let weekData = []
                res.data.forEach(element => {
                    weekData.push(element.count)
                });
                var chartDom = document.getElementById('main');
                var myChart = echarts.init(chartDom);
                var option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            label: {
                                backgroundColor: 'rgba(0,0,0,0)',
                            },
                        },
                        confine: true,//浮窗不超出屏幕范围
                    },
                    xAxis: {
                        type: 'category',
                        axisLine:{
                          lineStyle: {color: '#5b676f',width:2 }
                        },
                        splitLine: {
                            show: true,//显示纵向网格线
                            lineStyle:{
                                color: 'rgba(0,0,0,.2)'
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            textStyle: {
                                color: '#b8b8b8'
                            }
                        },
                        data: ['1', '2', '3', '4', '5', '6', '7']
                      },
                    yAxis:[{
                        type:'value',
                        axisLine: {
                            show:true,
                            lineStyle: {
                                color: '#5b676f',
                                width:2, 
        
                            }
                        },
                        splitLine: {
                            show: true,//显示纵向网格线
                            lineStyle:{
                                // 使用rgba设置折线透明度为0，可以视觉上隐藏折线
                                color: 'rgba(0,0,0,.2)'
                            }
                        },
                        axisLabel:{
                            textStyle: {
                                color: '#b8b8b8'
                            }
                        }
                    }],
                    series: [{
                        data: weekData,
                        type: 'line',
                        symbolSize:8,
                        symbol: 'circle',
                        lineStyle:{
                            color:'#47fbff'
                        },
                        itemStyle:{
                            normal:{
                                color:'#47fbff',
                                label : {
                                    show: true
                                },
                                borderColor:'rgba(253,253,253)',// 拐点边框颜色
                                borderWidth:3
                            }
                        }
                    }]
                };
                option && myChart.setOption(option);  
            }
        })
    }
    //更多
    const More =()=>{
        setEcahrts(false)
        setAtype(true)
        // setAlarmType
        categoryList().then(res=>{
            if(res.msg === "success"){
                setAlarmType(res.data)
            }
        })
        setAlarmList([])
    }
    //报警类型back
    const back = ()=>{
        setEcahrts(true)
        setEvent(false)
        setAtype(false)
    }
    //点击类型
    const handleType = (item,index)=>{
        setSpinning(true)
        setAname(item.type_name)
        setCount(index)
        setEvent(true)
        setAtype(false)
        infoInfoList({device_category_name:item.category_name}).then(res=>{
            if(res.msg === "success"){
                setRecordNum(res.data.length)
                setAlarmList(res.data)
                setSpinning(false)
            }
        })
    }
    //操作
    const caozuo = (type,item)=>{
        setSpinning(true)
        infoUpdate({id:item.id,handle:type}).then(res=>{
            if(res.msg === "success"){
                message.success("操作成功")
                infoInfoList({device_category_name:item.device_category_name}).then(res=>{
                    if(res.msg === "success"){
                        setRecordNum(res.data.length)
                        setAlarmList(res.data)
                        setSpinning(false)
                    }
                })
            }else{
                message.error("操作失败")
            }
        })
    }
    const contentp =(item) => (
        <div className="popoverContent">
        <p onClick={()=>caozuo("1",item)}>确认</p>
        <p onClick={()=>caozuo("2",item)}>忽略</p>
      </div>
    )
    return (
        <div id="Alarm">
            {
                show?<div className="alarm_content animate_speed animate__animated animate__fadeInRight">
                    <div className="alarm_header">
                        <h1>报警统计</h1>
                        <img src={require("../../assets/images/closeBtn.png").default} alt="" onClick={()=>setShow(false)} />
                    </div>

                    <Spin spinning={spinning} tip="数据加载中...">
                        <div className="alarm_r_content">
                            {
                                showEcharts?<div className="alarmEcharts"> {/* 报警统计数字图表 */}
                                    <div className="alarm_echarts">
                                        <div className="alarm_little">
                                            <img src={require("../../assets/images/jiaobiao.png").default} alt=""/>
                                            <span>七日内报警趋势</span>
                                        </div>
                                        <div id="main"></div>
                                    </div>
                                    <div className="total_little">
                                        <img src={require("../../assets/images/jiaobiao.png").default} alt=""/>
                                        <span>设备报警统计</span>
                                    </div>
                                    {
                                        totals.length>0?<div className="total_number">
                                            <div className="allAlarm"><span className="font-family number">{totals[3].count}次</span><span className="total_s_title">{totals[3].category_name}</span></div>
                                            <div className="cameraTotal totalItem" onClick={()=>More()}><span className="font-family number">{totals[0].count}次</span><span className="total_s_title">{totals[0].device_category_name}</span></div>
                                            <div className="intercomTotal totalItem" onClick={()=>More()}><span className="font-family number">{totals[2].count}次</span><span className="total_s_title">{totals[2].category_name}</span></div>
                                            <div className="doorTotal totalItem" onClick={()=>More()}><span className="font-family number">{totals[1].count}次</span><span className="total_s_title">{totals[1].category_name}</span></div>
                                            <div className="firefightingTotal" onClick={()=>More()}><img src={require("../../assets/images/qita.png").default} alt=""/></div>
                                        </div>:null
                                    }
                                    
                                </div>:null
                            }
                            {
                                showAtype?<div className="alarmType">
                                    <div className="type_title">
                                        <div className="left">
                                            <img src={require("../../assets/images/jiaobiao.png").default} alt=""/>
                                            <span>设备类型</span>
                                        </div>
                                        <img src={require("../../assets/images/back.png").default} alt="" className="img2" onClick={()=>back()}/>
                                    </div>
                                    <div className="alarm_type_content">
                                        <ul>
                                            {alarmTypelist.map((item,index) => {
                                                return (
                                                    <li key={index} className={count === index?"active":null} onClick={()=>handleType(item,index)}>{item.category_name}</li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>:null
                            }
                            {
                                showEvent?<div className="alarmEvent">
                                    <div className="event_title">
                                        <div className="left">
                                            <img src={require("../../assets/images/jiaobiao.png").default} alt=""/>
                                            <span>{alarmName}报警 （{recordNum}）</span>
                                        </div>
                                        <img src={require("../../assets/images/back.png").default} alt="" className="img2" onClick={()=>back()}/>
                                    </div>
                                    <div className="eventContent">
                                        <table>
                                            <thead><tr><td>类型</td><td>名称</td><td>时间</td><td>处理</td></tr></thead>
                                            <tbody>
                                                {
                                                    alarmEventlist.length > 0?alarmEventlist.map((ele,index)=>{
                                                        return(
                                                            <tr key={index}>
                                                                <td title={ele.event_type_name}>{ele.event_type_name}</td>
                                                                <td title={ele.device_type_name}>{ele.device_type_name}</td>
                                                                <td title={timeFormat(ele.start_time)}>{timeFormat(ele.start_time)}</td>
                                                                {
                                                                    ele.handle === 0?<Popover content={contentp(ele)} title="操作"><td className="noChuli" style={{cursor:"pointer"}}>未处理</td></Popover>:<td className="chuli">已处理</td>
                                                                }
                                                                
                                                            </tr>
                                                        )
                                                    }):<Empty style={{marginTop:"100px"}} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" /> 
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>:null
                            }
                        </div>
                    </Spin>
                </div>:<div className="alarm_button" onClick={()=>{setShow(!show);getAlarm_count()}}>
                    <span>报警</span>
                </div>
            }
        </div>
    ) 
}

export default Alarm;
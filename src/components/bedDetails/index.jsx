import React, { useState, useEffect } from 'react';
import { GKBedInformationRoom } from '../../api/mainApi';
import { p_url as purl } from '../../api/address';
import './style.scss';

const BedDetails = (props) => {
    const [show, setShow] = useState(false)//列表
    const [show2, setShow2] = useState(false)//列表详情
    const [count, setCount] = useState()
    const [isClicked, setClicked] = useState(false)
    const [bedList, setbedList] = useState([])
    const [details, setDetails] = useState([
        { type: "img", value: "" },
        { type: "罪犯编号", value: "" },
        { type: "罪犯姓名", value: "" },
        { type: "罪犯所在监区", value: "" },
        { type: "罪名", value: "" },
        { type: "主刑", value: "" },
        { type: "原判刑期", value: "" },
        { type: "余刑", value: "" },
        { type: "案别", value: "" },
        { type: "入监日期", value: "" },
        { type: "性别", value: "" },
        { type: "罪犯年龄", value: "" },
        { type: "民族", value: "" },
        { type: "袭警史", value: "" },
        { type: "自杀史", value: "" },
        { type: "逃脱史", value: "" },
        { type: "吸毒史", value: "" },
        { type: "涉恶", value: "" },
        { type: "涉枪", value: "" },
        { type: "涉毒", value: "" },
        { type: "累犯", value: "" },
        { type: "惯犯", value: "" },
        { type: "是否限制减刑", value: "" },
        { type: "犯罪事实", value: "" },
        { type: "刑期变动", value: "" },
        { type: "其他罪名", value: "" },
        { type: "前科次数", value: "" },
        { type: "籍贯", value: "" },
        { type: "户籍", value: "" },
        { type: "捕前职业", value: "" },
        { type: "文化程度", value: "" },
        { type: "监舍号", value: "" },
        { type: "床位号", value: "" },
    ])

    useEffect(() => {
        if (props.msgdata) {
            setShow(true)
            GKBedInformationRoom({ num: props.msgdata.room_code }).then(res => {
                if (res.msg === "success") {
                    setbedList(res.list)
                }
            })
        }
    }, [props])
    const checkBedDetails = (type,data,index) => {
        
        if(type === 1){
            setClicked(true)
        }else{
            setClicked(false)
        }
        setDetails([
            { type: "img", value: data.PHOTO_URL },
            { type: "罪犯编号", value: data.CRIMID },
            { type: "罪犯姓名", value: data.CRIMNAME },
            { type: "罪犯所在监区", value: data.CRIMBRANCHARENAME },
            { type: "罪名", value: data.CRIMCAUSEACTION },
            { type: "主刑", value: data.ZHUXINGSTR },
            { type: "原判刑期", value: data.YUANPANXINGQI },
            { type: "余刑", value: data.YUXING },
            { type: "案别", value: data.ANBIE },
            { type: "入监日期", value: data.RUJIANRIQI },
            { type: "性别", value: data.CRIMSEX },
            { type: "罪犯年龄", value: data.CRIMAGE },
            { type: "民族", value: data.CRIMNACTION },
            { type: "袭警史", value: data.XIJINGSHI },
            { type: "自杀史", value: data.ZISHASHI },
            { type: "逃脱史", value: data.TAOTUOSHI },
            { type: "吸毒史", value: data.XIDUSHI },
            { type: "涉恶", value: data.SHEE },
            { type: "涉枪", value: data.SHEQIANG },
            { type: "涉毒", value: data.SHEDU },
            { type: "累犯", value: data.LEIFAN },
            { type: "惯犯", value: data.GUANFAN },
            { type: "是否限制减刑", value: data.XIANZHIJIANXING },
            { type: "犯罪事实", value: data.FANZUISHISHI },
            { type: "刑期变动", value: data.XINGQIBIANDONG },
            { type: "其他罪名", value: data.QITAZUIMING },
            { type: "前科次数", value: data.QIANKECISHU },
            { type: "籍贯", value: data.JIGUAN },
            { type: "户籍", value: data.CRIMORIGIN },
            { type: "捕前职业", value: data.BUQIANZHIYE },
            { type: "文化程度", value: data.CRIMEDUCATION },
            { type: "监舍号", value: data.ROOM_NUM },
            { type: "床位号", value: data.BED_NUM }
        ])
        setCount(index)
        setShow2(true)
    }
    return (
        <>
            {
                show ? <div id="bed">
                    <div className="bedList">
                        <div className="bl_header">
                            <h2>犯罪人员列表</h2>
                            <span className="bedRoom">{props.msgdata.room_name}</span>
                            <img className="closeImg" src={require('../../assets/images/cha.png').default} alt="" onClick={() => setShow(false)} />
                        </div>
                        <div className="bl_content">
                            <ul>
                                {bedList.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <div className={count === index ? "active findDetails name_and_num" : "findDetails name_and_num"}
                                            onMouseEnter={() => {if(!isClicked){checkBedDetails(2,item, index)}}}
                                            onMouseLeave={() => {if(!isClicked){setCount();setShow2(false)}}}
                                            onClick={() => checkBedDetails(1,item, index)}>
                                                <p>罪犯姓名：<span>{item.CRIMNAME}</span></p>
                                                <p>罪犯编号：<span>{item.CRIMID}</span></p>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    {
                        show2 ? <div className="bedDetails">
                            <div className="bd_header">
                                <div className="header_left">
                                    <img className="closeImg" src={require('../../assets/images/user_hh.png').default} alt="userImg" />
                                    <span>人员信息</span>
                                </div>
                                <img className="closeImg" src={require('../../assets/images/cha.png').default} alt="" onClick={() =>{setCount(); setShow2(false); setClicked(false)}} />
                            </div>
                            <div className="bd_content">
                                <ul>
                                    {details.map((item, index) => {
                                        return (
                                            <li key={index} title={item.value}>
                                                {
                                                    item.type === "img" ? <div className="prisonerPhoto">
                                                        <img src={item.value.replace("http://10.0.176.10:8081",purl)} alt="犯人图片" />
                                                    </div>
                                                    :
                                                    <>
                                                        <span className="bd_type">{item.type}：</span>
                                                        <span className="bd_data">{item.value}</span>
                                                    </>
                                                }
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div> : null
                    }
                </div> : null
            }
        </>
    )
}

export default React.memo(BedDetails);

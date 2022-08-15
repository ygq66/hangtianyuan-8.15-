import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { Tree, Empty, Spin } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';
import { Model } from '../../../utils/map3d';
import { useMappedState } from 'redux-react-hook';
import { Cameratotal, Treetotal, cameraList_S, infoListS } from '../../../api/mainApi';
import { Common } from '../../../utils/mapMethods'
// 引入 ECharts 主模块
import * as echarts from 'echarts';
import './style.scss';

const ResourceAtlas = (props) => {
    const mp_light = useMappedState(state => state.map3d_light);
    const [TCread, Yuter] = useState(false)
    const [devicelist, setdevice] = useState([])
    const devicelistTree = [require("../../../assets/images/shexiangji-8.png").default, require("../../../assets/images/menjin2.png").default, require("../../../assets/images/duijiang-6.png").default, require("../../../assets/images/guangbo-6.png").default, require("../../../assets/images/baojingzhu-4.png").default]
    const [loadlist, Treestry] = useState([])
    //树图
    const [listobjLoadMain, setList] = useState();
    const [spinning, setSspinning] = useState(true)
    // const [kedrow,TreesIndex] = useState(0)
    // const [listobjLoadMaincopy,copysetList]=useState();
    //echarts数据
    const [Echartslist, Ecsty] = useState([])
    //调取气泡
    const getEcharts = useCallback((obj, type) => {
        //此种类气泡的显示
        if (type === "click") {
            Model.closeIcon(mp_light)
            if (obj.category_name === "摄像头") {
                cameraList_S({ device_code: "" }).then(res => {
                    if (res.msg === "success") {
                        Common.add_iconModel(0,res.data,mp_light)
                    }
                })
            } else {
                infoListS({ category_id: obj.id }).then(res => {
                    if (res.msg === "success") {
                        Common.add_iconModel(0,res.data,mp_light)
                    }
                })
            }
        }

        //切换echarts
        var dd = Echartsoncheng(obj)
        var useEchartsData = dd || Echartslist
        const cokrmain = ["rgb(96,237,255)", "rgb(243,98,69)", "rgb(227,199,79)", "rgb(60,143,235)"];
        let totallist = 0, title, Echartmog = [];
        useEchartsData.children !== undefined && useEchartsData.children.length > 0 ? Echartmog = useEchartsData.children : Echartmog.push(useEchartsData);
        Echartmog.forEach(element => {
            totallist += element.value;
        });
        title = useEchartsData.name;
        const optionrate = {
            title: [{
                text: `{val| ${totallist} }+\n{name| ${title}}`,//\n{name|' + title + '}
                top: 'center',
                left: 'center',
                textStyle: {
                    rich: {
                        val: {
                            fontSize: 26,
                            fontWeight: 'bold',
                            color: 'rgb(96,237,255)',
                        },
                        name: {
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: 'white',
                            padding: [10, 0]
                        }
                    }
                }
            }],

            series: [
                {
                    type: 'pie',
                    radius: ['40%', '60%'],
                    data: Echartmog,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return cokrmain[params.dataIndex]
                            }
                        }
                    }
                }
            ]
        };
        if (document.getElementById("chartRate") !== null) {
            const rateChart = echarts.init(document.getElementById("chartRate"));
            rateChart.setOption(optionrate);
        }
        // eslint-disable-next-line
    }, [mp_light, Echartslist])

    useEffect(() => {
        post_Organization_list();
        // eslint-disable-next-line
    }, [])

    //设备类型数量
    const get_echarts_list = (ndata) => {
        Cameratotal().then(res => {
            if (res.msg === "success") {
                setdevice(res.data)
                res.data.forEach(element => {
                    if (element.id === "10001") {
                        getEcharts(element, res.data)
                        // Echartsoncheng(element)
                    }
                    ndata[0].children.unshift(element)
                });
                let listarry = []
                antdTree(ndata, listarry)
                Treestry(listarry);
                setSspinning(false)
            }
        })
    }

    //组织机构
    const post_Organization_list = () => {
        // let dalist=[];
        let data = { category_id: "" }
        Treetotal(data).then(res => {
            if (res.msg === "success") {
                setList(res.data)
                get_echarts_list(res.data)
                // listobjLoadMaincopy=[...res.data]
            }
        })
    }

    //antd树菜单
    function antdTree(list, objstr) {
        if (Array.isArray(list) && list.length > 0) {
            list.forEach(function (v, i) {
                let tit;
                Array.isArray(v.count) ? tit = v.region_name : tit = v.category_name + "......(" + v.count + ")";
                objstr[i] = {};
                objstr[i].title = tit;
                objstr[i].key = v.id;
                let arr = [];
                if (v.node_type === "group") { antdTree(v.children, arr) }
                objstr[i].children = arr;
            });
        }
    }
    //树形图
    function generateModelMenu(menuObjStr) {
        let vdom = [];
        if (menuObjStr != null) {
            if (menuObjStr instanceof Array) {
                let list = [];
                for (var item of menuObjStr) {

                    if (item.region_name.indexOf('F') > -1) {
                        list.push(generateModelMenu(item, menuObjStr));
                    } else {
                        list.push(generateModelMenu(item, menuObjStr));
                    }
                }
                vdom.push(<ul key="single" className="hhccc">{list}</ul>)
            } else {
                vdom.push(
                    <li key={menuObjStr.id} className="treechilder">
                        <div className="tree_childer_model">
                            <span className="tit_spans">{menuObjStr.region_name}</span>
                            <div className="tree_childer_model_spanR">{menuObjStr.count.map((item, key) => {
                                return (<span>{item.category_name}:{item.number}</span>)
                            })}</div></div>
                        {generateModelMenu(menuObjStr.children)}
                    </li>
                );
            }
        }
        return vdom;
    }
    //Echarts切换
    function Echartsoncheng(obj) {
        let str, strchild;
        str = { name: obj.category_name, value: parseInt(obj.count), children: [] }
        if (obj.children instanceof Array) {
            obj.children.forEach(element => {
                strchild = { name: element.type_name, value: parseInt(element.count) }
                str.children.push(strchild)
            });
        }
        Ecsty(str);
        return str;
    }
    //资源图谱显示隐藏
    function ResourceList() {
        let ndd2 = []
        listobjLoadMain[0].children.forEach(element => {
            if (element.region_name) {
                ndd2.push(element)
            }
        });
        listobjLoadMain[0].children = ndd2
        setList(listobjLoadMain)
        Yuter(!TCread)
    }

    return (
        <div id="ResourceAtlas" className="ResourceAtlas">
            <div className="ResourceAtlas_top">
                <h1>资源图谱</h1>
                <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={() => { props.close(); Model.closeIcon(mp_light) }} />
            </div>
            <div className="ResourceAtlas_list">
                <Spin spinning={spinning} tip="加载中...">
                    <div className="ResourceAtlas_list_top">
                        <ul>
                            {devicelist.map((item, index) => (
                                <li key={index} onClick={() => getEcharts(item, 'click')}><span>{item.count}</span><span>{item.category_name}</span></li>
                            ))}
                        </ul>
                        <div id="chartRate"></div>
                    </div>
                </Spin>
                <div className="ResourceAtlas_list_bottom">
                    <span className="ResourceAtlas_list_bottom_Pdfbt">导出PDF报表</span><span className="ResourceAtlas_list_bottom_Pdfbt" onClick={() => ResourceList()}>资源图谱</span>
                    <div className="ListTree">

                        {/* {generateMenu(loadlist)} */}

                        <Spin spinning={spinning} tip="加载中...">
                            {
                                loadlist.length > 0 ? <Tree
                                    className="carmeTree"
                                    defaultExpandAll
                                    showLine={{ showLeafIcon: false }}
                                    switcherIcon={<CaretDownFilled style={{ fontSize: "18px", marginRight: "-8px", marginTop: "2px" }} />}
                                    // defaultExpandedKeys={['41C95B17B2043748EE4945902A0FF4EC']}
                                    treeData={loadlist}
                                //showLeafIcon={false}
                                //switcherIcon={false}
                                ></Tree> : null
                            }
                        </Spin>
                    </div>
                </div>
            </div>

            {TCread ? <div className="ResourceAtlas_TC">
                <div className="ResourceAtlas_TC_title">
                    <h1>资源图谱</h1>
                    <img src={require("../../../assets/images/closeBtn.png").default} className="Climg" alt="" onClick={() => ResourceList()} />
                </div>
                <div className="shebei_total">
                    <ul>
                        {devicelist.map((item, index) => (
                            <li key={index}><i></i><img src={devicelistTree[index]} alt=""></img><div className="ResourceAtlas_TC_title_txt"><span>{item.count}</span><span>{item.category_name}</span></div><i></i></li>
                        ))}
                    </ul>
                </div>
                <div className="project_name">
                    <span >{listobjLoadMain[0].region_name}</span>
                </div>
                <div className="ResourceAtlas_TC_model">
                    <div className="ResourceAtlas_TC_left">
                        {
                            listobjLoadMain[0].children.length > 1 ? <Fragment>
                                <div className="ResourceAtlas_TC_left_tit tree_childer_model"><span className="tit_spans">{listobjLoadMain[0].children[1].region_name}</span><div className="tree_childer_model_spanR">{listobjLoadMain[0].children[0].count.map((item, key) => {
                                    return (<span>{item.category_name}:{item.number}</span>)
                                })}</div></div>
                                {generateModelMenu(listobjLoadMain[0].children[1].children, '')}
                            </Fragment> : <Empty style={{ marginTop: "80px" }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
                        }
                    </div>
                    <div className="ResourceAtlas_TC_right">
                        <div className="ResourceAtlas_TC_right_tit tree_childer_model"><span className="tit_spans">{listobjLoadMain[0].children[0].region_name}</span><div className="tree_childer_model_spanR">{listobjLoadMain[0].children[0].count.map((item, key) => {
                            return (<span>{item.category_name}:{item.number}</span>)
                        })}</div></div>
                        {generateModelMenu(listobjLoadMain[0].children[0].children, '')}
                    </div>
                </div>
            </div> : ""}
        </div>
    )
}
export default ResourceAtlas;
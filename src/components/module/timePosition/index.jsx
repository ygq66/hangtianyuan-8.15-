import React from 'react';
import "./style.scss"
class TimePosition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default },
                { text: "俊俏的小怪物", img_tx: require("../../../assets/images/touxiang.png").default }
            ]
        }
    }
    render() {
        const { list } = this.state;
        return (
            <div className="TimePosition">
                <div className="TimePosition_top">
                    <img src={require("../../../assets/images/closeBtn.png").default} alt="" onClick={()=>this.props.close()} />
                </div>
                <div className="TimePosition_list">
                    <ul>
                        {list.map((item, index) => {
                            return (
                                <li key={index}>
                                    <img className="TimePosition_list_tx" src={item.img_tx} alt="" />
                                    <div className="TimePosition_list_div">
                                        <span>{item.text}</span>
                                        <div>
                                            <img src={require("../../../assets/images/zhuizong-icon.png").default} alt="" />
                                            <img src={require("../../../assets/images/guiji-icon.png").default} alt="" />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}

                    </ul>
                </div>
            </div>
        )
    }
}
export default TimePosition;
import axios from 'axios'

var virtualization = {
    SWBuild: [],
    view3d: null,
    type: "get",
    allPolygon: [],
    getPolygon(parameter) {
        const that = this;
        console.log(parameter, 'url')
        axios.post(parameter.url, {
            category_id: ""
        }).then((res) => {
            if (res.data.msg === "success") {
                that.view3d = parameter.view3d;
                that.view3d.OverLayerRemoveAll();
                // that.view3d.OverLayerStopEdit();
                res.data.data.forEach(element => {
                    that.setPolygon(element);
                })
                setTimeout(() => {
                    that.SWBuildBtn(that.SWBuild);
                }, 1000)
            }
        })
    },
    setPolygon(item) {
        if (item.floor_num !== 0 && item.height === 0) {
            for (let i = 0; i <= item.floor_num; i++) {
                let obj = {
                    ...item,
                    floor_num: i
                }
                this.SWBuild.push(obj);
            }
        } else {
            if (item.grid_name.indexOf("SWJZ") >= 0) {
                this.createPolygon(item, 50, "SWJZ_Face", "SWJZ_line"); //室外建筑
            } else if (item.grid_name.indexOf("SX") >= 0) {
                this.createPolygon(item, 20, "SX_Face", "SX_line"); //水系
            } else if (item.grid_name.indexOf("CRK") >= 0) {
                this.createPolygon(item, 40, "CRK_Face", "CRK_line"); //出入口
            } else if (item.grid_name.indexOf("ZL") >= 0) {
                this.createPolygon(item, 30, "ZL_Face", "ZL_line"); //主路
            } else if (item.grid_name.indexOf("XL") >= 0) {
                this.createPolygon(item, 30, "XL_Face", "XL_line"); //小路
            } else if (item.grid_name === "Grid") {
                this.createPolygon(item, 50, "QJ_Face", "QJ_line"); //小路
            } else if (item.grid_name.indexOf("#") >= 0) {
                var face = "SWJZ_Face";
                var line = "SWJZ_line";
                switch (item.typeNme) {
                    case "3":
                        face = "FJ_Face";
                        line = "FJ_line";
                        break;
                    case "4":
                        face = "DT_Face";
                        line = "DT_line";
                        break;
                    case "5":
                        face = "LT_Face";
                        line = "LT_line";
                        break;
                    default:
                        break
                }
                this.createPolygon(item, 10, face, line); //室内
            }
        }
    },
    createPolygon(item, width, style, linestyle) {
        let coordinates = [];
        let h = 400;
        if (item.height === 0) {
            h = h + item.height * 100;
            h = h + item.level;
            h = h + item.floor_num * 400;
        } else {
            h = h + item.height;
        }
        item.geom.coordinates[0].forEach(element => {
            let json = {
                x: element[0] * 100,
                y: -(element[1] * 100),
                z: h
            }
            coordinates.push(json)
        })
        const obj = {
            gid: item.real_name,
            type: 'polygon',
            // color: item.grid_style.wgColor ? item.grid_style.wgColor : '#00ff00',
            points: coordinates,
            attr: item,
            linewidth: width,
            linestyle: linestyle,
            style: style
        };
        this.view3d.OverLayerCreateObject(obj);
    },
    SWBuildBtn(obj) {
        obj.forEach(item => {
            this.createPolygon(item, 50, "SWJZ_Face", "SWJZ_line");
        })
    },

}

export default virtualization;
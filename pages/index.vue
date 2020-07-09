<!--
 * @Description: 首页组件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 13:36:12
 -->
<template>
    <div class="home" id="home" name="home">
        <!-- 轮播图 -->
        <div class="block">
            <el-carousel height="460px">
                <el-carousel-item v-for="item in carousel" :key="item.carousel_id">
                    <img style="height:460px;" :src="$target + item.imgPath" :alt="item.describes" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- 轮播图END -->
        <div class="main-box">
            <div class="main">
                <!-- 手机商品展示区域 -->
                <div class="phone">
                    <div class="box-hd">
                        <div class="title">手机</div>
                    </div>
                    <div class="box-bd">
                        <div class="promo-list">
                            <nuxt-link to>
                                <img :src="$target +'public/imgs/phone/phone.png'" />
                            </nuxt-link>
                        </div>
                        <div class="list">
                            <MyList :list="phoneList" :isMore="true"></MyList>
                        </div>
                    </div>
                </div>
                <!-- 手机商品展示区域END -->

                <!-- 家电商品展示区域 -->
                <div class="appliance" id="promo-menu">
                    <div class="box-hd">
                        <div class="title">家电</div>
                        <div class="more" id="more">
                            <MyMenu :val="2" @fromChild="getChildMsg">
                                <span slot="1">热门</span>
                                <span slot="2">电视影音</span>
                            </MyMenu>
                        </div>
                    </div>
                    <div class="box-bd">
                        <div class="promo-list">
                            <ul>
                                <li>
                                    <img
                                        :src="$target +'public/imgs/appliance/appliance-promo1.png'"
                                    />
                                </li>
                                <li>
                                    <img
                                        :src="$target +'public/imgs/appliance/appliance-promo2.png'"
                                    />
                                </li>
                            </ul>
                        </div>
                        <div class="list">
                            <MyList :list="applianceList" :isMore="true"></MyList>
                        </div>
                    </div>
                </div>
                <!-- 家电商品展示区域END -->

                <!-- 配件商品展示区域 -->
                <div class="accessory" id="promo-menu">
                    <div class="box-hd">
                        <div class="title">配件</div>
                        <div class="more" id="more">
                            <MyMenu :val="3" @fromChild="getChildMsg2">
                                <span slot="1">热门</span>
                                <span slot="2">保护套</span>
                                <span slot="3">充电器</span>
                            </MyMenu>
                        </div>
                    </div>
                    <div class="box-bd">
                        <div class="promo-list">
                            <ul>
                                <li>
                                    <img
                                        :src="$target +'public/imgs/accessory/accessory-promo1.png'"
                                        alt
                                    />
                                </li>
                                <li>
                                    <img
                                        :src="$target +'public/imgs/accessory/accessory-promo2.png'"
                                        alt
                                    />
                                </li>
                            </ul>
                        </div>
                        <div class="list">
                            <MyList :list="accessoryList" :isMore="true"></MyList>
                        </div>
                    </div>
                </div>
                <!-- 配件商品展示区域END -->
            </div>
        </div>
    </div>
</template>
<script>
import service from "@/utils/axios";
import MyList from "@/components/MyList";
import MyMenu from "@/components/MyMenu";
export default {
    components: {
        MyList,
        MyMenu
    },
    data() {
        return {
            carousel: [], // 轮播图数据
            phoneList: [], // 手机商品列表
            miTvList: [], // 小米电视商品列表
            applianceList: [], // 家电商品列表
            applianceHotList: [], //热门家电商品列表
            accessoryList: [], //配件商品列表
            accessoryHotList: [], //热门配件商品列表
            protectingShellList: [], // 保护套商品列表
            chargerList: [], //充电器商品列表
            applianceActive: 1, // 家电当前选中的商品分类
            accessoryActive: 1 // 配件当前选中的商品分类
        };
    },
    async asyncData(obj) {
        let carousel = [];
        let res = await service.post("/resources/carousel"); // http://47.115.85.237:3000
        return {
            carousel: res.data.carousel
        }
    },
    watch: {
        // 家电当前选中的商品分类，响应不同的商品数据
        applianceActive: function(val) {
            // 页面初始化的时候把applianceHotList(热门家电商品列表)直接赋值给applianceList(家电商品列表)
            // 所以在切换商品列表时判断applianceHotList是否为空,为空则是第一次切换,把applianceList赋值给applianceHotList
            if (this.applianceHotList == "") {
                this.applianceHotList = this.applianceList;
            }
            if (val == 1) {
                // 1为热门商品
                this.applianceList = this.applianceHotList;
                return;
            }
            if (val == 2) {
                // 2为电视商品
                this.applianceList = this.miTvList;
                return;
            }
        },
        accessoryActive: function(val) {
            // 页面初始化的时候把accessoryHotList(热门配件商品列表)直接赋值给accessoryList(配件商品列表)
            // 所以在切换商品列表时判断accessoryHotList是否为空,为空则是第一次切换,把accessoryList赋值给accessoryHotList
            if (this.accessoryHotList == "") {
                this.accessoryHotList = this.accessoryList;
            }
            if (val == 1) {
                // 1为热门商品
                this.accessoryList = this.accessoryHotList;
                return;
            }
            if (val == 2) {
                // 2为保护套商品
                this.accessoryList = this.protectingShellList;
                return;
            }
            if (val == 3) {
                //3 为充电器商品
                this.accessoryList = this.chargerList;
                return;
            }
        }
    },
    created() {
        // 获取轮播图数据
        // service
        //     .post("/resources/carousel", {})
        //     .then(res => {
        //         this.carousel = res.data.carousel;
        //     })
        //     .catch(err => {
        //         return Promise.reject(err);
        //     });
        // 获取各类商品数据
        this.getPromo("手机", "phoneList");
        this.getPromo("电视机", "miTvList");
        this.getPromo("保护套", "protectingShellList");
        this.getPromo("充电器", "chargerList");
        this.getPromo(
            ["电视机", "空调", "洗衣机"],
            "applianceList",
            "/product/getHotProduct"
        );
        this.getPromo(
            ["保护套", "保护膜", "充电器", "充电宝"],
            "accessoryList",
            "/product/getHotProduct"
        );
        // service.post("https://uccsoft.cn/api/api-seller/seller/slShopInfo/getByAppId", {appId: 'wx71811f13488f52b5'}).then(res => {
        //     //console.log(res, 'appId')
        //     console.log('请求成功')
        // })
    },
    methods: {
        // 获取家电模块子组件传过来的数据
        getChildMsg(val) {
            this.applianceActive = val;
        },
        // 获取配件模块子组件传过来的数据
        getChildMsg2(val) {
            this.accessoryActive = val;
        },
        // 获取各类商品数据方法封装
        getPromo(categoryName, val, api) {
            api = api != undefined ? api : "/product/getPromoProduct";
            return service.post(api, {
                    categoryName
                })
                .then(res => {
                    this[val] = res.data.Product;
                })
                .catch(err => {
                    return Promise.reject(err);
                });
        }
    }
};
</script>
<style scoped>
/*
 * @Description: 首页css样式
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 00:46:58
 */

.main-box {
    background-color: #f5f5f5;
    padding-bottom: 20px;
}

.main {
    margin: 0 auto;
    max-width: 1225px;
}

/* 轮播图CSS */
.block {
    margin: 0 auto;
    max-width: 1225px;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

/* 轮播图CSS END */

.box-hd {
    height: 58px;
    margin: 20px 0 0 0;
}

.box-hd .title {
    float: left;
    font-size: 22px;
    font-weight: 200;
    line-height: 58px;
    color: #333;
}

.box-hd .more {
    float: right;
}

.box-hd .more a {
    font-size: 16px;
    line-height: 58px;
    color: #424242;
}

.box-hd .more a:hover {
    color: #ff6700;
}

.box-bd {
    height: 615px;
}

.box-bd .promo-list {
    float: left;
    height: 615px;
    width: 234px;
}

.box-bd .promo-list li {
    z-index: 1;
    width: 234px;
    height: 300px;
    margin-bottom: 14.5px;
    -webkit-transition: all 0.2s linear;
    transition: all 0.2s linear;
}

.box-bd .promo-list li:hover {
    z-index: 2;
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0);
}

.box-bd .promo-list li img {
    width: 234px;
    height: 300px;
}

.box-bd .promo-list img {
    width: 234px;
}

.box-bd .list {
    float: left;
    height: 615px;
    width: 991px;
}
</style>
<template>
    <div>
        <!-- <Nuxt /> -->
        <el-container>
            <!-- 顶部导航栏 -->
            <div class="topbar">
                <div class="nav">
                    <ul>
                        <li v-if="!$store.getters.getUser">
                            <el-button type="text" @click="login">登录</el-button>
                            <span class="sep">|</span>
                            <el-button type="text" @click="register = true">注册</el-button>
                        </li>
                        <li v-else>
                            欢迎
                            <el-popover placement="top" width="180" v-model="visible">
                                <p>确定退出登录吗？</p>
                                <div style="text-align: right; margin: 10px 0 0">
                                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                                    <el-button type="primary" size="mini" @click="logout">确定</el-button>
                                </div>
                                <el-button
                                    type="text"
                                    slot="reference"
                                >{{$store.getters.getUser.userName}}</el-button>
                            </el-popover>
                        </li>
                        <li>
                            <nuxt-link to="/order">我的订单</nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/collect" target="_blank">我的收藏</nuxt-link>
                        </li>
                        <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
                            <nuxt-link to="/shoppingCart">
                                <i class="el-icon-shopping-cart-full"></i> 购物车
                                <span class="num">({{getNum}})</span>
                            </nuxt-link>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 顶部导航栏END -->

            <!-- 顶栏容器 -->
            <el-header>
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    active-text-color="#409eff"
                    router>
                    <div class="logo">
                        <nuxt-link to="/">
                            <img src="../assets/imgs/logo.png" alt />
                        </nuxt-link>
                    </div>
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/goods">全部商品</el-menu-item>
                    <el-menu-item index="/about">关于我们</el-menu-item>

                    <div class="so">
                        <el-input placeholder="请输入搜索内容" v-model="search">
                            <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
                        </el-input>
                    </div>
                </el-menu>
            </el-header>
            <!-- 顶栏容器END -->

            <!-- 登录模块 -->
            <MyLogin></MyLogin>
            <!-- 注册模块 -->
            <MyRegister :register="register" @fromChild="isRegister"></MyRegister>

            <!-- 主要区域容器 -->
            <el-main>
                <!-- <keep-alive>
                    <router-view></router-view>
                </keep-alive> -->
                <Nuxt />
            </el-main>
            <!-- 主要区域容器END -->

            <!-- 底栏容器 -->
            <el-footer>
                <div class="footer">
                    <div class="ng-promise-box">
                        <div class="ng-promise">
                            <p class="text">
                                <a class="icon1" href="javascript:;">7天无理由退换货</a>
                                <a class="icon2" href="javascript:;">满99元全场免邮</a>
                                <a
                                    class="icon3"
                                    style="margin-right: 0"
                                    href="javascript:;"
                                >100%品质保证</a>
                            </p>
                        </div>
                    </div>
                    <div class="github">
                        <a href="https://github.com/hai-27/vue-store" target="_blank">
                            <div class="github-but"></div>
                        </a>
                    </div>
                    <div class="mod_help">
                        <p>
                            <nuxt-link to="/">首页</nuxt-link>
                            <span>|</span>
                            <nuxt-link to="/goods">全部商品</nuxt-link>
                            <span>|</span>
                            <nuxt-link to="/about">关于我们</nuxt-link>
                        </p>
                        <p class="coty">商城版权所有 &copy; 2012-2021</p>
                    </div>
                </div>
            </el-footer>
            <!-- 底栏容器END -->
        </el-container>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
    beforeUpdate() {
        this.activeIndex = this.$route.path;
    },
    data() {
        return {
            activeIndex: "", // 头部导航栏选中的标签
            search: "", // 搜索条件
            register: false, // 是否显示注册组件
            visible: false // 是否退出登录
        };
    },
    mounted() {
        // 获取浏览器localStorage，判断用户是否已经登录
        if (localStorage.getItem("user")) {
            // 如果已经登录，设置vuex登录状态
            this.setUser(JSON.parse(localStorage.getItem("user")));
        }
        /* window.setTimeout(() => {
      this.$message({
        duration: 0,
        showClose: true,
        message: `
        <p>如果觉得这个项目还不错，</p>
        <p style="padding:10px 0">您可以给项目源代码仓库点Star支持一下，谢谢！</p>
        <p><a href="https://github.com/hai-27/vue-store" target="_blank">Github传送门</a></p>`,
        dangerouslyUseHTMLString: true,
        type: "success"
      });
    }, 1000 * 60); */
    },
    computed: {
        ...mapGetters(["getUser", "getNum"])
    },
    watch: {
        // 获取vuex的登录状态
        getUser: function(val) {
            if (val === "") {
                // 用户没有登录
                this.setShoppingCart([]);
            } else {
                // 用户已经登录,获取该用户的购物车信息
                this.$axios
                    .post("/api/user/shoppingCart/getShoppingCart", {
                        user_id: val.user_id
                    })
                    .then(res => {
                        if (res.data.code === "001") {
                            // 001 为成功, 更新vuex购物车状态
                            this.setShoppingCart(res.data.shoppingCartData);
                        } else {
                            // 提示失败信息
                            this.notifyError(res.data.msg);
                        }
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }
        }
    },
    methods: {
        ...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
        login() {
            // 点击登录按钮, 通过更改vuex的showLogin值显示登录组件
            this.setShowLogin(true);
        },
        // 退出登录
        logout() {
            this.visible = false;
            // 清空本地登录信息
            localStorage.setItem("user", "");
            // 清空vuex登录信息
            this.setUser("");
            this.notifySucceed("成功退出登录");
        },
        // 接收注册子组件传过来的数据
        isRegister(val) {
            this.register = val;
        },
        // 点击搜索按钮
        searchClick() {
            if (this.search != "") {
                // 跳转到全部商品页面,并传递搜索条件
                this.$router.push({
                    path: "/goods",
                    query: { search: this.search }
                });
                this.search = "";
            }
        }
    }
};
</script>

<template>
    <div class="layout-topbar">
        <div class="topbar-left">
            <a tabindex="0" class="menu-button" @click="onMenuButtonClick">
                <i class="pi pi-chevron-left"></i>
            </a>

            <router-link to="/" class="horizontal-logo">
                <img id="logo-horizontal" src="assets/layout/images/utribe-icon.png" alt="Utribe Wallet" />
            </router-link>

            <span class="topbar-separator"></span>
           
            <div class="layout-breadcrumb viewname" style="text-transform: uppercase">
                <template v-if="$route.meta.breadcrumb">
                    <span>{{$route.meta.breadcrumb[0].label}}</span>
                </template>
            </div>

            <img id="logo-mobile" class="mobile-logo" src="assets/layout/images/utribe-icon.png" alt="Utribe Wallet"  />
        </div>

        <AppMenu :model="menu" :layoutMode="layoutMode" :active="menuActive" :mobileMenuActive="staticMenuMobileActive"
                 @menu-click="onMenuClick" @menuitem-click="onMenuItemClick" @root-menuitem-click="onRootMenuItemClick"></AppMenu>

        <div class="layout-mask modal-in"></div>

        <div class="topbar-right">
            <ul class="topbar-menu">
                <li class="search-item">
                    <a tabindex="0" @click="onSearchClick">
                        <i class="pi pi-search"></i>
                    </a>
                </li>
                <li class="notifications-item" :class="{ 'active-menuitem ': topbarNotificationMenuActive }">
                    <a href="#" tabindex="0" @click="onTopbarNotificationMenuButtonClick">
                        <i class="pi pi-bell"></i>
                        <span class="topbar-badge">5</span>
                    </a>
                    <ul class="notifications-menu fade-in-up">
                        
                        <li role="menuitem">
                            <a href="#" tabindex="0">
                                <i class="pi pi-check-square"></i>
                                <div class="notification-item">
                                    <div class="notification-summary">Withdrawn Completed</div>
                                    <div class="notification-detail">Funds are on their way.</div>
                                </div>
                            </a>
                        </li>
                        <li role="menuitem">
                            <a href="#" tabindex="0">
                                <i class="pi pi-chart-line"></i>
                                <div class="notification-item">
                                    <div class="notification-summary">Monthly Reports</div>
                                    <div class="notification-detail">New reports are ready.</div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="profile-item" :class="{ 'active-menuitem fadeInDown': topbarUserMenuActive }">
                    <a href="#" @click="onTopbarUserMenuButtonClick">
                        <img src="assets/demo/images/avatar/profile.jpg" alt="diamond-layout" class="profile-image" />
                        <span class="profile-name">Amelia Stone</span>
                    </a>
                    <ul class="profile-menu fade-in-up">
                        <li>
                            <a href="#">
                                <i class="pi pi-user"></i>
                                <span>Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i class="pi pi-cog"></i>
                                <span>Settings</span>
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="right-sidebar-item">
                    <a href="#" tabindex="0" @click="onRightMenuClick">
                        <i class="pi pi-align-right"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import AppMenu from "./AppMenu";
export default {
    name: "AppTopbar",
    emits: ["menu-click", "menuitem-click", "root-menuitem-click", "menu-button-click", "search-click", "topbar-notification", "topbar-user-menu", "right-menubutton-click"],
    props: {
        topbarNotificationMenuActive: Boolean,
        topbarUserMenuActive: Boolean,
        layoutMode: String,
        menu: Array,
        menuActive: Boolean,
        staticMenuMobileActive: Boolean
    },
    data() {
        return {
            items: [],
        };
    },
    components: {
        AppMenu
    },
    unmounted() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    },
    methods: {
        onMenuClick(event) {
            this.$emit("menu-click", event);
        },
        onMenuItemClick(event) {
            this.$emit("menuitem-click", event);
        },
        onRootMenuItemClick(event) {
            this.$emit("root-menuitem-click", event);
        },
        onMenuButtonClick(event) {
            this.$emit("menu-button-click", event);
        },
        onSearchClick(event) {
            this.$emit("search-click", event);
        },
        onTopbarNotificationMenuButtonClick(event) {
            this.$emit("topbar-notification", event);
        },
        onTopbarUserMenuButtonClick(event) {
            this.$emit("topbar-user-menu", event);
        },
        onRightMenuClick(event) {
            this.$emit("right-menubutton-click", event);
        },
        isMobile() {
            return window.innerWidth <= 1091;
        }
    }
};
</script>

<template>
    <div :class="containerClass" :data-theme="colorScheme" @click="onDocumentClick($event)">
        <div class="layout-content-wrapper">
            <AppTopBar :topbarNotificationMenuActive="topbarNotificationMenuActive" :topbarUserMenuActive="topbarUserMenuActive"
                       :layoutMode="layoutMode" :menu="menu" :menuActive="menuActive" :staticMenuMobileActive='staticMenuMobileActive'
                       @menu-click="onMenuClick" @menuitem-click="onMenuItemClick" @root-menuitem-click="onRootMenuItemClick"
                       @menu-button-click="onMenuButtonClick" @search-click="toggleSearch" @topbar-notification="onTopbarNotificationMenuButtonClick"
                       @topbar-user-menu="onTopbarUserMenuButtonClick" @right-menu-click="onRightMenuButtonClick" @right-menubutton-click="onRightMenuButtonClick"></AppTopBar>

            <div class="layout-content">

                <div class="layout-breadcrumb viewname" style="text-transform: uppercase">
                    <template v-if="$route.meta.breadcrumb">
                        <span>{{$route.meta.breadcrumb[0].label}}</span>
                    </template>
                </div>

                <router-view/>
            </div>
            <AppFooter/>
        </div>

        <AppRightMenu :rightMenuActive="rightMenuActive" @right-menu-click="onRightMenuClick"></AppRightMenu>

        <AppConfig v-model:configActive="configActive" v-model:layoutMode="layoutMode" v-model:menuTheme="menuTheme" v-model:colorScheme="colorScheme" @config-click="onConfigClick" @config-button-click="onConfigButtonClick"></AppConfig>

        <AppSearch :searchActive="searchActive" @search-click="onSearchClick" @search-hide="onSearchHide"/>
    </div>
</template>

<script>
import EventBus from './event-bus';
import AppTopBar from "./AppTopbar";
import AppFooter from "./AppFooter";
import AppConfig from "./AppConfig";
import AppSearch from "./AppSearch";
import AppRightMenu from "./AppRightMenu";

export default {
    data() {
        return {
            menuActive: false,
            layoutMode: "slim",
            colorScheme: "light",
            menuTheme: "layout-sidebar-darkgray",
            overlayMenuActive: false,
            staticMenuDesktopInactive: false,
            staticMenuMobileActive: false,
            menuClick: false,
            searchActive: false,
            searchClick: false,
            userMenuClick: false,
            topbarUserMenuActive: false,
            notificationMenuClick: false,
            topbarNotificationMenuActive: false,
            rightMenuClick: false,
            rightMenuActive: false,
            configActive: false,
            configClick: false,
            menu: [
                {
                    label: "Home", icon: "pi pi-home",
                     items: [
                        {label: "Dashboard", icon: "pi pi-fw pi-home", to: "/"},
                        {label: "Wallet", icon: "pi pi-fw pi-wallet", to: "/wallet"},
                        
                    ],
                   
                },
                { separator: true },
                {
                    label: "Profile", icon: "pi pi-user pi-id-card",
                    items: [
                        {label: "My Profile", icon: "pi pi-fw pi-id-card", to: "/profile"},
                        {label: "Settings", icon: "pi pi-fw pi-comment", to: "/settings"},
                        
                    ],
                },
            ],
        };
    },
    computed: {
        containerClass() {
            return [
                "layout-wrapper",
                {
                    "layout-overlay": this.layoutMode === "overlay",
                    "layout-static": this.layoutMode === "static",
                    "layout-slim": this.layoutMode === "slim",
                    'layout-horizontal': this.layoutMode === 'horizontal',
                    "layout-sidebar-dim": this.colorScheme === "dim",
                    "layout-sidebar-dark": this.colorScheme === "dark",
                    "layout-overlay-active": this.overlayMenuActive,
                    "layout-mobile-active": this.staticMenuMobileActive,
                    "layout-static-inactive": this.staticMenuDesktopInactive && this.layoutMode === "static",
                    "p-input-filled": this.$primevue.config.inputStyle === "filled",
                    "p-ripple-disabled": !this.$primevue.config.ripple,
                },
                this.colorScheme === "light" ? this.menuTheme : "",
            ];
        },
    },
    components: {
        AppTopBar,
        AppFooter,
        AppConfig,
        AppSearch,
        AppRightMenu,
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        },
    },
    methods: {
        onDocumentClick() {
            if (!this.searchClick && this.searchActive) {
                this.onSearchHide();
            }

            if (!this.userMenuClick) {
                this.topbarUserMenuActive = false;
            }

            if (!this.notificationMenuClick) {
                this.topbarNotificationMenuActive = false;
            }

            if (!this.rightMenuClick) {
                this.rightMenuActive = false;
            }

            if (!this.menuClick) {
                if (this.isSlim() || this.isHorizontal()) {
					EventBus.emit('reset-active-index');
					this.menuActive = false;
                }

                if (this.overlayMenuActive || this.staticMenuMobileActive) {
                    this.hideOverlayMenu();
                }

                this.unblockBodyScroll();
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            this.searchClick = false;
            this.configClick = false;
            this.userMenuClick = false;
            this.rightMenuClick = false;
            this.notificationMenuClick = false;
            this.menuClick = false;
        },
        onMenuClick() {
            this.menuClick = true;
        },
        onMenuButtonClick(event) {
            this.menuClick = true;
            this.topbarUserMenuActive = false;
            this.topbarNotificationMenuActive = false;
            this.rightMenuActive = false;

            if (this.isOverlay()) {
                this.overlayMenuActive = !this.overlayMenuActive;
            }

            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
                if (this.staticMenuMobileActive) {
                    this.blockBodyScroll();
                } else {
                    this.unblockBodyScroll();
                }
            }

            event.preventDefault();
        },
        onMenuItemClick(event) {
			if (!event.item.items) {
				EventBus.emit('reset-active-index');
				this.hideOverlayMenu();
			}
			if (!event.item.items && (this.isSlim() || this.isHorizontal())) {
                this.menuActive = false;
            }
        },
		onRootMenuItemClick() {
            this.menuActive = !this.menuActive;
        },
        onTopbarUserMenuButtonClick(event) {
            this.userMenuClick = true;
            this.topbarUserMenuActive = !this.topbarUserMenuActive;

            this.hideOverlayMenu();

            event.preventDefault();
        },
        onTopbarNotificationMenuButtonClick(event) {
            this.notificationMenuClick = true;
            this.topbarNotificationMenuActive = !this.topbarNotificationMenuActive;

            this.hideOverlayMenu();

            event.preventDefault();
        },
        toggleSearch() {
            this.searchActive = !this.searchActive;
            this.searchClick = true;
        },
        onSearchClick() {
            this.searchClick = true;
        },
        onSearchHide() {
            this.searchActive = false;
            this.searchClick = false;
        },
        onRightMenuClick() {
			this.rightMenuClick = true;
		},
        onRightMenuButtonClick(event) {
			this.rightMenuClick = true;
			this.rightMenuActive = !this.rightMenuActive;
			this.hideOverlayMenu();
			event.preventDefault();
		},
        onConfigClick() {
            this.configClick = true;
        },
        onConfigButtonClick() {
            this.configActive = !this.configActive;
            this.configClick = true;
        },
        hideOverlayMenu() {
            this.overlayMenuActive = false;
            this.staticMenuMobileActive = false;
            this.unblockBodyScroll();
        },
        blockBodyScroll() {
            if (document.body.classList) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.className += ' blocked-scroll';
            }
        },
        unblockBodyScroll() {
            if (document.body.classList) {
                document.body.classList.remove('blocked-scroll');
            } else {
                document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                    'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        },
        isSlim() {
            return this.layoutMode === "slim";
        },
        isHorizontal() {
            return this.layoutMode === "horizontal";
        },
        isOverlay() {
            return this.layoutMode === "overlay";
        },
        isDesktop() {
            return window.innerWidth > 1091;
        }
    },
};
</script>

<style lang="scss">
@import "App.scss";
</style>

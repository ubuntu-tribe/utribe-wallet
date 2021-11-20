import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        exact: true,
        component: () => import('./components/Dashboard.vue'),
        meta: {
            breadcrumb: [{ parent: 'Dashboard', label: 'Dashboard' }],
        },
    },
    {
        path: '/wallet',
        name: 'wallet',
        component: () => import('./components/wallet.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utribe Wallet', label: 'Wallet' }],
        },
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('./components/profile.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utribe Wallet', label: 'Profile' }],
        },
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('./components/settings.vue'),
        meta: {
            breadcrumb: [{ parent: 'Utribe Wallet', label: 'Settings' }],
        },
    },
    //Torus redirect
    {
        path: '/torus/:login',
        name: 'torus',
        component: () => import('./components/torus.vue'),
        meta: {
            breadcrumb: [{ parent: 'Login', label: 'Login successfull' }],
        },
    },
    {
        path: '/result:id',
        name: 'result',
        component: () => import('./components/torus.vue'),
        meta: {
            breadcrumb: [{ parent: 'Login', label: 'Login' }],
        },
    },
   
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior () {
        return { left: 0, top: 0 };
    }
});

export default router;
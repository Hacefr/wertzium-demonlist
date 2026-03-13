import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

const app = Vue.createApp({
    data: () => ({ store }),
});

const router = VueRouter.createRouter({
    // Adding the base path inside createWebHashHistory is the fix
    history: VueRouter.createWebHashHistory('/wertzium-demonlist/'),
    routes,
});

app.use(router);

app.mount('#app');

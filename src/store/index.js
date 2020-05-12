import Vuex from 'vuex';
import Vue from "vue";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        messages: [],
        newss: [],
        searchString: "",
        formVisible: false,
        formNews: {},
        formNewMode: true
    },
    getters: {
        firstMessage(state) {
            return state.messages[0];
        },
        areSomeMessages(state) {
            return state.messages.length > 0;
        },
        messagesCount(state) {
            return state.messages.length
        },
        filtredNewss(state) {
            let result = state.newss;
            if (state.searchString)
                result = result.filter(news =>
                    news.title.toLowerCase().includes(state.searchString.toLowerCase())
                );
            return result;
        },

    },
    mutations: {
        addMessage(state, message) {
            state.messages.push(message);
        },
        removeMessage(state) {
            state.messages.shift();
        },


        setNewss(state, newss) {
            state.newss = newss;
        },
        addNews(state, news) {
            state.newss.push(news);
        },
        removeNews(state, news) {
            const index = state.newss.indexOf(news);
            state.newss.splice(index, 1);
        },
        updateNews(state, news) {
            const index = state.newss.findIndex(b => b._id == news._id);
            Vue.set(state.newss, index, news);
        },
        sortNewss(state, field) {
            state.newss.sort((b1, b2) => b1[field] >= b2[field] ? 1 : -1);
        },

        showForm(state) {
            state.formVisible = true;
        },
        hideForm(state) {
            state.formVisible = false;
        },
        newFormMode(state) {
            state.formNewMode = true;
        },
        updateFormMode(state) {
            state.formNewMode = false;
        },

        clearFormNews(state) {
            Object.assign(state.formNews, {
                title: "",
                author: "",
                text: "",
                date: "1997-01-10T22:00:00.000Z",
                stars: 0
            });
        },
        setFormNews(state, news) {
            state.formNews = news;
        },
        setSerchString(state, string){
            state.searchString = string;
        }
    },
    actions: {
        async showMessageForTime(context, options) {
            const delay = options.delay || 5000;
            context.commit('addMessage', options.message);
            setTimeout(function () {
                if (context.getters.areSomeMessages)
                    context.commit('removeMessage');
            },
                delay);
        },


        async getNewss(context) {
            try {
                let resp = await axios.get("http://localhost:5000/news");
                context.commit("setNewss", resp.data);
                await context.dispatch("showMessageForTime", { message: "Новини завантажено", delay: 500 });
            }
            catch (e) {
                await context.dispatch("showMessageForTime", { message: e, delay: 5000 });
            }
        },
        async getNewsById(context, id) {
            try {
                let resp = await axios.get(`http://localhost:5000/news/${id}`);
                await context.dispatch("showMessageForTime", { message: "Новини завантажено", delay: 500 });
                return resp.data;
            }
            catch (e) {
                await context.dispatch("showMessageForTime", { message: e, delay: 5000 });
            }
        },

        async getNewssByQuery(context, query) {
            try {
                let resp = await axios.get("http://localhost:5000/news", { params: query });
                context.commit("setNewss", resp.data);
                await context.dispatch("showMessageForTime", { message: "Новини завантажено", delay: 500 });
            }
            catch (e) {
                await context.dispatch("showMessageForTime", { message: e, delay: 5000 });
            }

        },
        async postNews(context, news) {
            try {
                let resp = await axios.post("http://localhost:5000/news", news);
                context.commit("addNews", resp.data);
                await context.dispatch("showMessageForTime", { message: "Новину додано", delay: 500 });
            }
            catch (e) {
                await context.dispatch("showMessageForTime", { message: e, delay: 5000 });
            }
        },
        async deleteNews(context, news) {
            try {
                let resp = await axios.delete(`http://localhost:5000/news/${news._id}`);
                context.commit("removeNews", resp.data);
                await context.dispatch("showMessageForTime", { message: "Новину вилучено", delay: 500 });
            }
            catch (e) {
                await context.dispatch("showMessageForTime", { message: e, delay: 5000 });
            }
        },
        async patchNews(context, news) {
            try {
                let resp = await axios.patch(`http://localhost:5000/news/${news._id}`, news);
                context.commit("updateNews", resp.data);
                await context.dispatch("showMessageForTime", { message: "Новину оновлено", delay: 500 });
            }
            catch (e) {
                await context.dispatch("showMessageForTime", { message: e, delay: 5000 });
            }
        },

        async showUpdateForm(context, news) {
            news = await context.dispatch("getNewsById", news._id);
            context.commit("setFormNews", news);
            context.commit("updateFormMode");
            context.commit("showForm");
        },
        showAddForm(context) {
            context.commit("clearFormNews");
            context.commit("newFormMode");
            context.commit("showForm");
        }
    }
});
export default store;

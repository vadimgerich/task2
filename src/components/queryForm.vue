//форма для запитів
<template>
    <form @submit.prevent>
        <input type="number" v-model.number="query.stars">
        <input type="button" value="Шукати" @click="search()">
        <input type="button" value="Очистити" @click="reset()">
    </form>
</template>
<script>
import { mapActions } from 'vuex';
export default { 
    data(){
        return{
            query: {
                stars:null
            }
        }
    },
    methods:{
        ...mapActions(["getNewssByQuery"]),
        reset(){
            this.query.stars = null;
            this.getNewssByQuery(this.query);
        },
        search(){            
            this.getNewssByQuery(this.query);
        }
    }
}
</script>
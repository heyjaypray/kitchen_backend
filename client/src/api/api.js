import axios from 'axios'

const API = {

    get: function(){
        return axios.get("/photos")
    },

    save: function(obj){
        return axios.post("/photos", obj)
    },

    delete: function(id){
        return axios.delete(`/photos/${id}`)
    },

    post: function(obj){
        return axios.post("/photos", obj)
    }

}

export default API;
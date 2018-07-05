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

    postCategory: function(obj){
        return axios.post("/photos", obj)
    },

    post: function(obj){
        return axios.post("/upload", obj)
    }

}

export default API;
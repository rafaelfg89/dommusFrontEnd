import axios from "axios";
import { useEffect, useState } from "react";

const api = axios.create({
    baseURL : "http://localhost:8000/"
})

const useFetch = async (method,url, options, payLoad) => {   

    switch(method){
        case 'GET' :
            try{
                const res = await api.get(url,options)
                return [res.data, null] 
            }catch(err){
                return [null, err]
            }

        case 'POST' :
            try{
                const res = await api.post(url,payLoad,options)
                return [res.data, null] 
            }catch(err){
                return [null, err]
            }

        case 'DELETE' :
            try{
                const res = await api.delete(url,options)
                return [res.data, null] 
            }catch(err){
                return [null, err]
            }

        case 'PUT' :
            try{
                const res = await api.put(url,payLoad,options)
                return [res.data, null] 
            }catch(err){
                return [null, err]
            }

        default : return[null,null]
    }}

export default useFetch;
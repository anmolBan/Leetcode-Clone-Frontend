"use server"
import axios from "axios";
import { handleSubmission } from "./handleSubmission";

export async function handleSubmitButton({userId, code, problemId} : {userId: string, code: string, problemId: string}){

    try{
        const res: any = await axios.post("http://localhost:3001/submit-code", {
            userId,
            problemId,
            code,
            language: "JAVASCRIPT"
        });
        if(res.data.success){
            handleSubmission()
        }
        return res.data;
    } catch(error){
        return error;
    }
    
  }
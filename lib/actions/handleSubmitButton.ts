"use server"
import axios from "axios";
// import { handleSubmission } from "./handleSubmission";

export async function handleSubmitButton({userId, code, problemId} : {userId: string, code: string, problemId: string}){

    try{
        const res: any = await axios.post(`${process.env.CODE_JUDGE_URL}/submit-code`, {
            userId,
            problemId,
            code,
            language: "JAVASCRIPT"
        });
        return res.data;
    } catch(error){
        return error;
    }
    
  }
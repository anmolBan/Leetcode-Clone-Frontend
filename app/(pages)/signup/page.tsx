"use client"

import { handleSignup } from "@/lib/actions/handleSignup";
// import handleSignup from "@/lib/actions/handleSignup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import zod from "zod";

export default function Signup(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    async function handleOnClickSignup(){
        setError("");
        
        const res = await handleSignup({name, email, username, password});

        if(res.success){
            router.push("/api/auth/signin");
        }
        else{
            setError(res.error);
            console.log(res.error)
        }
    }

    return (
        <div >
            <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
            {error && (
                <div className="bg-red-500 w-80 py-7 text-white rounded-lg text-center overflow-auto px-2">
                    <div>
                        {error}
                    </div>
                </div>
            )}
                <div className="flex flex-col justify-center font-mono">
                    <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                        <h1 className="text-4xl font-bold mt-10 mb-1">Sign up</h1>
                        <h2 className="text-base">Enter your information to create an account</h2>
                        <div className="block text-sm font-medium text-gray-900 text-left mt-2">Name</div>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={"John Doe"} onChange={(e) => {
                            setName(e.target.value)
                        }}></input>
                        <div className="block text-sm font-medium text-gray-900 text-left mt-2">Email</div>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={"xyz@example.com"} onChange={(e) => {
                            setEmail(e.target.value)
                        }}></input>
                        <div className="block text-sm font-medium text-gray-900 text-left mt-2">Username</div>
                        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" onChange={(e) => {
                            setUsername(e.target.value)
                        }}></input>
                        <label className="block text-sm font-medium text-gray-900 text-left mt-2">Password</label>
                        <input onChange={(e) => {setPassword(e.target.value)}} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Password" type="password"/>
                        <div className="pt-4">
                            <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={handleOnClickSignup}>Sign up</button>
                        </div>
                        <div className="mt-3 mb-10">Already have an account? <Link className=" underline" href="/api/auth/signin">Signin</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function SearchBar(){
    const [searchInput, setSearchInput] = useState("");
    const router = useRouter();

    function handleOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>){
        if(event.key === "Enter"){
            router.push(`/search?q=${encodeURIComponent(searchInput)}`);
        }
    }
    return (
        <div>
            <input onKeyDown={handleOnKeyDown} placeholder="Search..." className="px-2 py-1 text-sm w-56" onChange={(e) => {
                setSearchInput(e.target.value)
            }}></input>
        </div>
    )
}
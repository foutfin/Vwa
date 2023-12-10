import { useState } from "react"
export default ({fileEle,title,reference,initial,pin=true}) => {
    const [s,setS] = useState(initial)
    const handle = ()=>{
        setS(parseInt(fileEle.current?.currentTime))
    }
    return (
        <div className="w-fit m-auto mt-[30px] flex items-center gap-[10px]">
            <label className=" font-bold text-md mr-[20px]">{title}</label>
            <input max={fileEle.current ? fileEle.current.duration : 0 }  ref={reference} type="number" value={s} onChange={e => setS(e.target.value)} className="p-[5px] w-[60px] text-dark_bg " />
            { pin?<svg onClick={handle} className="w-[24px]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#ffffff" d="M256 17.108c-75.73 0-137.122 61.392-137.122 137.122.055 23.25 6.022 46.107 11.58 56.262L256 494.892l119.982-274.244h-.063c11.27-20.324 17.188-43.18 17.202-66.418C393.122 78.5 331.73 17.108 256 17.108zm0 68.56a68.56 68.56 0 0 1 68.56 68.562A68.56 68.56 0 0 1 256 222.79a68.56 68.56 0 0 1-68.56-68.56A68.56 68.56 0 0 1 256 85.67z"></path></g></svg>
                :null}
        </div>
    )
}
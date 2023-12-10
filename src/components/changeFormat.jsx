import {  useRef, useState } from "react"
import { addfile } from "../utils/utils"
import CubeLoading from "./cubeLoading"
import {  toast } from 'react-toastify'


const SelectField = ({reference})=>{
    const [s,setS] = useState(360)
    return(
        <>
        <label className=" font-bold text-md mr-[20px]">Choose Quality :</label>
        <select value={s} onChange={e=>setS(e.target.value)} ref={reference} className="text-dark_bg font-normal p-2">
            <option value={'webm'}>webm</option>
            <option value={'mp4'}>mp4</option>
        </select> 
        </>
    )
}


export default ({ ffmpeg,setScreen }) => {
    const video = useRef(null)
    const format = useRef(null)
    

    const [invideo, setInVideo] = useState(null)
    const [output, setOutput] = useState(null)
    const [processing, setProcessing] = useState(false)
    

    const [tab, setTab] = useState(true) //Tabs :- true -> input , false -> output

   
    const chnageFormat = async () => {
        if (invideo && format.current ) {
            const formatVal = parseInt(format.current.value)
            let filename = ''
            let args = []

            switch(formatVal){
                case 'webm':
                    filename =  'output.webm'
                    args = ['-i',invideo.name , filename]
                    break
                case 'mp4':
                    filename =  'output.mp4'
                    args = ['-i', invideo.name, filename]
                    break
                    
            }
            
            setProcessing(true)
            setOutput(null)
            setTab(false)
            await addfile(ffmpeg, invideo)

            const executed = await ffmpeg.exec(['-i',invideo.name ,'output.webm'])
            if(executed != 0){
                toast.error('Something went wronge')
                return
            }else if (executed == 0){
                toast.success('Video Format Changed successfully')
            }
            const output = await ffmpeg.readFile(filename)
            setOutput({data:URL.createObjectURL(new Blob([output.buffer])),name:filename})
            setProcessing(false)
        }

    }

    return (
        <div className="mt-[40px] w-[70%] m-auto md:w-[60%] lg:w-[60%] max-w-[600px] ">
            <div className="flex justify-between">
                <button onClick={_=>setScreen(0)} className="active:scale-95 ml-[-30px]">
                <svg className="w-[35px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
                </svg>
                </button>
                <div className=" flex font-roboto text-md font-bold  rounded-lg shadow-2xl justify-center cursor-pointer border-2 border-dark_fg w-fit ">
                    {tab == true ? <span onClick={_ => setTab(true)} className="p-2 rounded-l-lg hover:bg-dark_other bg-dark_other">Input</span> : <span onClick={_ => setTab(p => !p)} className="p-2 rounded-l-lg hover:bg-dark_other ">Input</span>}
                    <span className="border-[1px] border-dark_fg "></span>
                    {tab == false ? <span onClick={_ => setTab(false)} className="p-2 rounded-r-lg hover:bg-dark_other bg-dark_other">Output</span> : <span onClick={_ => setTab(p => !p)} className="p-2 rounded-r-lg hover:bg-dark_other">Output</span>}
                </div>
                <div></div>

            </div>

            {
                tab ?
                    invideo ?
                        <div >
                            <div className="-z- mt-[40px] relative">
                                <video ref={video} className="bg-white m-auto" src={URL.createObjectURL(invideo)} controls></video>
                                <button onClick={_ => setInVideo(null)} className="absolute top-[-20px] right-0 active:scale-95">
                                    <svg className=" w-[40px] h-[40px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z" fill="#c01c28"></path> </g>
                                    </svg>

                                </button>

                            </div>
                            <div className="flex mt-[40px] justify-center items-center">
                                <SelectField reference={format} />
                            </div>
                            {invideo ? <button disabled={processing} onClick={chnageFormat} className="disabled:bg-gray-500 disabled:text-white active:scale-90 block m-auto mt-[50px] font-bold bg-dark_success text-md text-dark_bg py-[10px] px-[20px] rounded-md">Change Format</button> : null}
                        </div>


                        :
                        <label className="mt-[40px] cursor-pointer shadow-2xl  border-4 border-dark_fg border-dashed rounded-md flex justify-center items-center flex-col aspect-video">
                            <input onChange={e => setInVideo(e.target.files[0])} className="hidden" type="file" accept="video/*" />
                            <span className="font-bold text-md">Add an Video</span>
                        </label>
                    :
                    <>

                        {processing ? <CubeLoading />: null}

                        {
                            output ?
                                <div className="my-[100px] flex justify-center flex-col">
                                    <video src={output} controls></video>
                                    <a className="active:scale-90 w-fit block m-auto mt-[20px] font-bold bg-dark_success text-md text-dark_bg py-[10px] px-[20px] rounded-md" href={output.data} download={output.name}>Download</a>
                                </div>
                                : null
                        }

                        { !processing && !output ? <p className="font-bold mt-[100px] text-dark_warning text-center">Nothing Output here</p> : null}


                    </>


            }
        </div>

    )
}

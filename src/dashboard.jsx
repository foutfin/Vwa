import { useState } from "react"
import ExtractStream from "./components/extractStream"
import Vidtogif from "./components/vidtogif"
import ClipVideo from "./components/clipVideo"
import Quality from "./components/quality"
import ChangeFormat from "./components/changeFormat"


const Card = ({title,desc,setScreen,to}) =>{
    return (
        <div className=" cursor-pointer p-[10px] border-[2px] border-dark_fg rounded-md bg-[#fff]  items-center text-dark_bg">
            <p className="font-bold text-md  ">{title}</p>
            <p className="mt-[5px] font-sm text-slate-600">{desc}</p>
            <button onClick={_=>setScreen(to)} className="mt-[5px] active:scale-90 bg-dark_success rounded-md p-[10px] ml-auto block font-bold text-sm">Take me there</button>
        </div>
    )
}


// Screens 
// 0 => main dashboard
// 1 => videotogif
// 2 => extract Streams
// 3 => clip video
// 4 => change quality
// 5 => change Video Format


export default ({ffmpeg}) =>{
    const [screens , setScreen] = useState(0)

    switch(screens){
        case 0:
            return (
                <div className="mt-[30px] lg:mt-[100px]  select-none m-auto w-[90%] md:w-[80%] lg:w-[70%] max-w-[1200px] p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                    <Card setScreen={setScreen} to={1}  title="Video To Gif" desc="Generate gif from your video" />
                    <Card setScreen={setScreen} to={2} title="Extract Streams" desc="Extract video and audio streams from video" />
                    <Card setScreen={setScreen} to={3}  title="Clip Video" desc="Clip certain portion of video" />
                    <Card setScreen={setScreen} to={4} title="Change Video Quality"  desc="Change quality of video" />
                    {/* <Card setScreen={setScreen} to={5} title="Change Video Format"  desc="Generate gif from your video" /> */}
                </div>
            )
        case 1:
            return <Vidtogif setScreen={setScreen} ffmpeg={ffmpeg}/>
        case 2:
            return <ExtractStream setScreen={setScreen} ffmpeg={ffmpeg}/>
        case 3:
            return <ClipVideo setScreen={setScreen} ffmpeg={ffmpeg} />
        case 4:
            return <Quality setScreen={setScreen} ffmpeg={ffmpeg} />
        // case 5:
        //     return <ChangeFormat setScreen={setScreen} ffmpeg={ffmpeg} />
            
        default:
            return null
    }
    
}
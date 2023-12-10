import { fetchFile } from '@ffmpeg/util'
import {useEffect, useRef, useState} from "react"

export default ({ffmpeg}) =>{
    const invideoRef = useRef(null)
    const outaudioRef = useRef(null)
    const outputVidRef = useRef(null)
    const fileRef = useRef(null)
    // const dRef = useRef(null)

    const [audiodownload,setAudioDownload] = useState(false)
    const [audiourl,setAudioUrl] = useState("")

    const [videodownload,setVideoDownload] = useState(false)
    const [videourl,setVideoUrl] = useState("")

    const [startTime,setStartTime] =  useState(0)
    const [endTime,setEndTime] =  useState(0)

    const postProcess = async () =>{
        const audiodata = await ffmpeg.readFile('audio.mp4')
        const videodata = await ffmpeg.readFile('video.mp4')

        const audiourl = URL.createObjectURL(new Blob([audiodata.buffer], {type: 'video/mp4'}))
        const videourl = URL.createObjectURL(new Blob([videodata.buffer], {type: 'video/mp4'}))

        outaudioRef.current.src =audiourl
        outputVidRef.current.src =videourl

        setAudioDownload(true)
        setAudioUrl(audiourl)

        setVideoDownload(true)
        setVideoUrl(videourl)
    }

    const addfile = async () =>{
        if(fileRef.current.files.length <= 0){
            console.log("No file")
        }
        await ffmpeg.writeFile('input.mp4', await fetchFile(fileRef.current.files[0]));
    }

    const extractFull = async () => {
        await addfile()
        await ffmpeg.exec(['-i','input.mp4', '-map','0:a','-acodec','copy','audio.mp4'])
        await ffmpeg.exec(['-i','input.mp4', '-c:v','copy','-an','video.mp4'])
        await postProcess()
    }


    const extractWithTime = async()=>{
        if(startTime >= endTime ){
            console.log("End Time Exceeds")
            return
        }
        await addfile()
        await ffmpeg.exec(["-ss",`${startTime}`,'-i','input.mp4',"-t",`${endTime-startTime}`, '-map','0:a','-acodec','copy','audio.mp4'])
        await ffmpeg.exec(["-ss",`${startTime}`,'-i','input.mp4',"-t",`${endTime-startTime}`,'-c:v','copy','-an','video.mp4'])
        await postProcess()
    }
   
    useEffect(()=>{

        fileRef.current.addEventListener("change", () => {
            invideoRef.current.src = URL.createObjectURL(fileRef.current.files[0]);
            setStartTime(0)
            
          })


          invideoRef.current.addEventListener("durationchange",e=>{
            setEndTime(parseInt(e.target.duration))
          })
    },[])

    const setTimes = (type) =>{
        if(type == 1){
            setEndTime(parseInt(invideoRef.current.currentTime))
            return
        }
        setStartTime(parseInt(invideoRef.current.currentTime))
    }


    const extractVideo = async (type) =>{
        if(type == "full") {
            await extractFull()
        }else if(type == "time" ){
            await extractWithTime()
        }

    }

    return(
        <div className="parent p-4 gap-2 flex flex-col xl:border-gray-400 xl:shadow-lg xl:rounded-lg">
            <div className="top flex flex-col gap-2 xl:gap-0 xl:flex-row">
                <h2 className="font-bold text-2xl">Dashboard</h2>
                <input className="file:rounded file:border-0 xl:file:ml-2 file:bg-blue-500 file:text-white file:py-1 file:px-2"
                    ref={fileRef} type="file" accept='video/*' />
            </div>

            <div className='flex flex-col xl:flex-row xl:gap-2'>
                <div className="p-2 flex flex-col justify-between">
                    <div className="top">
                        <h3 className="text-lg font-bold"> Input Video stream</h3>
                        <video ref={invideoRef} className='rounded-lg' controls width="470" height="300"></video><br/>
                    </div>

                <div className="body flex flex-col gap-2">
                    <div>
                        <label>Start Position</label>
                        <div className="flex gap-1">
                            <input className="grow border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            type="number" value={startTime} onChange={e=>setStartTime(parseInt(e.target.value))}/>
                            <button className="text-sm px-2 py-1 rounded bg-blue-500 text-white" onClick={()=>setTimes(0)}>Current Position</button>
                        </div>
                    </div>

                    <div>
                        <label>End Position</label>
                        <div className='flex gap-1'>
                            <input className='grow border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            type="number" value={endTime} onChange={e=>setEndTime(parseInt(e.target.value))} />
                            <button className="text-sm px-2 py-1 rounded bg-blue-500 text-white" onClick={()=>setTimes(1)} >Current Position</button>
                        </div>
                    </div>
                    
                    <div className='flex gap-1 mt-1'>
                        <button className="grow rounded px-2 py-1 bg-blue-500 text-white" onClick={()=>extractVideo("time")}>Extract</button>
                        <button className="grow rounded px-2 py-1 bg-blue-500 text-white" onClick={()=>extractVideo("full")}>Extract Full Video</button>
                    </div>
                </div>
                </div>

                <div className='p-2 flex flex-col justify-between'>
                    <h3 className='text-lg font-bold'>Result</h3>

                    <div>
                        <p className='font-bold'>Audio</p>
                        <audio className="mb-2 rounded-md" ref={outaudioRef} controls></audio>
                        {audiodownload && <a className='block w-full text-center rounded px-2 py-1 bg-blue-500 text-white' href={audiourl} download={"audio_output.mp3"}>Download Only Audio</a>}
                    </div>

                    <div>
                        <p className='font-bold'>Video</p>
                        <video ref={outputVidRef} className="mb-2 rounded-md" controls width="300" height="300" ></video>
                        {videodownload && <a className='block w-full text-center rounded px-2 py-1 bg-blue-500 text-white' href={videourl} download={"Video_output.mp4"}>Download Only Video</a>}
                    </div>
                </div>
            </div>
        </div>
    )
}
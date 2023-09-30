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
        <div>
            <h2>Dashboard</h2>

            <input style={{display:"block",marginInline:"auto",marginTop:50}} ref={fileRef} type="file" accept='video/*' />
            <div style={{display:"flex",flexWrap:"wrap",gap:20,justifyContent:"center"}}>

                <div style={{border:"3px solid #000",width:"fit-content",padding:20,marginTop:10}}>
                    <h3 style={{textDecoration:"underline"}}> Input Video stream :- </h3>
                    <video ref={invideoRef} controls width="300" height="300"></video><br/>

                    <label>Start Postion</label> <br/>
                        <input width="10" type="number" value={startTime} onChange={e=>setStartTime(parseInt(e.target.value))}/>
                     <button style={{marginLeft:5}} onClick={()=>setTimes(0)}  >Current postion</button>

                    <br/>

                     <label>End Postion</label> <br/>
                        <input width="10" type="number" value={endTime} onChange={e=>setEndTime(parseInt(e.target.value))} />
                     <button style={{marginLeft:5}} onClick={()=>setTimes(1)} >Current postion</button>
                    
                    <div style={{marginTop:10,display:"flex",justifyContent:"center",gap:10}}>
                        <button onClick={()=>extractVideo("time")}>Extract</button>
                        <button onClick={()=>extractVideo("full")}>Extract Full Video</button>
                    </div>
                
                </div>
                <div style={{border:"3px solid #000",width:"fit-content",padding:20 ,marginTop:10}}>
                    <h3 style={{textDecoration:"underline"}}>Result :- </h3>
                    <p style={{marginTop:50}}>Audio</p>
                    <audio ref={outaudioRef} controls></audio><br/>
                    {audiodownload && <a href={audiourl} download={"audio_output.mp3"}>Download Only audio</a>}
                    <p>Video</p>
                    <video ref={outputVidRef} controls width="300" height="300" ></video><br/>
                    {videodownload && <a href={videourl} download={"Video_output.mp4"}>Download Only video</a>}
                </div>
            </div>
        </div>
    )
}
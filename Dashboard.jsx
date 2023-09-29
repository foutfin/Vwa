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

    const extract = async () => {
        if(fileRef.current.files.length <= 0){
            console.log("No file")
        }
        await ffmpeg.writeFile('input.mp4', await fetchFile(fileRef.current.files[0]));
        await ffmpeg.exec(['-i','input.mp4', '-map','0:a','-acodec','copy','audio.mp4']);
        const audiodata = await ffmpeg.readFile('audio.mp4');

        await ffmpeg.exec(['-i','input.mp4', '-c:v','copy','-an','video.mp4']);
        const videodata = await ffmpeg.readFile('video.mp4');

        const audiourl = URL.createObjectURL(new Blob([audiodata.buffer], {type: 'video/mp4'}))
        const videourl = URL.createObjectURL(new Blob([videodata.buffer], {type: 'video/mp4'}))

        outaudioRef.current.src =audiourl
        outputVidRef.current.src =videourl

        setAudioDownload(true)
        setAudioUrl(audiourl)

        setVideoDownload(true)
        setVideoUrl(videourl)
    }

    useEffect(()=>{

        fileRef.current.addEventListener("change", () => {
            invideoRef.current.src = URL.createObjectURL(fileRef.current.files[0]);
          })
    },[])

    return(
        <div>
            <h2>Dashboard</h2>

            <input ref={fileRef} type="file" accept='video/*' />
            <br/>
            <h3> Input Video stream </h3>
            <video ref={invideoRef} controls width="300" height="300"></video><br/>
            <button onClick={extract}>Extract Streams</button><br/>
            <br/>
            <h3>Result :- </h3>
            <p style={{marginTop:50}}>Audio</p>
            <audio ref={outaudioRef} controls></audio><br/>
            {audiodownload && <a href={audiourl} download={"audio_output.mp3"}>Download Only audio</a>}
            <p>Video</p>
            <video ref={outputVidRef} controls width="300" height="300" ></video><br/>
            {videodownload && <a href={videourl} download={"Video_output.mp4"}>Download Only video</a>}
        </div>
    )
}
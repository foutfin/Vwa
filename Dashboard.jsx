import { fetchFile } from '@ffmpeg/util';
import {useEffect, useRef, useState} from "react"

export default ({ffmpeg}) =>{
    const invideoRef = useRef(null);
    const outvideoRef = useRef(null);
    const fileRef = useRef(null);
    // const dRef = useRef(null)

    const [download,setDownload] = useState(false)
    const [url,setUrl] = useState("")
    const transcode = async () => {
        if(fileRef.current.files.length <= 0){
            console.log("No file")
        }
        await ffmpeg.writeFile('input.mp4', await fetchFile(fileRef.current.files[0]));
        await ffmpeg.exec(['-i','input.mp4', '-map','0:a','-acodec','copy','output.mp4']);
        const data = await ffmpeg.readFile('output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}))
        outvideoRef.current.src =url
        setDownload(true)
        setUrl(url)
    }

    useEffect(()=>{

        fileRef.current.addEventListener("change", () => {
            invideoRef.current.src = URL.createObjectURL(fileRef.current.files[0]);
          })
    },[])

    return(
        <div>
            <p>Dashboard</p>

            <input ref={fileRef} type="file" accept='video/*' />
            <br/>
            <p> Input Video stream </p>
            <video ref={invideoRef} controls width="300" height="300"></video><br/>
            <button onClick={transcode}>Extract audio</button><br/>
            <br/>
            <audio ref={outvideoRef} controls></audio><br/>
            {download && <a href={url} download={"output.mp3"}>Download</a>}
        </div>
    )
}
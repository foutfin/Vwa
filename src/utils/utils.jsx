import { fetchFile } from '@ffmpeg/util'
const addfile = async (ffmpeg,file) =>{
    await ffmpeg.writeFile(file.name, await fetchFile(file));
}


export {addfile}
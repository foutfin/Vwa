import { useEffect, useState } from "react"
import { toBlobURL } from '@ffmpeg/util'

// States 
// 0 -> loading
// 1 -> error
// 2 -> downloading
// 3 -> completed


export default ({ db, setUi, ffmpeg }) => {

    const [state, setState] = useState(0)
    const [message, setMessage] = useState("starting")


    useEffect(() => {
        const request = window.indexedDB.open("testDb")

        request.onerror = (event) => {
            setMessage("Error in connecting to db")
            setState(1)
        }

        request.onupgradeneeded = (event) => {
            //console.log("Upgrade request comes")
            const d = event.target.result
            d.createObjectStore("ffmpeg", { keyPath: "id" })
        }

        request.onsuccess = (event) => {
            console.log("Yay Connected Successfully")
            db = event.target.result


            const urls = {
                wasm: "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm/ffmpeg-core.wasm",
                core: "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm/ffmpeg-core.js",
                worker:"https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm/ffmpeg-core.worker.js"
            }


            const s = db.transaction(['ffmpeg']).objectStore("ffmpeg")

            s.getAll().onsuccess = (e) => {
                if (e.target.result.length == 2) {
                    let coreBlob, wasmBlob,workerBlob;
                    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm'
                    e.target.result.forEach(val => {
                        if (val.id == "core") {
                            coreBlob = val.data
                            console.log(val.data.type)
                        } else if (val.id == "wasm") {
                            wasmBlob = val.data
                            console.log(val.data.type)
                        }else if(val.id == "worker"){
                            workerBlob = val.data
                            console.log(val.data.type)
                        }
                    })
                    ffmpeg.load({
                        
                        coreURL: URL.createObjectURL(coreBlob),
                        wasmURL: URL.createObjectURL(wasmBlob),
                        // workerURL:URL.createObjectURL(workerBlob),
                    }).then(res => {
                        if (res) {
                            
                            setState(3)
                            setMessage("Download completed")
                            setUi(2)
                        }
                    })

                }

            }

            s.get("core").onsuccess = (e) => {
                if (!e.target.result) {
                    setState(2)
                    setMessage("Downloading packages")
                    fetch(urls.core)
                        .then(res => res.blob())
                        .then(blob => {
                            const ffmpegStore = db.transaction(['ffmpeg'], "readwrite").objectStore("ffmpeg")
                            const req = ffmpegStore.add({ id: "core", data: blob }).onsuccess = (e) => {
                                //console.log("core package added", e)
                                ffmpegStore.getAll().onsuccess = (e) => {
                                    if (e.target.result.length == 2) {
                                        let coreBlob, wasmBlob,workerBlob;
                                        e.target.result.forEach(val => {
                                            if (val.id == "core") {
                                                coreBlob = val.data
                                                //console.log(val.data.type)
                                            } else if (val.id == "wasm") {
                                                wasmBlob = val.data
                                                //console.log(val.data.type)
                                            }else if(val.id == "worker"){
                                                workerBlob = val.data
                                                //console.log(val.data.type)
                                            }
                                        })
                                        ffmpeg.load({
                                            coreURL: URL.createObjectURL(coreBlob),
                                            wasmURL: URL.createObjectURL(wasmBlob),
                                            // workerURL:URL.createObjectURL(workerBlob)
                                        }).then(res => {
                                            if (res) {
                                                setState(3)
                                                setMessage("Download completed")
                                                setUi(2)
                                            }
                                        })
                                    }

                                }
                            }

                            // req.onsuccess = (e) => {
                            //     console.log("core package added",e)
                            // }
                            // req.onerror = (e) => {
                            //     console.log("unable to get core package", e)
                            // }

                        })
                        .catch(err=>{
                            setMessage("Internet Lost required once to get  the necessary packages")
                            setState(1) 
                        })
                }
            }


            s.get("wasm").onsuccess = (e) => {
                if (!e.target.result) {
                    fetch(urls.wasm)
                        .then(res => res.blob())
                        .then(blob => {
                            const ffmpegStore = db.transaction(['ffmpeg'], "readwrite").objectStore("ffmpeg")
                            const req = ffmpegStore.add({ id: "wasm", data: blob }).onsuccess = (e) => {
                                //console.log("wasm package added", e)
                                ffmpegStore.getAll().onsuccess = (e) => {
                                    if (e.target.result.length == 2) {
                                        let coreBlob, wasmBlob,workerBlob;
                                        e.target.result.forEach(val => {
                                            if (val.id == "core") {
                                                coreBlob = val.data
                                                //console.log(val.data.type)
                                            } else if (val.id == "wasm") {
                                                wasmBlob = val.data
                                                //console.log(val.data.type)
                                            }else if(val.id == "worker"){
                                                workerBlob = val.data
                                                //console.log(val.data.type)
                                            }
                                        })
                                        ffmpeg.load({
                                            coreURL: URL.createObjectURL(coreBlob),
                                            wasmURL: URL.createObjectURL(wasmBlob),
                                            // workerURL:URL.createObjectURL(workerBlob)
                                        }).then(res => {
                                            if (res) {
                                                
                                                setState(3)
                                                setMessage("Download completed")
                                                setUi(2)
                                            }
                                        })
                                    }
                                }
                            }

                            // req.onsuccess = (e) => {


                            // }
                            // req.onerror = (e) => {
                            //     console.log("unable to get wasm package", e)
                            // }

                        })
                        .catch(err=>{
                            setMessage("Internet Lost required once to get the necessary packages")
                            setState(1) 
                        })
                }
            }

            // s.get("worker").onsuccess = (e) => {
            //     if (!e.target.result) {
            //         fetch(urls.worker)
            //             .then(res => res.blob())
            //             .then(blob => {
            //                 const ffmpegStore = db.transaction(['ffmpeg'], "readwrite").objectStore("ffmpeg")
            //                 const req = ffmpegStore.add({ id: "worker", data: blob }).onsuccess = (e) => {
            //                     console.log("worker package added", e)
            //                     ffmpegStore.getAll().onsuccess = (e) => {
            //                         if (e.target.result.length == 3) {
            //                             let coreBlob, wasmBlob,workerBlob;
            //                             e.target.result.forEach(val => {
            //                                 if (val.id == "core") {
            //                                     coreBlob = val.data
            //                                     console.log(val.data.type)
            //                                 } else if (val.id == "wasm") {
            //                                     wasmBlob = val.data
            //                                     console.log(val.data.type)
            //                                 }else if(val.id == "worker"){
            //                                     workerBlob = val.data
            //                                     console.log(val.data.type)
            //                                 }
            //                             })
            //                             ffmpeg.load({
            //                                 coreURL: URL.createObjectURL(coreBlob),
            //                                 wasmURL: URL.createObjectURL(wasmBlob),
            //                                 workerURL:URL.createObjectURL(workerBlob)
            //                             }).then(res => {
            //                                 if (res) {
            //                                     setLoaded(true);
            //                                     setState(3)
            //                                     setMessage("Download completed")
            //                                     setUi(2)
            //                                 }
            //                             })
            //                         }
            //                     }
            //                 }

            //                 // req.onsuccess = (e) => {


            //                 // }
            //                 // req.onerror = (e) => {
            //                 //     console.log("unable to get wasm package", e)
            //                 // }

            //             })
            //     }
            // }

        }
    }, [])




    let jsx;
    if (state == 0) {
        jsx = <p>Loading</p>
    } else if (state == 1) {
        jsx = <p>{message}</p>
    } else if (state == 2) {
        jsx = <p>{message}</p>
    } else if (state == 3) {
        jsx = <p>{message}</p>
    }

    return (
        <div>
            {jsx}
        </div>
    )
}
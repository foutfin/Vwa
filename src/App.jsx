import './App.css'
import { useRef, useState } from 'react'
import Loading from './Loading'
import Dashboard from './Dashboard'
import { FFmpeg } from '@ffmpeg/ffmpeg';

// 0 -> home
// 1 -> loading
// 2 -> dashboard


function App() {
  const db = useRef(null)
  const ffmpegRef = useRef(new FFmpeg());

  ffmpegRef.current.on('log', ({type, message }) => {
    console.log("Logging ffmpeg : ",message,type);
  });

  const [ui, setUi] = useState(0)


  const handleLoad = () => {
    const request = window.indexedDB.open("testDb")

    request.onerror = (event) => {
      console.error("Why didn't you allow my web app to use IndexedDB?!");
    }


    request.onupgradeneeded = (event) => {
      console.log("Upgrade request comes")
      const d = event.target.result
      const ffmpegStore = d.createObjectStore("ffmpeg", { keyPath: "id" })
    }

    request.onsuccess = (event) => {
      console.log("Yay Connected Successfully")
      db.current = event.target.result

      const url = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm/ffmpeg-core.wasm"
      const s = db.current.transaction(['ffmpeg']).objectStore("ffmpeg")

      const req = s.get("core")

      req.onsuccess = (e) => {
        console.log("Data added", e.target.result)
      }

      req.onerror = (e) => {
        console.log("not founded", e)
      }

    }


  }

  const loadLoading = () => {
    setUi(1)
  }

  return (
    <div className='h-[100dvh] w-[100dvw] flex justify-center xl:items-center'>
      { ui == 0 ? (
        <div className='flex flex-col justify-center items-center gap-2'>
          <p className="italic">Testing purpose</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded shadow" onClick={loadLoading}>Go to playground</button>
        </div>
      ) : ui == 1 ? (
        <Loading db={db.current} setUi={setUi} ffmpeg={ffmpegRef.current} />
      ) : (
        <Dashboard ffmpeg={ffmpegRef.current} />
      )}
    </div>
  )


}

export default App

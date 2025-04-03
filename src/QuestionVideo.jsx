import {useState, useRef} from 'react'

export default function QuestionVideo({videoLink}) {
  const [isPlaying, setPlaying] = useState(false)
  const ref = useRef(null)

  const handleClick = () => {
    setPlaying(!isPlaying)

    if (!isPlaying) {
      ref.current.play()
    } else {
      ref.current.pause()
    }
  }

  return (
      <div className="videoDiv">
        <button type="button" id="videoButton" onClick={handleClick}>
          <video
            disablePictureInPicture
            playsInline
            controls
            ref={ref}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            src={videoLink}
            type="video/mp4"
          />
        </button>
        <p className="videoText">Please give the video time to load.</p>
      </div>
  )
}

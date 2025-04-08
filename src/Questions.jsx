import { useState } from 'react'
import BeginnerQuestions from './BeginnerQuestions.jsx'
import IntermediateQuestions from './IntermediateQuestions.jsx'
import AdvancedQuestions from './AdvancedQuestions.jsx'

AWS.config.update({
  accessKeyId: "DO00JV9GL7CYLW8G8E3D",
  secretAccessKey: "A+h2NgptkKly2VYNZxz7sRX/bfTWDDQkl1MWVMzwTFU",
});

const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  s3ForcePathStyle: true,
});

const params = {
  Bucket: "hoftfiles",
  prefix: "answerVideos/",
};

export default function Questions({count, setTestState, setCount, level, 
    firstName, lastName, email}) {
  const [recordingStatus, setRecordingStatus] = useState("inactive")
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [videoBlob, setVideoBlob] = useState(null)

  function getCurrentTime() {
    let date = new Date()
    let hours = date.getHours()
    let minutes = ("0" + date.getMinutes()).slice(-2)
    let seconds = ("0" + date.getSeconds()).slice(-2)
    return `${hours}:${minutes}:${seconds}`
  }

  // Submits the question once a response video has been
  // recorded
  function handleSubmit(total) {
    // Scrolls back to the top of the page
    window.scrollTo(0, 0)
    // If there aren't any more questions, mark the test
    // as finished
    if (count < total) {
      setCount(count + 1)
    }
    else {
      setTestState("finished")
    }
    // Uploads a file containing videoBlob in the file
    // AnswerVideos/lastName_firstName_email/date/ under the
    // name Answer_n_time_level
    let timestamp = getCurrentTime()
    const fileName = `Answer_${count + 1}_${timestamp}_${level}.mp4`;
    const file = new File([videoBlob], fileName, { type: "video/mp4" });
    const dateStamp = new Date().toLocaleDateString().replace(/\//g, ".");
    const params = {
      Bucket: "hoftfiles",
      Key: "answerVideos/" + lastName.current + "_" + firstName.current + 
        "_" + email.current + "/" + dateStamp + "/" + file.name + "",
      Body: file,
      ACL: "public-read",
    }

    s3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    })
    // Resets videoBlob
    setVideoBlob(null)
    setRecordedVideo(null)
  }

  if (level == "beginner") {
    return (
      <>
        <BeginnerQuestions
          count={count}
          handleSubmit={handleSubmit}
          setVideoBlob={setVideoBlob}
          setRecordedVideo={setRecordedVideo}
          recordedVideo={recordedVideo}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
      </>
    )
  }
  else if (level == "intermediate") {
    return (
      <>
        <IntermediateQuestions
          count={count}
          handleSubmit={handleSubmit}
          setVideoBlob={setVideoBlob}
          setRecordedVideo={setRecordedVideo}
          recordedVideo={recordedVideo}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
      </>
    )
  }
  else {
    return (
      <>
        <AdvancedQuestions
          count={count}
          handleSubmit={handleSubmit}
          setVideoBlob={setVideoBlob}
          setRecordedVideo={setRecordedVideo}
          recordedVideo={recordedVideo}
          recordingStatus={recordingStatus}
          setRecordingStatus={setRecordingStatus}
        />
      </>
    )
  }
}

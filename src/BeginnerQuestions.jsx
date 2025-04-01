import './App.css'
import QuestionVideo from './QuestionVideo.jsx'
import VideoRecorder from './VideoRecorder.jsx'

// In seconds
const answerDurationMap = [
  6,
  11,
  6,
  16,
  16,
  11,
  16,
  16,
  31,
  31,
  31,
  0
]

const questionVideoMap = [
  "bqv1.MOV",
  "bqv2.MOV",
  "bqv4.MOV",
  "bqv5.MOV",
  "bqv6.MOV",
  "bqv7.MOV",
  "bqv8.MOV",
  "bqv9.MOV",
  "bqv12.MOV",
  "bqv13.MOV",
  "bqv14.MOV",
  "endofInterview.MOV"
]

const extraContentMap = {
  1: "question 1",
  2: "question 2",
  3: "question 3",
  4: "question 4"
}

AWS.config.update({
  accessKeyId: "DO00JV9GL7CYLW8G8E3D",
  secretAccessKey: "A+h2NgptkKly2VYNZxz7sRX/bfTWDDQkl1MWVMzwTFU",
})

const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com")
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
})

const videoSources = questionVideoMap.map((key) => {
  const params = {
    Bucket: "hoftfiles",
    Key: `questionVideos/beginnerQuestionVideos/${key}`,
    Expires: 60 * 30,
  }
  return s3.getSignedUrl("getObject", params)
})
console.log(videoSources)

export default function BeginnerQuestions({count, handleSubmit}) {
  const total = 12

  return (
    <>
      <h2>Beginner Test</h2>
      <p>Question {count} of {total}</p>
      <QuestionVideo
        videoLink={questionVideoMap[count-1]}
      />
      <p>{extraContentMap[count]}</p>
      <VideoRecorder
        handleSubmit={handleSubmit}
        total={total}
        answerDuration={answerDurationMap[count-1]}
      />
    </>
  )
}

let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-content");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-content");
let captureBtn = document.querySelector(".capture-button");
let transparentColor = "transparent"  ;

let recordFlag = false;
let recorder;// store undefined
let chunks = []; //media data is stored in chunks
let constraints = {
    audio:true,
    video:true,
}
//navigator is a global object in the browser that provides information about the browser and its environment.
navigator.mediaDevices.getUserMedia(constraints)//getUserMedia() ask permission that can i use your camera and microphone
.then((stream) =>{
    video.srcObject = stream; //stream is actually a complex data that we are actually seeing on screen  
    recorder = new MediaRecorder(stream);//constructor function
    recorder.addEventListener("start",(e)=>{
        chunks=[];

    })
    recorder.addEventListener("dataavailable",(e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //convert the media chunks to video
        let blob = new Blob(chunks,{type: "video/mp4"});
        let videoUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoUrl; 
        a.download = "stream.mp4";
        a.click();
    })
    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;
        recordFlag = !recordFlag;
        if(recordFlag){//start
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer()
        }
        else{
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })
});

//Video is actually captured as chenks, but what these chunks will have?
//Each chunk will be having a frame, image is actually a frame
  
captureBtnCont.addEventListener("click",(e) => {
    captureBtnCont.classList.add("scale-capture"); //adding animations

    let canvas = document.createElement("canvas"); // canvasAPI search in google for it and its methods.
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let imageURL = canvas.toDataURL("image/jpeg", 1.0);
    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //filtering 
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0, canvas.width, canvas.height);
    
    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    //remove animations
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    },500)
})

//filtering logic
let filter = document.querySelector(".filter-layer")
let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) =>{
        //get style 
        transparentColor= getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
})








let timerId ;
let counter = 0; // Represents total seconds
let timer = document.querySelector(".timer");
function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        /*How to caluculate the time is that
        1) Intialize a variable that actually stores no.of seconds
        2) When over this function displayTimer is called then we need to increment the 
        counter variable, as each of this function is considered as 1sec in regular time. Why? because we need to get the actual time when
        this thing needs counted.
        
        How to count Hours, minutes and seconds?
        counter = 3725
        we know that 1 hour = 3600 sec,
        to count 1hr using counter value, we use '/(division operator)'
        between counter and 3600 sec. divison operator is used to perform floor division 
        3725/3600 = >1
        remainder 3725%3600 => no.of minutes in seconds, so we need to convert back to minutes, 1min = 60secs
        */  
       let totalSeconds = counter;
       let hours = Number.parseInt(totalSeconds / 3600);
       totalSeconds = totalSeconds % 3600
       let minutes = Number.parseInt(totalSeconds / 60);
       totalSeconds = totalSeconds % 60;
       let seconds = totalSeconds;
        hours = (hours<10) ? `0${hours}`: hours;
        minutes = (minutes<10)?`0${minutes}`: minutes;
        seconds = (seconds<10) ? `0${seconds}` : seconds;

       timer.innerText = `${hours}:${minutes}: ${seconds}`;
       counter ++;
    }
    timerId=setInterval(displayTimer,1000);//we are calling this function displayTimer()
 }

 function stopTimer(){
    clearInterval(timerId); 
    timer.innerText = "00:00:00";
    timer.style.display ="none";
 }
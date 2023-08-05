  import { useState, useRef } from "react";
  // import { Webcam } from "../../utils/webcam";
  import { Button } from "@mui/material";
  import Dialogs from "./Dialog";
  import axios from "axios";

  const ButtonHandler = ({
    imageRef,
    cameraRef,
    countnumber,
    webcam,
    streaming,
    setStreaming,
  }) => {
    
    // const webcam = new Webcam(); // webcam handler
    // const [streaming, setStreaming] = useState(null); // streaming state
    const inputImageRef = useRef(null); // video input reference
    const [showCountButton, setShowCountButton] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [countResponse, setcountResponse] = useState(-1)
    const handleClickOpen = () => {
      webcam.close(cameraRef.current);
      setOpenDialog(true);
      // เรียกใช้ API เพื่อบันทึกข้อมูล และ นำ response data ไปแสดงบน Dialog
        axios
          .post("http://localhost:3001/save-data", { count: countnumber })
          .then((response) => {
            console.log('response data : ',response.data.count);
            setcountResponse(response.data.count)
          })
          .catch((error) => {
            console.error("เกิดข้อผิดพลาดในการเรียกใช้ API:", error);
          });
    };
    // const handleClickOpen = () => {
    //   webcam.close(cameraRef.current);
    //   try {
    //     // เรียกใช้ API เพื่อบันทึกข้อมูล
    //     axios.post("http://localhost:3001/save-data", { count: countnumber }).then((response) => {
    //       seta(countnumber)
    //       setChangeCountnumber(false)
    //     });

    //     // ทำอย่างอื่นที่ต้องการหลังจาก API call เสร็จสมบูรณ์ (เปิด Dialog)
    //     webcam.open(cameraRef.current);
    //     setTimeout(() => {
    //       setOpenDialog(true);
    //     }, 500);
    //   } catch (error) {
    //     console.error("เกิดข้อผิดพลาดในการเรียกใช้ API:", error);
    //   }
    // };
    const handleClose = () => {
      setOpenDialog(false);
      webcam.open(cameraRef.current);
    };

    // closing image
    const closeImage = () => {
      const url = imageRef.current.src;
      imageRef.current.src = "#"; // restore image source
      URL.revokeObjectURL(url); // revoke url

      setStreaming(null); // set streaming to null
      inputImageRef.current.value = ""; // reset input image
      imageRef.current.style.display = "none"; // hide image
    };
    return (
      <div className="btn-container">
        {/* Image Handler */}
        {/* <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const url = URL.createObjectURL(e.target.files[0]); // create blob url
            imageRef.current.src = url; // set video source
            imageRef.current.style.display = "block"; // show video
            setStreaming("image"); // set streaming to video
          }}
          ref={inputImageRef}
        /> */}
        {/* <Button variant="outlined" sx={{mr:1, mt:2}}
          onClick={() => {
            // if not streaming
            if (streaming === null) inputImageRef.current.click();
            // closing image streaming
            else if (streaming === "image") closeImage();
            else alert(`Can't handle more than 1 stream\nCurrently streaming : ${streaming}`); // if streaming video or webcam
          }}
        >
          {streaming === "image" ? "Close" : "Open"} Image
        </Button> */}

        {showCountButton && (
          <Dialogs
            countnumber={countResponse}
            openDialog={openDialog}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          />
        )}  

        {/* Webcam Handler */}
        <Button
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={() => {
            // if not streaming
            if (streaming === null || streaming === "image") {
              // closing image streaming
              if (streaming === "image") closeImage();
              webcam.open(cameraRef.current); // open webcam
              cameraRef.current.style.display = "block"; // show camera
              setStreaming("camera"); // set streaming to camera
              setShowCountButton(true);
            }
            // closing video streaming
            else if (streaming === "camera") {
              webcam.close(cameraRef.current);
              cameraRef.current.style.display = "none";
              setStreaming(null);
              setShowCountButton(false);
            } else
              alert(
                `Can't handle more than 1 stream\nCurrently streaming : ${streaming}`
              ); // if streaming video
          }}
        >
          {streaming === "camera" ? "Close" : "Open"} Webcam
        </Button>
      </div>
    );
  };

  export default ButtonHandler;

const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3001;

const cors = require('cors');

app.use(express.json());

app.use(cors());

const corsOptions = {
  origin: 'http://127.0.0.1:5173', // กำหนดโดเมนและพอร์ตของแอปพลิเคชัน React
};

app.use(cors(corsOptions));

// app.post("/save-data", (req, res) => {
//   const { count } = req.body;

//   // สร้างวันที่และเวลาปัจจุบัน
//   const now = new Date();
//   const dateTime = now.toLocaleString(); // หรือรูปแบบอื่น ๆ ที่คุณต้องการ

//   // สร้างข้อมูล CSV ที่มีคอลัมน์ใหม่
//   const data = `${count},${dateTime}\n`; // ใช้เครื่องหมาย , เพื่อแยกคอลัมน์

//   // บันทึกข้อมูลลงในไฟล์ CSV
//   fs.appendFile("data.csv", data, (err) => {
//     if (err) {
//       console.error("เกิดข้อผิดพลาดในการบันทึกไฟล์ CSV:", err);
//       res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกไฟล์ CSV" });
//     } else {
//       console.log("บันทึกข้อมูลเรียบร้อยแล้ว",dateTime);
//       res.status(200).json({ success: true });
//     }
//   });
// });


app.post("/save-data", (req, res) => {
  const { count } = req.body;

  // สร้างวันที่และเวลาปัจจุบัน
  const now = new Date();
  const dateTime = now.toLocaleString(); // หรือรูปแบบอื่น ๆ ที่คุณต้องการ

  // สร้างข้อมูล CSV ที่มีคอลัมน์ใหม่
  const data = `${count},${dateTime}\n`; // ใช้เครื่องหมาย , เพื่อแยกคอลัมน์

  // บันทึกข้อมูลลงในไฟล์ CSV
  fs.appendFile("data.csv", data, (err) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการบันทึกไฟล์ CSV:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกไฟล์ CSV" });
    } else {
      console.log("บันทึกข้อมูลเรียบร้อยแล้ว", dateTime);
      // อ่านไฟล์ CSV เพื่อดึงข้อมูลล่าสุดที่บันทึกเข้าไป
      fs.readFile("data.csv", "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading CSV file:", err);
          res.status(500).json({ error: "Error reading CSV file" });
        } else {
          // แยกแถวของ CSV
          const lines = data.trim().split("\n");
          // ดึงข้อมูลล่าสุดจากแถวสุดท้าย
          const lastLine = lines[lines.length - 1];
          // แยกคอลัมน์
          const [lastCount, lastDateTime] = lastLine.split(",");
          res.status(200).json({ count: lastCount }); // ส่งข้อมูล count กลับไปใน response
        }
      });
    }
  });
});

app.get("/get-data", (req, res) => {
  fs.readFile("data.csv", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading CSV file:", err);
      res.status(500).json({ error: "Error reading CSV file" });
    } else {
      res.send(data);
    }
  });
});
app.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์เริ่มต้นที่พอร์ต ${PORT}`);
});

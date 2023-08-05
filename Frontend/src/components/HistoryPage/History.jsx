import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import "./History.css";
import HistoryChart from "./HistoryChart";


function History() {
  const [csvData, setCsvData] = useState([]);
  const [chartData, setchartData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    console.log("OpenHistory");
    // เรียกใช้ API เพื่อดึงข้อมูล CSV
    axios.get("http://localhost:3001/get-data").then((response) => {
      // ตัวอย่างข้อมูล CSV
      const Data = response.data;

      // แปลง CSV เป็นอาร์เรย์
      const lines = Data.trim().split("\n");
      const headers = lines[0].split(",").map((header) => header.trim()); // แก้ไขนี้
      const csvArray = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim()); // แก้ไขนี้
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });
      const clonedCsvArray = [...csvArray]; // Clone csvArray ก่อนที่จะ reverse เพราะหาก reverse แล้วข้างบนจะโดนผลกระทบไปด้วย
      setchartData(clonedCsvArray)
      setCsvData(csvArray.reverse()); // .reverse() คือเรียงข้อมูลจากล่างขึ้นบน
      //console.log(clonedCsvArray);
      //console.log(csvData[0].FISH);
      // console.log(csvArray);
      // console.log(csvArray[0]);
      // console.log(csvArray[0].FISH);
      // console.log(csvArray[0]["DATETIME"]);
    });
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedData = csvData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="History">
      <h1>History Page</h1>
      <div className="PaperWrapper">
        <Paper sx={{ overflow: "hidden" }} className="CenterPaper">
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table
              stickyHeader
              aria-label="sticky table"
              className="TableContainer"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Fish</TableCell>
                  <TableCell>Date/Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.FISH}</TableCell>
                    <TableCell>{row.DATETIME}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={csvData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Paper sx={{ overflow: "hidden" }} className="CenterPaper2">
          <HistoryChart data={chartData} />
        </Paper>
      </div>
    </div>
  );
}

export default History;

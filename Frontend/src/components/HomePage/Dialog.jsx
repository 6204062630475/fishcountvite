import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
// import Slide from '@mui/material/Slide';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
export default function CustomizedDialogs({
  countnumber,
  openDialog,
  handleClickOpen,
  handleClose,
}) {
  // const [a, seta] = useState(-1);
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);                      ////
  // };                               ย้ายไป btn-handler
  // const handleClose = () => {           ////
  //   setOpen(false);
  // };
  // const [csvData, setCsvData] = useState([]);
  // useEffect(() => {
  //   // เรียกใช้ API เพื่อดึงข้อมูล CSV
  //   axios.get("http://localhost:3001/get-data").then((response) => {
  //     // ตัวอย่างข้อมูล CSV
  //     const Data = response.data;

  //     // แปลง CSV เป็นอาร์เรย์
  //     const lines = Data.trim().split("\n");
  //     const headers = lines[0].split(",").map((header) => header.trim()); // แก้ไขนี้
  //     const csvArray = lines.slice(1).map((line) => {
  //       const values = line.split(",").map((value) => value.trim()); // แก้ไขนี้
  //       const row = {};
  //       headers.forEach((header, index) => {
  //         row[header] = values[index];
  //       });
  //       return row;
  //     });
  //     setCsvData(csvArray.reverse()); // .reverse() คือเรียงข้อมูลจากล่างขึ้นบน
  //     seta(csvData[0].FISH)
  //     console.log(csvData)
  //     console.log(csvData[0].FISH)
  //   });
  // }, [openDialog]);
  
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{ mr: 1, mt: 2 }}
      >
        Count
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        // TransitionComponent={Transition}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Number of fish
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography variant="h5">Number of fish = {countnumber}</Typography>
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save
          </Button>
        </DialogActions> */}
      </BootstrapDialog>
    </div>
  );
}

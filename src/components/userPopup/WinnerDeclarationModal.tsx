/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  setIsHeaderRefreshed,
  setIsRefreshed,
} from "../../store/slices/userSlice";
import { showToast } from "../../lib/utils";
import API from "../../api";
import { useGlobalLoaderContext } from "../../helpers/GlobalLoader";
import { useAppSelector } from "../../store/hooks";

interface WinnerDeclarationModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const isValidMobile = (mobile: string): boolean => {
  return /^[6-9]\d{9}$/.test(mobile);
};

const WinnerDeclarationModal: React.FC<WinnerDeclarationModalProps> = ({
  open,
  onClose,
}) => {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [mobile, setMobile] = useState("");
  const [csvMobiles, setCsvMobiles] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useGlobalLoaderContext();
  const isHeaderRefresh = useAppSelector((state) => state.user.isHeaderRefresh);

  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "manual" | "csv" | null
  ) => {
    if (newMode) {
      setMode(newMode);
      setMobile("");
      setCsvMobiles([]);
      setFileName("");
    }
  };

  const handleManualChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setCsvMobiles([]);
    setFileName("");

    if (!file) {
      showToast("error", "No file selected.");
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      showToast("error", "Please upload a valid CSV file.");
      return;
    }

    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim().replace(/^"|"$/g, ""))
        .filter((line) => isValidMobile(line));

      if (lines.length === 0) {
        showToast("error", "No valid mobile numbers found.");
        return;
      }

      if (lines.length > 200) {
        showToast("error", "Maximum 200 mobile numbers allowed.");
        return;
      }

      setCsvMobiles(lines);
      setFileName(file.name);
    } catch {
      showToast("error", "Failed to read the file. Please try again.");
    }
  };

 const handleSubmit = async () => {
  showLoader("Declaring winner(s)...");

  try {
    const payload =
      mode === "manual"
        ? { mobile, date: selectedDate }
        : { mobiles: csvMobiles, date: selectedDate };

    const response = await API.userAction("declareWinner", payload);

    // If backend returns something like success: false or empty data
    if (!response) {
      showToast("error", "User not found for winner");
    } else {
      dispatch(setIsRefreshed(true));
      dispatch(setIsHeaderRefreshed(!isHeaderRefresh));

      showToast("success", "Winner(s) declared successfully!");
      handleClose();
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message?.toLowerCase?.().includes("not found")
        ? "User not found for winner"
        : error?.response?.data?.message || "Submission failed";

    showToast("error", message);
  } finally {
    hideLoader();
  }
};


  const handleClose = () => {
    setMobile("");
    setCsvMobiles([]);
    setFileName("");
    setMode("manual");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  const isSubmitEnabled =
    (mode === "manual" && isValidMobile(mobile)) ||
    (mode === "csv" && csvMobiles.length > 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ position: "relative", pt: 6 }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography fontWeight="bold" fontSize={20} textAlign="center">
          Winner Declaration
        </Typography>

        <Box mt={3} textAlign="center">
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
          >
            {/* <ToggleButton value="manual">Enter Mobile</ToggleButton> */}
            {/* <ToggleButton value="csv">Upload CSV</ToggleButton> */}
          </ToggleButtonGroup>
        </Box>

        {mode === "manual" && (
          <Box mt={0}>
            <Typography fontWeight="bold">Mobile Number</Typography>
            <TextField
              value={mobile}
              onChange={handleManualChange}
              placeholder="Enter 10-digit mobile"
              fullWidth
              inputProps={{ maxLength: 10 }}
              error={mobile.length > 0 && !isValidMobile(mobile)}
              helperText={
                mobile.length > 0 && !isValidMobile(mobile)
                  ? "Must be 10 digits starting with 6-9"
                  : " "
              }
            />
          </Box>
        )}

        {mode === "csv" && (
          <Box mt={3}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              fullWidth
            >
              {fileName || "Choose CSV File"}
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={handleFileChange}
              />
            </Button>
            {csvMobiles.length > 0 && (
              <Typography mt={1} variant="body2" color="green">
                {csvMobiles.length} mobile number(s) loaded
              </Typography>
            )}
          </Box>
        )}

        {/* Date Field */}
        <Box mt={1}>
          <Typography fontWeight="bold">Select Date</Typography>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Button
          sx={{ mt: 4, mb: 2 }}
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={!isSubmitEnabled}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerDeclarationModal;

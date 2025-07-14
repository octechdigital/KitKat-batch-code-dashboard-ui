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
import { AddCodeResponse } from "../../interface/api";

const isValidBatchCode = (code: string) => /^[a-zA-Z0-9]{7}$/.test(code);

interface AddBatchCodeModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const AddBatchCodeModal: React.FC<AddBatchCodeModalProps> = ({
  open,
  onClose,
}) => {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [batchCode, setBatchCode] = useState("");
  const [csvCodes, setCsvCodes] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useGlobalLoaderContext();
  const isHeaderRefresh = useAppSelector((state) => state.user.isHeaderRefresh);

  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "manual" | "csv" | null
  ) => {
    if (newMode) {
      setMode(newMode);
      setBatchCode("");
      setCsvCodes([]);
      setFileName("");
    }
  };

  const handleManualChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 7 && /^[a-zA-Z0-9]*$/.test(value)) {
      setBatchCode(value);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Reset state
    setCsvCodes([]);
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
        .map((line) => line.trim().replace(/^"|"$/g, "").toUpperCase())
        .filter((line) => line && line !== "CODE");

      if (lines.length === 0) {
        showToast("error", "No valid batch codes found in the CSV.");
        return;
      }

      if (lines.length > 200) {
        showToast("error", "You can upload a maximum of 200 batch codes only.");
        return;
      }

      setCsvCodes(lines);
      setFileName(file.name);
    } catch {
      showToast("error", "Failed to read the file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    showLoader("Submitting batch code(s)...");

    try {
      const payload =
        mode === "manual" ? { code: batchCode } : { codes: csvCodes };

      const response = await API.userAction<AddCodeResponse>("addCode", payload);
      const existingCodes = response.exist ?? [];

      dispatch(setIsRefreshed(true));
      dispatch(setIsHeaderRefreshed(!isHeaderRefresh));

      if (existingCodes.length > 0) {
        const formattedCodes = existingCodes.join(", ");
        showToast("exist", `The following code(s) already exist:\n${formattedCodes}`);
      } else {
        showToast("success", response.message || "Batch code(s) added successfully!");
      }

      handleClose();
    } catch (error: any) {
      showToast("error", error?.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
    }
  };

  const handleClose = () => {
    setBatchCode("");
    setCsvCodes([]);
    setFileName("");
    setMode("manual");
    onClose();
  };

  const isSubmitEnabled =
    (mode === "manual" && isValidBatchCode(batchCode)) ||
    (mode === "csv" && csvCodes.length > 0);

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
          Britannia Breads – Batch Code Entry
        </Typography>

        <Box mt={3} textAlign="center">
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            fullWidth
          >
            <ToggleButton value="manual">Enter Code</ToggleButton>
            <ToggleButton value="csv">Upload CSV</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {mode === "manual" && (
          <Box mt={3}>
            <Typography fontWeight="bold">Batch Code</Typography>
            <TextField
              value={batchCode}
              onChange={handleManualChange}
              placeholder="Enter code (7 characters)"
              fullWidth
              inputProps={{ maxLength: 7 }}
              error={batchCode.length > 0 && !isValidBatchCode(batchCode)}
              helperText={
                batchCode.length > 0 && !isValidBatchCode(batchCode)
                  ? "Only letters and numbers allowed (7 chars)."
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
            {csvCodes.length > 0 && (
              <Typography mt={1} variant="body2" color="green">
                {csvCodes.length} batch code(s) loaded
              </Typography>
            )}
          </Box>
        )}

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

export default AddBatchCodeModal;

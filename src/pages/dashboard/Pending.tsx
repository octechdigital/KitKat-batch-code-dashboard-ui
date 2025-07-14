import React, { useState, useCallback } from "react";
import Header from "../../components/header/Header";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";
import ActiveInactivePopup from "../../components/ActiveInactivePopup/ActiveInactiePopup";
import { showToast } from "../../lib/utils";
import { useDispatch } from "react-redux";
import { setIsRefreshed } from "../../store/slices/userSlice"; // ✅ make sure this is correctly imported

const Pending: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const dispatch = useDispatch();

  const handlePopupOpen = useCallback((rowData: any) => {
    setSelectedRow(rowData);
    setPopupOpen(true);
  }, []);

  const handlePopupClose = () => {
    setPopupOpen(false);
    setSelectedRow(null);
  };

  const pendingColumnDefs = [
    { headerName: "Batch Code", field: "code" },
    // { headerName: "No of Used", field: "usedCount" },
    { headerName: "Created Date", field: "date" },
    {
      headerName: "Action",
      field: "status",
      cellRenderer: (params: any) => (
        <button
          style={{
            cursor: "pointer",
            color: "blue",
            border: "none",
            background: "none",
          }}
          onClick={() => handlePopupOpen(params.data)}
        >
          {params.value || "Change Status"}
        </button>
      ),
    },
  ];

  return (
    <>
      <Header />
      <GenericAgGrid
        title="Related Batch Codes"
        columnDefs={pendingColumnDefs}
        fetchData={API.getPendingData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="pending" shouldPlay={true} />}
      />

      <ActiveInactivePopup
        open={popupOpen}
        onClose={handlePopupClose}
        rowData={selectedRow}
        isActive={selectedRow?.status === "Active"} // assuming status is "active"/"inactive"
        onConfirm={(isActivating, rowData) => {
          return API.updateCodeStatus(rowData.code)
            .then(() => {
              showToast("success", "Status updated successfully.");
              handlePopupClose();
              dispatch(setIsRefreshed(true));
            })
            .catch(() => showToast("error", "Failed to update status."));
        }}
      />
    </>
  );
};

export default Pending;

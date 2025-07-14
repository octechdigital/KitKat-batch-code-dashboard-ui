/* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useCallback } from "react";
import Header from "../../components/header/Header";
import API from "../../api";
import GenericAgGrid from "../../components/agGrid/GenericAgGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import SectionAnim from "../../assets/lottie/SectionAnim";
// import ActiveInactivePopup from "../../components/ActiveInactivePopup/ActiveInactiePopup";
// import { showToast } from "../../lib/utils";
// import { useDispatch } from "react-redux";
// import { setIsRefreshed } from "../../store/slices/userSlice"; // ✅ make sure this is correctly imported

const Wiiner_List: React.FC = () => {
  const isRefreshed = useSelector((state: RootState) => state.user.isRefreshed);
  //   const [popupOpen, setPopupOpen] = useState(false);
  //   const [selectedRow, setSelectedRow] = useState<any>(null);

  //   const dispatch = useDispatch();

  //   const handlePopupOpen = useCallback((rowData: any) => {
  //     setSelectedRow(rowData);
  //     setPopupOpen(true);
  //   }, []);

  //   const handlePopupClose = () => {
  //     setPopupOpen(false);
  //     setSelectedRow(null);
  //   };

  const winnerListColumnDefs = [
    { headerName: "Mobile", field: "mobile" },
    { headerName: "Batch Code", field: "code" },
    { headerName: "Reward Code", field: "architectMobile" },
    { headerName: "Date", field: "date" },
  ];

  return (
    <>
      <Header />
      <GenericAgGrid
        title="Related Batch Codes"
        columnDefs={winnerListColumnDefs}
        fetchData={API.getPendingData}
        refreshStatus={isRefreshed}
        lottieFile={<SectionAnim type="pending" shouldPlay={true} />}
        hideActionButtons={true}
      />
    </>
  );
};

export default Wiiner_List;

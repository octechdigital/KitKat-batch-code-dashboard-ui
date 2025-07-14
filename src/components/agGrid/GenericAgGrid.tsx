import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";

import {
  ClientSideRowModelModule,
  ModuleRegistry,
  QuickFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  PaginationModule,
  CsvExportModule,
} from "ag-grid-community";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonTable from "../../components/skelitonTable/SkelitonTable";
import CustomNoRowsOverlay from "../../components/skelitonTable/CustomNoRowsOverlay";
import { store } from "../../store/store";
import { setIsRefreshed } from "../../store/slices/userSlice";
import DynamicLottie from "../../assets/lottie/DynamicLottie";
import { Add } from "@mui/icons-material";
import AddBatchCodeModal from "../userPopup/AddBatchCodeModal";
import AddIcon from '@mui/icons-material/Add';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  QuickFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule,
  PaginationModule,
  CsvExportModule,
]);

type GenericAgGridProps = {
  title: string;
  fetchData: () => Promise<any>;
  columnDefs: any[];
  refreshStatus: boolean;
  lottieFile: ReactNode;
};

const GenericAgGrid: React.FC<GenericAgGridProps> = ({
  title,
  fetchData,
  columnDefs,
  refreshStatus,
  lottieFile,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "69%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddBatch, setOpenAddBatch] = useState(false); // AddBatchCode

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      sortable: true,
      filter: true,
      minWidth: 100,
    }),
    []
  );
  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv();
  }, []);
  const fetchTableData = useCallback(() => {
    fetchData()
      .then((res) => {
        setRowData(res.data.userList);
        setLoading(false);
        store.dispatch(setIsRefreshed(false));
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [fetchData]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, [refreshStatus]);

  const onGridReady = useCallback(() => {
    fetchTableData();
  }, [fetchTableData]);

  useEffect(() => {
    // console.log("refreshStatus changed:", refreshStatus);
    if (refreshStatus) fetchTableData();
  }, [refreshStatus, fetchTableData]);

  const noRowsOverlayComponentParams = useMemo(() => {
    return {
      noRowsMessageFunc: () => "No data found",
    };
  }, []);

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [10, 20, 50, 100];
  }, []);

  const gridOptions = {
    suppressServerSideFullWidthLoadingRow: true,
  };

  const loadingOverlayComponentParams = useMemo(() => {
    return { loadingMessage: "One moment please..." };
  }, []);

  return (
    <div style={containerStyle}>
      <div className="grid-wrapper">
        <div className="grid-header">
          <div className="title-wrapper">
            <p className="header">{title}</p>
            {lottieFile}
          </div>

          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            disabled={!rowData}
            onInput={onFilterTextBoxChanged}
          />
          <div className="button-wrapper">
            <button
              style={{
                fontSize: "18px",
              }}
              className="add-campaign-button download"
              onClick={onBtnExport}
            >
              <DynamicLottie type="download" shouldPlay  />
            </button>
            <button
              style={{
                fontSize: "15px",
                
              }}
              className="add-campaign-button "
              onClick={() => setOpenAddBatch(true)}
            >
              <AddIcon sx={{ fontSize: "18px" }} /> Add Batch Code
            </button>
          </div>

          <AddBatchCodeModal
            open={openAddBatch}
            onClose={() => setOpenAddBatch(false)}
            userId={123} // replace with real ID
          />
        </div>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={paginationPageSizeSelector}
            gridOptions={gridOptions}
            loadingOverlayComponent={SkeletonTable}
            loadingOverlayComponentParams={loadingOverlayComponentParams}
            noRowsOverlayComponent={CustomNoRowsOverlay}
            noRowsOverlayComponentParams={noRowsOverlayComponentParams}
          />
        </div>
      </div>
    </div>
  );
};

export default GenericAgGrid;

import React from "react";
import type { INoRowsOverlayParams } from "ag-grid-community";

type CustomNoRowsOverlayParams = INoRowsOverlayParams & {
  noRowsMessageFunc: () => string;
};

const CustomNoRowsOverlay: React.FC<CustomNoRowsOverlayParams> = ({
  noRowsMessageFunc,
}) => {
  return (
    <div role="presentation" className="ag-overlay-loading-center">
      <i className="far fa-frown" aria-live="polite" aria-atomic="true">
        {noRowsMessageFunc()}
      </i>
    </div>
  );
};

export default CustomNoRowsOverlay;

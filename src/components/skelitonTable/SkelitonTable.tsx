import Skeleton from "react-loading-skeleton";
import { campaignColumnDefs } from "../../lib/consts";
import type { CustomLoadingOverlayProps } from "ag-grid-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SkeletonTable = (props: CustomLoadingOverlayProps) => {
  const skeletonRowCount = 7;

  return (
    <div className="ag-overlay-loading-center" role="presentation">
      <div
        role="presentation"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "38px",
        }}
        className="child"
      >
        <div
          role="presentation"
          style={{
            display: "flex",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderBottom: "1px solid #ddd",
          }}
        >
          {campaignColumnDefs.map((_col, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                fontWeight: "bold",
                textAlign: "left",
                padding: "5px",
              }}
            >
              <Skeleton height={20} width="80%" />
            </div>
          ))}
        </div>{" "}
        {Array.from({ length: skeletonRowCount }, (_, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {campaignColumnDefs.map((col, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  padding: "5px",
                }}
              >
                <Skeleton height={20} width={`${Math.random() * 80 + 20}%`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;

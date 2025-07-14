import "./Button.scss";
import API from "../../api";
import { useState, memo } from "react";
import { getMediaTypeFromSrc } from "../../lib/utils";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UserApproval from "../userPopup/UserApproval";
import { GenericRecord } from "../../interface/api";
import CircularProgress from "@mui/material/CircularProgress";
// import AddBatchCode from "../userPopup/AddBatchCode";
import AddBatchCodeModal from "../userPopup/AddBatchCodeModal";

interface ViewButtonRendererProps {
  props: any;
  pageType: "pendingPage" | "rejectedPage" | "approvePage" | "AddBatchCode";
}

/**
 * @component ViewButtonRenderer
 * @description
 * Renders a dynamic action button ("View" or "Review") based on media type and page context.
 * On click, it fetches user data and opens the UserApproval modal.
 *
 * @param {Object} props - Contains row data (`id`, `url`) from a grid or table.
 * @param {"pendingPage" | "rejectedPage" | "approvePage"} pageType - Current context of the page for determining button label and behavior.
 *
 * @example
 * <ViewButtonRenderer props={props} pageType="rejectedPage" />
 */

const ViewButtonRenderer: React.FC<ViewButtonRendererProps> = ({
  props,
  pageType,
}) => {
  const [data, setData] = useState<GenericRecord>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAddBatch, setOpenAddBatch] = useState(false);

  const id = props?.data?.id;
  const mediaType = getMediaTypeFromSrc(props?.data?.url);

  const handleModifyClick = async () => {
    setLoading(true);
    try {
      const resp = await API.getUserData(id);
      console.log(resp);
      const user = resp.data ?? {};
      setData(user);
      setOpen(true);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="modify-button bg"
        onClick={handleModifyClick}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <>
            {mediaType === "image" && <ImageIcon fontSize="small" />}
            {mediaType === "pdf" && <PictureAsPdfIcon fontSize="small" />}
            {mediaType === "video" && <VideoCameraBackIcon fontSize="small" />}
            {pageType === "rejectedPage" ? "Review" : "View"}
            {pageType === "AddBatchCode" ? "Review" : "View"}
          </>
        )}
      </button>

      {/* <UserApproval
        open={open}
        onClose={() => setOpen(false)}
        mediaSrc={data?.url as string}
        userData={data}
        pageType={pageType}
        userId={id}
      /> */}
      <AddBatchCodeModal
        open={openAddBatch}
        onClose={() => setOpenAddBatch(false)}
        userId={id}
      />
    </>
  );
};

export default memo(ViewButtonRenderer);

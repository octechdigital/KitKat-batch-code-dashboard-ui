import "./Header.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserCard from "../userCard/UserCard";
import { useEffect, useMemo, useState } from "react";
import API from "../../api";
import { GenericRecord } from "../../interface/api";
import { Skeleton, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { setIsRefreshed } from "../../store/slices/userSlice";

const Header = () => {
  const [countData, setCountData] = useState<GenericRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const isNewData = useSelector(
    (state: RootState) => state.user.isHeaderRefresh
  );
  const role = "Admin";
  const name = "User";

  useEffect(() => {
    API.dashboardCount()
      .then((res) => {
        setCountData(res.data);
        setTitle(res.title);
        dispatch(setIsRefreshed(true));
        console.log("--------------------------New Data--------------------------");
      })
      .catch(() => {
        setError("Failed to load data");
      })
      .finally(() => setLoading(false));
  }, [isNewData]);

  const renderedUserCards = useMemo(() => {
    return countData.map((data) => (
      <UserCard
        key={data.title as string}
        title={data.title as string}
        image={data.image as string}
        count={(data.value as number) ?? 0}
      />
    ));
  }, [countData]);

  const renderSkeletons = () => (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {[...Array(4)].map((_, i) => (
        <Grid
          key={i}
          size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ backgroundColor: "#fff", borderRadius: ".5rem" }}
        >
          <Box p={2} borderRadius={2} boxShadow={1}>
            <Skeleton
              variant="rectangular"
              height={55}
              sx={{ borderRadius: ".5rem" }}
            />
            <Skeleton width="60%" sx={{ mt: 1 }} />
            <Skeleton width="40%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <header>
        <p className="title">{title}</p>
        <section className="user-profile">
          <div className="p-l">
            <p className="username">Hi, {name}</p>
            <p className="role">{role}</p>
          </div>
          <div className="p-r">
            <AccountCircleIcon fontSize="large" className="user-icon" />
          </div>
        </section>
      </header>

      <div className="user-cards-wrapper">
        {loading ? (
          renderSkeletons()
        ) : error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <p>{error}</p>
          </Box>
        ) : (
          renderedUserCards
        )}
      </div>
    </>
  );
};

export default Header;

import React, { useState, createContext, useContext } from "react";
// import { HashLoader } from "react-spinners";

type ContextType = {
  showLoader: (loaderTitle?: string) => void;
  hideLoader: () => void;
};

const initalState: ContextType = {
  showLoader: () => {},
  hideLoader: () => {},
};

const styles: Record<string, React.CSSProperties> = {
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    maxWidth: "90%",
  },
  title: {
    fontSize: "18px",
    fontFamily: "verlag",
    textAlign: "center",
    color: "#fff",
  },
};

const GlobalLoaderContext = createContext(initalState);
export const useGlobalLoaderContext = () => useContext(GlobalLoaderContext);

export const GlobalLoader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loaderTitle, setLoaderTitle] = useState("");
  const showLoader = (loaderTitle?: string) => {
    setIsVisible(true);
    setLoaderTitle(loaderTitle || "Loading...");
  };

  const hideLoader = () => {
    setIsVisible(false);
  };

  const renderComponent = () => {
    if (!isVisible) {
      return null;
    }
    return (
      <div className="global-loader" style={styles.loader}>
        <div className="center" style={styles.center}>
          {/* <HashLoader color="#FDB913" /> */}
          <p className="title" style={styles.title}>
            {loaderTitle}
          </p>
        </div>
      </div>
    );
  };

  return (
    <GlobalLoaderContext.Provider value={{ showLoader, hideLoader }}>
      {renderComponent()}
      {children}
    </GlobalLoaderContext.Provider>
  );
};

import { makeStyles } from "@material-ui/styles";

import ArrowBackIosIcon from "@material-ui/icons/ChevronLeft";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ArrowForwardIosIcon from "@material-ui/icons/ChevronRight";

const styles = {
  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  skipWrapper: {
    cursor: "pointer",
  },
  firstPreviousWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  minusOneWrapper: {
    margin: 10,
    fontSize: "1rem",
    borderBottom: "3px solid black",
    cursor: "pointer",
  },
  secondMinusWrapper: {
    margin: 10,
    fontSize: "1.25rem",
    cursor: "pointer",
    borderBottom: "1px solid black",
  },
  secondMinusOneWrapper: {
    margin: 10,
    fontSize: "1.25rem",
    cursor: "pointer",
    borderBottom: "3px solid black",
  },
  pagePar: {
    margin: 10,
    fontSize: "1.75rem",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
  },
  firstPlusOne: {
    margin: 10,
    fontSize: "1.25rem",
    cursor: "pointer",
    borderTop: "3px solid black",
  },
  firstPlusTwo: {
    margin: 10,
    fontSize: "1.25rem",
    cursor: "pointer",
    borderTop: "1px solid black",
  },
  lastPageIcon: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    marginLeft: 5,
    width: 45,
  },
  empty: {
    width: 55,
    height: 53,
  },
};

const CustomPagination = ({ page, handleChangePage }) => {
  page = Number(page);

  const handlePageChange = (e) => {
    handleChangePage(e.target.id);
  };

  const handleFirstPage = () => {
    handleChangePage(1);
  };

  const handlePrevPage = () => {
    handleChangePage(page - 1);
  };
  const handleNextPage = () => {
    handleChangePage(page + 1);
  };

  return (
    <div style={styles.paginationWrapper}>
      {page > 3 ? (
        <div style={styles.empty}>
          <div onClick={handleFirstPage} style={styles.skipWrapper}>
            <FirstPageIcon fontSize="large" />
          </div>
        </div>
      ) : (
        <div style={styles.empty}></div>
      )}
      {page > 1 ? (
        <div style={styles.empty}>
          <div style={styles.skipWrapper}>
            <ArrowBackIosIcon fontSize="large" onClick={handlePrevPage} />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <div style={styles.empty}></div>
          <div style={styles.empty}></div>
        </div>
      )}
      {
        <div style={styles.firstPreviousWrapper}>
          {page === 1 ? (
            <div style={styles.empty}></div>
          ) : page === 2 ? (
            <div style={styles.firstPreviousWrapper}>
              <p style={styles.empty}></p>
              <div style={styles.empty}>
                <p
                  id={page - 1}
                  style={styles.minusOneWrapper}
                  onClick={handlePageChange}
                >
                  {page - 1}
                </p>
              </div>
            </div>
          ) : (
            <div style={styles.firstPreviousWrapper}>
              <div style={styles.empty}>
                <p
                  id={page - 2}
                  style={styles.secondMinusWrapper}
                  onClick={handlePageChange}
                >
                  {page - 2}
                </p>
              </div>
              <div style={styles.empty}>
                <p
                  id={page - 1}
                  style={styles.secondMinusOneWrapper}
                  onClick={handlePageChange}
                >
                  {page - 1}
                </p>
              </div>
            </div>
          )}
          <div style={styles.empty}>
            <p id={page} style={styles.pagePar} onClick={handlePageChange}>
              {page}
            </p>
          </div>
          <div style={styles.empty}>
            <p
              id={page + 1}
              style={styles.firstPlusOne}
              onClick={handlePageChange}
            >
              {page + 1}
            </p>
          </div>
          <div style={styles.empty}>
            <p
              id={page + 2}
              style={styles.firstPlusTwo}
              onClick={handlePageChange}
            >
              {page + 2}
            </p>
          </div>
        </div>
      }
      <div style={{ display: "flex" }}>
        <div style={styles.lastPageIcon}>
          <ArrowForwardIosIcon fontSize="large" onClick={handleNextPage} />
        </div>
        <div style={styles.empty}></div>
      </div>
    </div>
  );
};

export default CustomPagination;

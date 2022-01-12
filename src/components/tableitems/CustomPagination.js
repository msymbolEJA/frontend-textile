import { makeStyles } from "@material-ui/styles";

import ArrowBackIosIcon from "@material-ui/icons/ChevronLeft";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ArrowForwardIosIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
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
}));

const CustomPagination = ({ page, handleChangePage }) => {
  const classes = useStyles();

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
    <div className={classes.paginationWrapper}>
      {page > 3 ? (
        <div className={classes.empty}>
          <div onClick={handleFirstPage} className={classes.skipWrapper}>
            <FirstPageIcon fontSize="large" />
          </div>
        </div>
      ) : (
        <div className={classes.empty}></div>
      )}
      {page > 1 ? (
        <div className={classes.empty}>
          <div className={classes.skipWrapper}>
            <ArrowBackIosIcon fontSize="large" onClick={handlePrevPage} />
          </div>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <div className={classes.empty}></div>
          <div className={classes.empty}></div>
        </div>
      )}
      {
        <div className={classes.firstPreviousWrapper}>
          {page === 1 ? (
            <div className={classes.empty}></div>
          ) : page === 2 ? (
            <div className={classes.firstPreviousWrapper}>
              <p className={classes.empty}></p>
              <div className={classes.empty}>
                <p
                  id={page - 1}
                  className={classes.minusOneWrapper}
                  onClick={handlePageChange}
                >
                  {page - 1}
                </p>
              </div>
            </div>
          ) : (
            <div className={classes.firstPreviousWrapper}>
              <div className={classes.empty}>
                <p
                  id={page - 2}
                  className={classes.secondMinusWrapper}
                  onClick={handlePageChange}
                >
                  {page - 2}
                </p>
              </div>
              <div className={classes.empty}>
                <p
                  id={page - 1}
                  className={classes.secondMinusOneWrapper}
                  onClick={handlePageChange}
                >
                  {page - 1}
                </p>
              </div>
            </div>
          )}
          <div className={classes.empty}>
            <p id={page} className={classes.pagePar} onClick={handlePageChange}>
              {page}
            </p>
          </div>
          <div className={classes.empty}>
            <p
              id={page + 1}
              className={classes.firstPlusOne}
              onClick={handlePageChange}
            >
              {page + 1}
            </p>
          </div>
          <div className={classes.empty}>
            <p
              id={page + 2}
              className={classes.firstPlusTwo}
              onClick={handlePageChange}
            >
              {page + 2}
            </p>
          </div>
        </div>
      }
      <div style={{ display: "flex" }}>
        <div className={classes.lastPageIcon}>
          <ArrowForwardIosIcon fontSize="large" onClick={handleNextPage} />
        </div>
        <div className={classes.empty}></div>
      </div>
    </div>
  );
};

export default CustomPagination;

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
  },
}));

const CustomPagination = ({ page, setPage }) => {
  const classes = useStyles();

  const handlePageChange = (e) => {
    setPage(e.target.id);
  };

  page = Number(page);

  const handleFirstPage = () => {
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };
  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className={classes.paginationWrapper}>
      {page > 3 && (
        <div onClick={handleFirstPage} className={classes.skipWrapper}>
          <FirstPageIcon fontSize="large" />
        </div>
      )}
      {page > 1 && (
        <div className={classes.skipWrapper}>
          <ArrowBackIosIcon fontSize="large" onClick={handlePrevPage} />
        </div>
      )}
      {
        <div className={classes.firstPreviousWrapper}>
          {page === 1 ? null : page === 2 ? (
            <div className={classes.firstPreviousWrapper}>
              <p
                id={page - 1}
                className={classes.minusOneWrapper}
                onClick={handlePageChange}
              >
                {page - 1}
              </p>
            </div>
          ) : (
            <div className={classes.firstPreviousWrapper}>
              <p
                id={page - 2}
                className={classes.secondMinusWrapper}
                onClick={handlePageChange}
              >
                {page - 2}
              </p>
              <p
                id={page - 1}
                className={classes.secondMinusOneWrapper}
                onClick={handlePageChange}
              >
                {page - 1}
              </p>
            </div>
          )}
          <p id={page} className={classes.pagePar} onClick={handlePageChange}>
            {page}
          </p>
          <p
            id={page + 1}
            className={classes.firstPlusOne}
            onClick={handlePageChange}
          >
            {page + 1}
          </p>
          <p
            id={page + 2}
            className={classes.firstPlusTwo}
            onClick={handlePageChange}
          >
            {page + 2}
          </p>
        </div>
      }
      <div className={classes.lastPageIcon}>
        <ArrowForwardIosIcon fontSize="large" onClick={handleNextPage} />
      </div>
    </div>
  );
};

export default CustomPagination;

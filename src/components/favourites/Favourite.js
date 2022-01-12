import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { getQueryParams } from "../../helper/getQueryParams";
import { getFn } from "../../helper/PostData";
import CustomPagination from "../tableitems/CustomPagination";
import CustomTable from "../tableitems/customtable/CustomTable";

const Favourite = () => {
  const { id } = useParams();
  const history = useHistory();
  const filter = getQueryParams();
  const [td, setTd] = useState();
  const [page, setPage] = useState(filter.page);

  const getFav = () => {
    getFn(`etsy/findAllListingFavoredBy/?page=${page}&listing_id=${id}`).then(
      (response) => {
        const res = response?.data?.map((item) => {
          return {
            ...item,
            creation_tsz: item?.User?.creation_tsz,
            login_name: item?.User?.login_name,
          };
        });
        setTd(res);
      }
    );
  };

  useEffect(() => {
    getFav();
    // eslint-disable-next-line
  }, [page, id]);

  const tableHeader = [
    { id: 1, title: "User Id", type: "normal", key: "user_id" },
    { id: 2, title: "Login Name", type: "normal", key: "login_name" },
    { id: 3, title: "Create Date", type: "time", key: "create_date" },
    { id: 4, title: "Created TSZ", type: "time", key: "creation_tsz" },
  ];

  const handleChangePage = (pg) => {
    setPage(pg);
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set("page", pg);
    history.push(`${window.location.pathname}?${currentUrlParams.toString()}`);
  };
  return (
    <div>
      <h2>Favourite</h2>
      <CustomTable tableHeader={tableHeader} tableData={td} />
      {td && (
        <CustomPagination page={page} handleChangePage={handleChangePage} />
      )}
    </div>
  );
};

export default Favourite;

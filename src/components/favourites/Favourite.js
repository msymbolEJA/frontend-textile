import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getQueryParams } from "../../helper/getQueryParams";
import { getFn } from "../../helper/PostData";
import CustomPagination from "../tableitems/CustomPagination";
import CustomTable from "../tableitems/customtable/CustomTable";

const Favourite = () => {
  const { id } = useParams();
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
    { id: 1, title: "User Id", key: "user_id" },
    { id: 2, title: "Login Name", key: "login_name" },
    { id: 3, title: "Create Date", key: "create_date" },
    { id: 4, title: "Created TSZ", key: "creation_tsz" },
  ];
  return (
    <div>
      <h2>Favourite</h2>
      <CustomTable tableHeader={tableHeader} tableData={td} />
      {td && <CustomPagination page={page} setPage={setPage} />}
    </div>
  );
};

export default Favourite;

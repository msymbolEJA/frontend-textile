import { useState, useEffect } from "react";
import { getFn } from "../../helper/PostData";
import CustomTable from "../tableitems/customtable/CustomTable";

const Favourites = () => {
  const [td, setTd] = useState();
  const tableHeader = [
    { id: 1, title: "Listing Id", key: "listing_id" },
    { id: 2, title: "Views", key: "views" },
    { id: 3, title: "Num Favorers", key: "num_favorers" },
    { id: 4, title: "Title", key: "title", title2: "Url", key2: "url" },
    // { id: 3, title: "Description", key: "description" },
    { id: 6, title: "Creation TSZ", key: "original_creation_tsz" },
    { id: 7, title: "Last Modified", key: "last_modified_tsz" },
    { id: 8, title: "Price", key: "price" },
    { id: 9, title: "Currency", key: "currency_code" },
    // { id: 4, title: "Url", key: "url" },
  ];

  const getFavourites = () => {
    getFn("etsy/findShopListingsActive/").then((response) => {
      response.data.sort(function (a, b) {
        return parseFloat(b.num_favorers) - parseFloat(a.num_favorers);
      });
      setTd(response.data);
    });
  };

  useEffect(() => {
    getFavourites();
  }, []);

  return (
    <div>
      <CustomTable tableData={td} tableHeader={tableHeader} />
    </div>
  );
};

export default Favourites;

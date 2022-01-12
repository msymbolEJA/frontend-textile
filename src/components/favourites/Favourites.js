import { useState, useEffect } from "react";
import { getFn } from "../../helper/PostData";
import CustomTable from "../tableitems/customtable/CustomTable";

const Favourites = () => {
  const [td, setTd] = useState();
  const tableHeader = [
    {
      id: 1,
      title: "Listing Id",
      key: "listing_id",
      type: "innerUrl",
      url: "listing_id",
      beginningUrl: "favourites/",
      endingUrl: "?page=1",
    },
    { id: 2, title: "Views", type: "normal", key: "views" },
    { id: 3, title: "Num Favorers", type: "normal", key: "num_favorers" },
    {
      id: 4,
      title: "Title",
      key: "title",
      type: "outerUrl",
      title2: "Url",
      key2: "url",
    },
    {
      id: 6,
      title: "Creation TSZ",
      type: "time",
      key: "original_creation_tsz",
    },
    { id: 7, title: "Last Modified", type: "time", key: "last_modified_tsz" },
    { id: 8, title: "Price", type: "normal", key: "price" },
    { id: 9, title: "Currency", type: "normal", key: "currency_code" },
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

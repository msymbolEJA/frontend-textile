import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { updateDetailsMappingTable } from "../../../../helper/Constants";
import { getData, putData } from "../../../../helper/PostData";
import EditableTableCell from "./EditableTableCell";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const useStyles = makeStyles((theme) => ({
  thead: {
    backgroundColor: "rgb(100, 149, 237)",
    "& th": {
      color: theme.palette.common.white,
      textAlign: "center",
    },
  },
  tbody: {
    "& td": {
      textAlign: "center",
    },
  },
}));

const UpdateDetailsTable = ({ row }) => {
  const [data, setData] = useState([]);
  const classes = useStyles();

  const handleSendTrackingCode = () => {
    row?.receipt_id &&
      getData(`${BASE_URL}dhl/send_tracking_code_by_one/${row?.id}/`)
        .then((res) => {})
        .catch((err) => {
          console.log({ err });
        });
  };

  const handleEditChange = (content, name) => {
    putData(`${BASE_URL}etsy/ordersTable/${row?.receipt_id}/`, {
      ...row,
      [name]: content,
    })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => getDetailsForUpdate());
  };

  const getDetailsForUpdate = () => {
    row?.receipt_id &&
      getData(`${BASE_URL}etsy/ordersTable/${row?.receipt_id}/`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log({ err });
        });
  };

  useEffect(() => {
    getDetailsForUpdate();
  }, [row]);

  return (
    <div>
      <h1>Update Details</h1>
      <TableContainer>
        <Table>
          <TableHead className={classes.thead}>
            <TableRow>
              {updateDetailsMappingTable.map((item, index) => (
                <TableCell key={index}>{item.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.tbody}>
            <TableRow>
              {updateDetailsMappingTable.map((item, index) => {
                return (
                  <TableCell key={index}>
                    {item.type === "url" ? (
                      <a
                        href={data[item.objKey]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit
                      </a>
                    ) : item.type === "dropdown" ? (
                      <div>
                        {data[item.objKey]}
                        <select
                          onChange={(e) =>
                            handleEditChange(e.target.value, item.objKey)
                          }
                        >
                          <option value="" disabled selected>
                            Select your option
                          </option>

                          {item.values.map((value, index) => (
                            <option value={value.value} key={index}>
                              {value.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : item.type === "editable" ? (
                      <EditableTableCell
                        data={data}
                        name={item.objKey}
                        onChange={handleEditChange}
                      />
                    ) : (
                      data[item.objKey]
                    )}
                    {item.objKey === "tracking_code" ? (
                      <button onClick={handleSendTrackingCode}>Send</button>
                    ) : null}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UpdateDetailsTable;

const getHeaders = (data) => {
  let headerArr = [];
  let i = 0;
  for (i = 0; i < data.length; i++) {
    headerArr[i] = data[i].date;
  }
  return headerArr;
};

const getBodyItems = (data) => {
  let bodytemsArr = [];
  let i = 0;
  for (i = 0; i < data.length; i++) {
    bodytemsArr = [...bodytemsArr, data[i].orders];
  }
  return bodytemsArr;
};

export { getHeaders, getBodyItems };

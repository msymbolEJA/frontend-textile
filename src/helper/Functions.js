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

export function getDPI() {
  var div = document.createElement("div");
  div.style.height = "1in";
  div.style.width = "1in";
  div.style.top = "-100%";
  div.style.left = "-100%";
  div.style.position = "absolute";

  document.body.appendChild(div);

  var result = div.offsetHeight;

  document.body.removeChild(div);

  return result;
}

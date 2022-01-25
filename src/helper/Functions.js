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

export const repeatReplacerWithTR = (exp) => {
  return exp
    ?.replace("_", " ")
    ?.replace("REPEAT", "TEKRAR")
    ?.replace("MANUFACTURING ERROR", "ÜRETİM HATASI")
    ?.replace("LETTER_PATTERN_IS_WRONG", "HARF DİZİLİMİ YANLIŞ")
    ?.replace("WRONG_COLOR", "YANLIŞ RENK")
    ?.replace("STONE_FALL", "TAŞI DÜŞMÜŞ")
    ?.replace("DIFFERENT_PRODUCT", "FARKLI ÜRÜN")
    ?.replace("LONG_CHAIN", "ZİNCİR UZUN")
    ?.replace("SHORT_CHAIN", "ZİNCİR KISA")
    ?.replace("DIFFERENT_FONT", "FARKLI FONT")
    ?.replace("DISCOLORATION", "RENK ATMA")
    ?.replace(": BREAK OFF", ": KOPMA")
    ?.replace(": LOST IN MAIL", ": POSTA DA KAYBOLDU")
    ?.replace(": SECOND", ": DİĞER")
    ?.replace("&#039;", "'")
    ?.replace("&#39;", "'")
    ?.replace("&lt;", "<")
    ?.replace("&gt;", ">")
    ?.replaceAll(",", ", ");
};

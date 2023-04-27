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
    ?.replace("&#039;", "'")
    ?.replace("&#39;", "'")
    ?.replace("&lt;", "<")
    ?.replace("&gt;", ">")
    ?.replace(",", ", ");
};

export const notificationReplacer = (exp) => {
  return exp
    ?.replace("is_followup", "Takipte mi")
    ?.replace("true", "Evet")
    ?.replace("True", "Evet")
    ?.replace("false", "Hayır")
    ?.replace("False", "Hayır")
    ?.replace("status", "Durum")
    ?.replace("in_progress", "ISLEMDE")
    ?.replace("pending", "YENI")
    ?.replace("space", "Boşluk")
    ?.replace("test", "TEST")
    ?.replace("start", "Başlangıç")
    ?.replace("size", "Boyut")
    ?.replace("color", "Renk")
    ?.replace("message_from_buyer", "Alıcıdan Mesaj")
    ?.replace("buyer", "Alıcı")
    ?.replace("order_id", "Sipariş No")
    ?.replace("order_date", "Sipariş Tarihi")
    ?.replace("order_status", "Sipariş Durumu")
    ?.replace("order_type", "Sipariş Türü")
    ?.replace("tracking_code", "Takip Kodu")
    ?.replace("note", "Not")
    ?.replace("explanation", "Açıklama")
    ?.replace("cancelled", "İptal Edildi")
    ?.replace("awaiting", "BEKLEYEN")
    ?.replace("figma", "FİGMA")
    ?.replace("in_transit", "TRANSFER")
    ?.replace("length", "Uzunluk")
    ?.replace("width", "Genişlik")
    ?.replace("height", "Yükseklik")
    ?.replace("weight", "Ağırlık")
    ?.replace("qty", "Miktar")
    ?.replace("price", "Fiyat")
    ?.replace("personalization", "Kişiselleştirme")
    ?.replace("type", "Tip")
    ?.replace("ready_date", "Atölyeye Gönderilme Tarihi");
};

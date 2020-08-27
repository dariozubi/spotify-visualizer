export function getCookie (sKey) {
  if (!sKey) { return null; }
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

export function toMinutes (ms){
  let secs = Math.round(ms/1000);
  let mins = Math.floor(secs/60);
  return String(mins) + ":" + (secs%60 < 10 ? '0' : '') + String(secs%60);
}
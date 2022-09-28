let wait = (t = 1e3) =>
  new Promise(e => {
    setTimeout(e, t);
  });

let duration = (t, e = !0, o = !1) => {
  const r = t < 0 ? '- ' : '';
  t = Math.sqrt(t ** 2);
  let a = Math.floor(t / 31556952e3);
  t -= 31556952e3 * a;
  let n = a > 1 ? 's' : '';
  let $ = Math.floor(t / 2629746e3);
  t -= 2629746e3 * $;
  let s = Math.floor(t / 864e5);
  t -= 36e5 * s * 24;
  let u = s > 1 ? 's' : '';
  let l = Math.floor(t / 36e5);
  t -= 36e5 * l;
  let m = l > 1 ? 's' : '';
  let c = Math.floor(t / 6e4);
  t -= 6e4 * c;
  let i = c > 1 ? 's' : '';
  let d = Math.round(t / 1e3);
  return (
    `${r}${a > 0 && a < 1 / 0 ? `${a}${o ? 'a' : ` an${n}`} ` : ''}${$ > 0 ? `${$}${o ? 'mo' : ' month'} ` : ''}${
      s > 0 ? `${s}${o ? 'd' : ` day${u}`} ` : ''
    }${l > 0 ? `${l}${o ? 'h' : ` hour${m}`} ` : ''}${c > 0 ? `${c}${o ? 'm' : ` minutes${i}`} ` : ''}${
      d > 0 && e ? `${d}${o ? 's' : ` seconds${d > 1 ? 's' : ''}`} ` : ''
    }`.replace(/ $/g, '') || 'ø'
  );
};

let datetocompact = t => {
  t instanceof Date || (t = new Date(t));
  try {
    var e = t.getDate();
    var o = t.getMonth() + 1;
    var r = t.getFullYear().toString().substring(2, 4);
    var a = t.getHours();
    var n = t.getMinutes();
    var $ = t.getSeconds();
  } catch (t) {
    return '?';
  }
  return (
    e < 10 && (e = '0' + e),
    o < 10 && (o = '0' + o),
    r < 10 && (r = '0' + r),
    a < 10 && (a = '0' + a),
    n < 10 && (n = '0' + n),
    $ < 10 && ($ = '0' + $),
    e + '/' + o + '/' + r + ', ' + a + ':' + n + ':' + $
  );
};

let numberFormat = t => t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

module.exports = { wait: wait, duration: duration, datetocompact: datetocompact, numberFormat: numberFormat };

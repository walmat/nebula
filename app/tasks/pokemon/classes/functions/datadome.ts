import { Task } from '../../constants';

const { States } = Task;

export const getCookie = ({
  handler,
  userAgent,
  responsePage,
  jsType,
  ddv,
  cid
}: {
  handler: Function;
  userAgent: string;
  responsePage: string;
  jsType: string;
  ddv: string;
  cid: string;
}) => {
  return handler({
    endpoint: `https://dd.pokemoncenter.com/js/`,
    options: {
      method: 'POST',
      json: true,
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://www.pokemoncenter.com'
      },
      form: `jsData=%7B%22ttst%22%3A22.999999046325684%2C%22ifov%22%3Afalse%2C%22wdifts%22%3Atrue%2C%22wdifrm%22%3Afalse%2C%22wdif%22%3Afalse%2C%22br_h%22%3A984%2C%22br_w%22%3A893%2C%22br_oh%22%3A1095%2C%22br_ow%22%3A893%2C%22nddc%22%3A1%2C%22rs_h%22%3A1120%2C%22rs_w%22%3A1792%2C%22rs_cd%22%3A30%2C%22phe%22%3Afalse%2C%22nm%22%3Afalse%2C%22jsf%22%3Afalse%2C%22ua%22%3A%22${encodeURIComponent(
        userAgent
      )}%22%2C%22lg%22%3A%22en-US%22%2C%22pr%22%3A2%2C%22hc%22%3A16%2C%22ars_h%22%3A1095%2C%22ars_w%22%3A1741%2C%22tz%22%3A360%2C%22str_ss%22%3Atrue%2C%22str_ls%22%3Atrue%2C%22str_idb%22%3Atrue%2C%22str_odb%22%3Atrue%2C%22plgod%22%3Afalse%2C%22plg%22%3A5%2C%22plgne%22%3A%22NA%22%2C%22plgre%22%3A%22NA%22%2C%22plgof%22%3A%22NA%22%2C%22plggt%22%3A%22NA%22%2C%22pltod%22%3Afalse%2C%22hcovdr%22%3Afalse%2C%22plovdr%22%3Afalse%2C%22ftsovdr%22%3Afalse%2C%22hcovdr2%22%3Afalse%2C%22plovdr2%22%3Afalse%2C%22ftsovdr2%22%3Afalse%2C%22lb%22%3Afalse%2C%22eva%22%3A33%2C%22lo%22%3Afalse%2C%22ts_mtp%22%3A0%2C%22ts_tec%22%3Afalse%2C%22ts_tsa%22%3Afalse%2C%22vnd%22%3A%22Google%20Inc.%22%2C%22bid%22%3A%22NA%22%2C%22mmt%22%3A%22application%2Fpdf%2Ctext%2Fpdf%22%2C%22plu%22%3A%22PDF%20Viewer%2CChrome%20PDF%20Viewer%2CChromium%20PDF%20Viewer%2CMicrosoft%20Edge%20PDF%20Viewer%2CWebKit%20built-in%20PDF%22%2C%22hdn%22%3Afalse%2C%22awe%22%3Afalse%2C%22geb%22%3Afalse%2C%22dat%22%3Afalse%2C%22med%22%3A%22defined%22%2C%22aco%22%3A%22probably%22%2C%22acots%22%3Afalse%2C%22acmp%22%3A%22probably%22%2C%22acmpts%22%3Atrue%2C%22acw%22%3A%22probably%22%2C%22acwts%22%3Afalse%2C%22acma%22%3A%22maybe%22%2C%22acmats%22%3Afalse%2C%22acaa%22%3A%22probably%22%2C%22acaats%22%3Atrue%2C%22ac3%22%3A%22%22%2C%22ac3ts%22%3Afalse%2C%22acf%22%3A%22probably%22%2C%22acfts%22%3Afalse%2C%22acmp4%22%3A%22maybe%22%2C%22acmp4ts%22%3Afalse%2C%22acmp3%22%3A%22probably%22%2C%22acmp3ts%22%3Afalse%2C%22acwm%22%3A%22maybe%22%2C%22acwmts%22%3Afalse%2C%22ocpt%22%3Afalse%2C%22vco%22%3A%22probably%22%2C%22vcots%22%3Afalse%2C%22vch%22%3A%22probably%22%2C%22vchts%22%3Atrue%2C%22vcw%22%3A%22probably%22%2C%22vcwts%22%3Atrue%2C%22vc3%22%3A%22maybe%22%2C%22vc3ts%22%3Afalse%2C%22vcmp%22%3A%22%22%2C%22vcmpts%22%3Afalse%2C%22vcq%22%3A%22%22%2C%22vcqts%22%3Afalse%2C%22vc1%22%3A%22probably%22%2C%22vc1ts%22%3Afalse%2C%22dvm%22%3A8%2C%22sqt%22%3Afalse%2C%22so%22%3A%22landscape-primary%22%2C%22wbd%22%3Afalse%2C%22wbdm%22%3Atrue%2C%22wdw%22%3Atrue%2C%22cokys%22%3A%22bG9hZFRpbWVzY3NpYXBwcnVudGltZQ%3D%3DL%3D%22%2C%22ecpc%22%3Afalse%2C%22lgs%22%3Atrue%2C%22lgsod%22%3Afalse%2C%22bcda%22%3Atrue%2C%22idn%22%3Atrue%2C%22capi%22%3Afalse%2C%22svde%22%3Afalse%2C%22vpbq%22%3Atrue%2C%22xr%22%3Atrue%2C%22bgav%22%3Atrue%2C%22rri%22%3Atrue%2C%22idfr%22%3Atrue%2C%22ancs%22%3Atrue%2C%22inlc%22%3Atrue%2C%22cgca%22%3Atrue%2C%22inlf%22%3Atrue%2C%22tecd%22%3Atrue%2C%22sbct%22%3Atrue%2C%22aflt%22%3Atrue%2C%22rgp%22%3Atrue%2C%22bint%22%3Atrue%2C%22spwn%22%3Afalse%2C%22emt%22%3Afalse%2C%22bfr%22%3Afalse%2C%22dbov%22%3Afalse%2C%22glvd%22%3A%22Intel%20Inc.%22%2C%22glrd%22%3A%22Intel(R)%20UHD%20Graphics%20630%22%2C%22tagpu%22%3A7.3999998569488525%2C%22prm%22%3Atrue%2C%22tzp%22%3A%22America%2FDenver%22%2C%22cvs%22%3Atrue%2C%22usb%22%3A%22defined%22%7D&events=%5B%5D&eventCounters=%5B%5D&jsType=${jsType}&cid=${cid}&ddk=5B45875B653A484CC79E57036CE9FC&Referer=https%253A%252F%252Fwww.pokemoncenter.com%252F&request=%252F&responsePage=${responsePage}&ddv=${ddv}`
    },
    message: 'Initializing',
    from: States.GET_COOKIE
  });
};

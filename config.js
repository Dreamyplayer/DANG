export const generator = {
  length: 24,
  amount: 10000,
  outfile: './db/genrated_codes.txt',
};

const randomProxy = ['http', 'https', 'socks4', 'socks5'];

export const checker = {
  interval: 50,
  updateRate: 1000,
  proxiesType: randomProxy[Math.floor(Math.random() * randomProxy.length)],
  proxy: true,
  autoGrabProxies: true,
  debug: false,
  proxiesfile: './db/proxies.txt',
  codesfile: './db/genrated_codes.txt',

  bURL: 'https://discord.com/api/v9/entitlements/gift-codes/',
  params: '?with_application=false&with_subscription_plan=true',
};

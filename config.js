const generator = {
  length: 24,
  random: true,
  amount: 10000,
  outfile: "./db/codes/codes.txt",
};

const checker = {
  interval: 50,
  updateRate: 1000,
  proxiesType: "http",
  proxy: true,
  autoGrabProxies: true,
  debug: false,
  proxiesfile: "./db/proxies/proxies.txt",
  codesfile: "./db/codes/codes.txt",

  bURL: "https://discord.com/api/v9/entitlements/gift-codes/",
  params: "?with_application=false&with_subscription_plan=true",
};

module.exports = { generator, checker };

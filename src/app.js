const { chalk, fetch, clutter, makeid, E, Webhook } = require('./Global');

// NOTE: DON'T TRY TO DECREASE TIME
// THIS IS MINIMUM.

let num = 1;

(async function Loop() {
  let codes = clutter(makeid(24));
  const url = `https://discordapp.com/api/v6/entitlements/gift-codes/${codes}?with_application=false&with_subscription_plan=true`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => {
      if (res.status === 429) {
        process.exit(0);
      } else if (res.status === 200) {
        console.log(`🎉 Found Working Discord Nitro 🎉 \nhttps://discord.gift/${codes}`);

        const WEBHOOK_URL = undefined;
        if (WEBHOOK_URL === undefined) return;

        const hook = new Webhook(WEBHOOK_URL);
        const IMAGE_URL =
          'https://cdn.discordapp.com/attachments/851533693657808926/856145091688136714/ezgif.com-gif-maker_5.png';

        hook.setUsername('Discord Nitro Gen');
        hook.setAvatar(IMAGE_URL);

        hook.send(`🎉 Found Working Discord Nitro 🎉 \nhttps://discord.gift/${codes}`);
      } else {
        let x = 0;

        console.log(`\n${chalk.green('Testing')} ${chalk.magenta(num)}`);
        console.log(` ❌ ${chalk.green(res.ok)} || ${res.status} || ${chalk.blue(res.statusText)}\n`);

        const loader = setInterval(() => {
          process.stdout.write(`\r${E[x++]} Checking - ${chalk.yellow(codes)}`);
          x %= E.length;
        }, 550);

        setTimeout(() => {
          clearInterval(loader);
        }, 20000);
      }
    })
    .catch(console.error);

  setTimeout(async () => {
    num++;
    if (num < 5000) {
      await Loop();
    }
  }, 20000);
})();

console.log(chalk.blue.bold(`Press ${chalk.red('Cntrl + c')} to exit Script.`));

// Checking Memeory Status
setInterval(() => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  arr.reverse();

  const used = process.memoryUsage().heapUsed / 4096 / 4096;
  console.log(
    `${chalk.bold.cyan(`\n🐏 This Script uses approxiamately ${Math.round(used * 100) / 100} MB / 4GB RAM`)}`,
  );
}, 600000);

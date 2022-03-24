'use strict';
const {
  chalk,
  fetch,
  E,
  Webhook,
  RAN_GEN_1,
  RAN_GEN_2,
  RAN_GEN_3,
  RAN_GEN_4,
  RAN_GEN_Direct,
  RAN_GEN_Shuff,

  RAN_GEN_TOP,
  Welcome,
  RAN_GEN_4_C,
  RAN_GEN_Direct_C,
  
  totalRAM,
} = require('./Global');
const { WEBHOOK_URL } = require('./config');

console.log(Welcome);

// NOTE: DON'T TRY TO DECREASE TIME
// THIS IS MINIMUM.
setTimeout(() => {
  let num = 1;

  (async function Loop() {
    let nitro_premium = [
      RAN_GEN_1(24),
      RAN_GEN_2(24),
      RAN_GEN_3(24),
      RAN_GEN_4,
      RAN_GEN_Direct,

      RAN_GEN_TOP(24),
      RAN_GEN_Shuff(RAN_GEN_1(24)),
      RAN_GEN_Shuff(RAN_GEN_2(24)),
      RAN_GEN_Shuff(RAN_GEN_3(24)),
      RAN_GEN_Shuff(RAN_GEN_TOP(24)),
    ];

    let nitro_classic = [
      RAN_GEN_1(16),
      RAN_GEN_2(16),
      RAN_GEN_3(16),
      RAN_GEN_4_C,
      RAN_GEN_Direct_C,

      RAN_GEN_TOP(16),
      RAN_GEN_Shuff(RAN_GEN_1(16)),
      RAN_GEN_Shuff(RAN_GEN_2(16)),
      RAN_GEN_Shuff(RAN_GEN_3(16)),
      RAN_GEN_Shuff(RAN_GEN_TOP(16)),
    ];

    let classic = nitro_classic[Math.floor(Math.random() * nitro_classic.length)];
    let premium = nitro_premium[Math.floor(Math.random() * nitro_premium.length)];
    let final = [classic, premium];
    let codes = final[Math.floor(Math.random() * final.length)];

    const url = `https://discordapp.com/api/v8/entitlements/gift-codes/${codes}?with_application=false&with_subscription_plan=true`;

    await fetch(url, {
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

          if (WEBHOOK_URL === '') return;

          const hook = new Webhook(WEBHOOK_URL);
          const IMAGE_URL = 'https://discord.com/assets/b941bc1dfe379db6cc1f2acc5a612f41.png';

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
          }, 25000);
        }
      })
      .catch(console.error);

    setTimeout(async () => {
      num++;
      if (num < 10000) {
        await Loop();
      }
    }, 25000);
  })();
}, 15000);

setTimeout(() => {
  console.log(
    chalk.blue.bold(
      `Press ${chalk.red('Cntrl + c')} to exit Script.\n\n${chalk.magenta('Testing will start in 15 seconds\n')}`,
    ),
  );
}, 3000);

setTimeout(() => {
  if (WEBHOOK_URL === '') {
    console.log(
      `${chalk.yellow('⚠️ NOTE:')} If you haven't added WEBHOOK_URL, you won't be notified for Valid Nitro codes
        you should always keep an eye on Terminal/console for valid Nitro codes`,
    );
  }
}, 6000);

// Checking Memeory Status
setInterval(() => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  arr.reverse();

  const used = process.memoryUsage().heapUsed / 4096 / 4096;
  console.log(
    `${chalk.bold.cyan(
      `\n🐏 This Script uses approxiamately ${chalk.blue(Math.round(used * 100) / 100)} MB / ${(totalRAM / 1024 / 1024)
        .toFixed(0)
        .slice(0, 1)}GB RAM`,
    )}`,
  );
}, 600000);

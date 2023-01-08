require("dotenv").config();
const { Telegraf } = require("telegraf");
const postgres = require("./db/postgres");
const moment = require("moment")

const bot = new Telegraf(process.env.TOKEN);
bot.start(async (ctx) => {
  const { users } = await postgres();
  // console.log(ctx.message);
  let user_id = ctx.message.from.id;

  let user = await users.findOne({ where: { user_id } });
  if (!user) {
    user = await users.create({
      user_id,
    });
  }
  ctx.reply(
    "🇺🇿 Assalomu alaykum bu bot orqali Instagramdan video yuklashingiz mumkin, menga link yuboring\n\n🇷🇺 Привет, через этого бота можно выкладывать видео из Инстаграма, пришли мне ссылку"
  );
});

bot.command("stat", async (ctx) => {
  const { users } = await postgres();

  let today = moment().startOf("day");
  let tomorrow = moment(today).endOf("day");

  let day = await users.count({
    createdAt: { $gte: today, $lte: tomorrow },
  });

  let today_week = moment().startOf("week");
  let tomorrow_week = moment(today).endOf("week");

  let week = await users.count({
    createdAt: { $gte: today_week, $lte: tomorrow_week },
  });

  let today_month = moment().startOf("month");
  let tomorrow_month = moment(today).endOf("month");

  let month = await users.count({
    createdAt: { $gte: today_month, $lte: tomorrow_month },
  });

  let all = await users.count();


  ctx.reply(`Kunlik: ${day}\nHaftalik: ${week}\nOylik: ${month}\n\nUmumiy: ${all}`)
});

bot.on("text", async (ctx) => {
  try {
    const { media } = await postgres();
    const instagramGetUrl = require("instagram-url-direct");
    let result = await instagramGetUrl(ctx.message.text);
    let file = await media.findOne({
      where: { link: ctx.message.text },
      raw: true,
    });

    if (!file) {
      if (result.results_number > 1) {
        let inputMedia = [];
        for (let l of result.url_list) {
          inputMedia.push({ type: "photo", media: l });
        }

        let response = await ctx.replyWithMediaGroup(inputMedia);

        let fileIdList = [];
        for (let res of response) {
          fileIdList.push(res.photo[res.photo.length - 1].file_id);
        }

        await media.create({
          results_number: result.results_number,
          file_id: fileIdList,
          link: ctx.message.text,
        });
      } else {
        let response = await ctx.replyWithVideo(result.url_list[0]);
        await media.create({
          link: ctx.message.text,
          file_id: [response.video?.file_id || response.document?.file_id]
        });
      }
    } else {
      if (file.results_number > 1) {
        let inputMedia = [];
        for (let l of file.file_id) {
          inputMedia.push({ type: "photo", media: l });
        } 

        await ctx.replyWithMediaGroup(inputMedia);
      } else {
        await ctx.replyWithVideo(file.file_id[0]);
      }
    }
  } catch (e) {
    console.log(e);
    ctx.reply("❌Xatolik yuz berdi, Qayta urinib ko'ring");
  }
});

bot.launch();

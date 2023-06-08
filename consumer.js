const amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue";

const data = require("./data.json");

async function connect_rabbit() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    const assertion = await channel.assertQueue(queueName);

    console.log("Mesaj bekleniyor..");
    //Mesajın alınması
    channel.consume(queueName, (message) => {
      const messageInfo = JSON.parse(message.content.toString());
      const userInfo = data.find((u) => u.id == messageInfo.description);
      if (userInfo) {
        console.log("İşlenen kayıt", userInfo);
        channel.ack(message);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

connect_rabbit();

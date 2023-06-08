const amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue";

const message = {
  description: "Bu bir test mesajıdır :D",
};

const data = require("./data.json");

connect_rabbit();

async function connect_rabbit() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    data.forEach((i) => {
      message.description = i.id;
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Gonderilen mesaj: ", i.id);
    });

    /*  INTERVAL
    setInterval(() => {
      message.description = new Date().getTime();
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      console.log("Gonderilen mesaj: ", message);
    }, 1000) */
  } catch (e) {
    console.log(e);
  }
}

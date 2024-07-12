const { Client, GatewayIntentBits, Partials } = require('discord.js');
const ethers = require('ethers');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.VOLTA_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
  "function authorize(address user) public",
  "function isAuthorized(address user) public view returns (bool)"
];

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', error => {
  console.error('Client error:', error);
});

client.on('warn', warning => {
  console.warn('Client warning:', warning);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

client.on('messageCreate', async message => {
  if (message.content.startsWith('!authorize')) {
    new Promise(async (resolve, reject) => {
      try {
        const args = message.content.split(' ');
        const roleName = args[1];
        const member = message.mentions.members.first();

        if (!roleName || !member) {
          message.reply('Usage: !authorize @user roleName');
          return reject(new Error('Invalid command usage'));
        }

        // Authorize user on the blockchain
        const tx = await contract.authorize(member.id);
        await tx.wait();

        message.reply(`Authorized ${member.displayName} with role ${roleName}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    })
    .then(() => {
      console.log('Authorization successful');
    })
    .catch((error) => {
      console.error('Error handling message:', error);
      message.reply('There was an error processing your request.');
    });
  }
});

client.login(process.env.BOT_TOKEN);

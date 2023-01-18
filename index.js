import { StaticAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { ApiClient } from '@twurple/api'
import * as dotenv from 'dotenv'
dotenv.config()
//import { promises as fs } from 'fs';

async function main() {
	const clientId = process.env['id'];
  const accessToken = process.env['token']
	const authProvider = new StaticAuthProvider(clientId,accessToken)
  const channels = ['je_remy_']
	const chatClient = new ChatClient({ authProvider, channels: channels });
  const apiClient = new ApiClient({authProvider})
  chatClient.onConnect(() => {console.log(`Connected to: ${channels.join(", ")}.`)})
  
	chatClient.onMessage(async (channel, user, text, msg) => {
    if (/can u donate|please donate|donate pls|can you donate|donate me|donate to me/g.test(text.toLowerCase())) {
      chatClient.say(channel,`He is currently not donating at the moment.`,{replyTo: msg})
    }
	});
  await chatClient.connect();
}

main();
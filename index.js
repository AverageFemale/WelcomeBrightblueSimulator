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
  let bool = false
	const chatClient = new ChatClient({ authProvider, channels: channels });
  const apiClient = new ApiClient({authProvider})
  chatClient.onConnect(() => {console.log(`Connected to: ${channels.join(", ")}.`)})
  
	chatClient.onMessage(async (channel, user, text, msg) => {
    if (user.toLowerCase() == "averagefemale_" || user.toLowerCase() == "je_remy_") {
      if (text.toLowerCase() == "!toggle on") {
        if (bool) return chatClient.say(channel,"Already on. [Automated Response]",{replyTo: msg})
        bool = false
        return chatClient.say(channel,"Turned on. [Automated Response]",{replyTo: msg})
      } else if (text.toLowerCase() == "!toggle off") {
        if (!bool) return chatClient.say(channel,"Already off. [Automated Response]",{replyTo: msg})
        bool = true
        return chatClient.say(channel,"Turned off. [Automated Response]",{replyTo: msg})
      }
      if (text.toLowerCase().startsWith("!loop")) {
        const args = text.replace(/!loop /g,"").split(" ")
        const amount = parseInt(args.shift())
        const message = args.filter(v => v != amount.toString())
        for (var i = 0; i < amount; i++) {
          chatClient.say(channel,message.join(" "))
        }
      }
    }
    if (!bool) return 
    if (/can u donat|please donat|dono me|pls donat|gift me|dono pls|pls dono|can u dono|can you dono|donate pls|donated pls|can you donat|donate me|donated me|donate to me/g.test(text.toLowerCase())) {
      chatClient.say(channel,`He is currently not donating at the moment. [Automated Response]`,{replyTo: msg})
    }
	});
  await chatClient.connect();
}

main();
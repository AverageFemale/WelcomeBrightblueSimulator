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
  const channels = ['je_remy_','gonebaldy']
  let streamers = new Map();
  streamers.set('@je_remy_',false)
  streamers.set('@gonebaldy',false)
	const chatClient = new ChatClient({ authProvider, channels: channels, isAlwaysMod: true });
  const apiClient = new ApiClient({authProvider})
  chatClient.onConnect(() => {console.log(`Connected to: ${channels.join(", ")}.`)})
  
	chatClient.onMessage(async (channel, user, text, msg) => {
    const bool = streamers.get(channel)
    if (user.toLowerCase() == "averagefemale_" || channels.includes(user.toLowerCase() )) {
      
      const args = text.split(" ").slice(1)
      if (text.toLowerCase() == "!toggle on") {
        if (bool) return chatClient.say(channel,"Already on. [Automated Response]",{replyTo: msg})
        streamers.set(channel,true)
        return chatClient.say(channel,"Turned on. [Automated Response]",{replyTo: msg})
      } else if (text.toLowerCase() == "!toggle off") {
        if (!bool) return chatClient.say(channel,"Already off. [Automated Response]",{replyTo: msg})
        streamers.set(channel,false)
        return chatClient.say(channel,"Turned off. [Automated Response]",{replyTo: msg})
      }
      if (text.toLowerCase().startsWith("!loop")) {
        const amount = parseInt(args.shift())
        const message = args.filter(v => v != amount.toString())
        for (var i = 0; i < amount; i++) {
          chatClient.say(channel,message.join(" "))
        }
      }
      if (text.toLowerCase().startsWith("!eval")) {
        const random = Math.random()
        try {
          const results = eval(args.join(" "))
          console.log(results)
          chatClient.say(channel,`Success! ${random > 0.1 ? "Kappa" : "KappaPride"}`)
        } catch (e) {
          console.error(e)
          chatClient.say(channel,`Error! ${random > 0.1 ? "FallCry" : "WutFace"}`)
        }
      }
    }
    if (!bool) return 
    if (/can u donat|please donat|dono me|pls donat|gift me|dono pls|pls dono|can u dono|can you dono|donate pls|donated pls|can you donat|donate me|donated me|donate to me|can i get/g.test(text.toLowerCase())) {
      chatClient.say(channel,`He is currently not donating at the moment. [Automated Response]`,{replyTo: msg})
    }
	});
  await chatClient.connect();
}

main();
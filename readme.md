DiscordGPT is a bot which brings ChatGPT 4 into your discord in the form of your friendly helper clippy! To chat with clippy first run the /activate command in the channel you want to talk with him in and then say "hey clippy" to start a conversation. Clippy will listen and respond to relevant messages until you say "goodbye clippy" or dont send him any messages for a twenty minutes.
The bot is build using the discord bot API and the openai API. Clippy can track any number of conversations and can converse for as long as you like. Clippy does not store any user data, message history is deleted when the conversation ends.

to run in ec2 do ./nrun.sh
to kill process do ps aux | grep node
then kill \[pid\] for the index.js process
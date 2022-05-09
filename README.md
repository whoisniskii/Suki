# Suki-Rewrite

## ⚠ Requirements
- NodeJS 16 or higher
- yarn


## 💻 Self-Hosting

- ⚙️ .env
```bash
BOT_TOKEN=BOT-TOKEN
MONGODB_URI=MONGODB-URI
SPOTIFYCLIENTID=SPOTIFY-API-ID
SPOTIFYCLIENTSECRET=SPOTIFY-API-SECRET
GUILD_ID=GUILD-TEST-ID
CLIENT_TEST_ID=CLIENT-TEST-ID
MUSIXMATCH_API_KEY=MUSIXMATCH-APIKEY
```

- 🎵 nodes.yml
```yml
lavalinkNodes:
- {
id: 'Suki',
hostname: 'localhost',
port: 2333,
password: 'youshallnotpass',
}
```

- Install all dependencies
```bash
yarn
```

## 💻 | Compiling
To compile the bot run:

```bash
yarn build
```

Now you can run bot using:
- You need to register slash commands running: yarn slash
```bash
yarn start
```

## ⛔ Issues:
If you have any problems open a issue

## 🚀 Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

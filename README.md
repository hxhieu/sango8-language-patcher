# sango8-language-patcher

> Currently only support traditional Chinese installation i.e. `zh-tw`

## Environment

`WORK_DIR=$HOME/sango8-language-patcher`

For Windows, it should be `C:\Users\<YOUR_USER>\sango8-language-patcher`

## TLTR

- Just clone the default `en` pack from [https://github.com/hxhieu/sango8-language-packs](https://github.com/hxhieu/sango8-language-packs)
- Put the whole `en` folder under `$WORK_DIR/packs/en`, so it should have `$WORK_DIR/packs/en/full` and `$WORK_DIR/packs/en/part`
- Launch the app to create the patch `Patches > Create patches > To zh-tw > From en`
- It will give you the text files ready for patching

## Google translate

You will need to provide your own service account JSON [https://cloud.google.com/translate/docs/setup](https://cloud.google.com/translate/docs/setup)

Then rename and put it at `$WORK_DIR/google-service-account.json`

## How to patch

You will need a copy of UnityEX as this tool only give you the text files that you can patch the game with

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn electron:serve
```

### Compiles and minifies for production

```
yarn electron:build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

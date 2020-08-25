# watson-bot - фронтовый UI для работы чатбота



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Конфигурация приложения

-  для запуска на локальной станции в режиме developemt
создать файл   в корневой директории с такими параметрами:

```text
   ## URL бакенда для работы чатбота
   VUE_APP_NODE_API_URL=****
   
   ## ASSISTANT_ID с настроек чатбота
   VUE_APP_NODE_ASSISTANT_ID=*****

```

-  для запуска на локальной станции в режиме production
создать файл .env.production в корневой директории с такими параметрами:

```text
   ## URL бакенда для работы чатбота
   VUE_APP_NODE_API_URL=http://*****

   ## ASSISTANT_ID с настроек чатбота
   VUE_APP_NODE_ASSISTANT_ID=*****

```
- при запуске в Openshift
Эти файлы не нужны. В режиме BUILS, вкладка ENVIRONMENT
внести  переменные

```text

   ## URL бакенда для работы чатбота
   VUE_APP_NODE_API_URL=http://*****

   ## ASSISTANT_ID с настроек чатбота
   VUE_APP_NODE_ASSISTANT_ID=****

   ## Идентификатор запуска в режиме PRODUCTION
   NODE_ENV=production

```
 Или же прямо руками в BuildConfig.yaml
```yaml
strategy:
    type: Source
    sourceStrategy:
      from:
        kind: ImageStreamTag
        namespace: openshift
        name: 'nodejs:10'
      env:
        - name: VUE_APP_NODE_API_URL
          value: >-
            http://****
        - name: VUE_APP_NODE_ASSISTANT_ID
          value: *****
        - name: NODE_ENV
          value: production
  postCommit: {}
  source:
    type: Git
    git:
      uri: >-
        http://*******.git
      ref: master
    sourceSecret:
      name: sinc-gitlab-pvx-1
  triggers:
```

Чтобы файлы .env.development и .env.production не путались в продуктивных ветках, они внесены в .gitignore


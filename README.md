<h1 align="center">Serverless Web Performance Monitor</h1>
<p>
  <a href="https://github.com/gatsbyjs/gatsby-starter-blog/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
  <a href="https://twitter.com/rafalwilinski">
    <img alt="Twitter: rafalwilinski" src="https://img.shields.io/twitter/follow/rafalwilinski.svg?style=social" target="_blank" />
  </a>
</p>

> Self-hosted, cloud-native monitoring solution for your page/endpoint speed from multiple locations around the world.

## Prerequisites

- AWS Account and credentials set in `~/.aws/credentials`
- Node >10
- Yarn or npm

## Install

```sh
yarn
```

## Usage

- `yarn deploy:all` compiles all lambdas, CDK Stack, Frontend application and deploys it to the cloud
- `yarn build:frontend` builds only frontend
- `yarn build:cdk` builds only CDK from TS to JS

You can also pass following environment variable to customize your deployment:

- `REGION` - your base region where dashboard and projects table gets deployed
- `COLLECTOR_REGIONS` - AWS regions where collectors should be deployed
- `CRON_PATTERNS` - how frequently data should be gathered (by default it's every 5 minutes)

## Infrastructure

![Infrastructure](./assets/infra.png 'Infrastructure')

## Author

👤 **Rafal Wilinski &lt;raf.wilinski@gmail.com&gt;**

- Twitter: [@rafalwilinski](https://twitter.com/rafalwilinski)
- Github: [@RafalWilinski](https://github.com/RafalWilinski)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/RafalWilinski/servicefull/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Rafal Wilinski &lt;raf.wilinski@gmail.com&gt;](https://github.com/RafalWilinski).<br />
This project is [MIT](https://github.com/RafalWilinski/servicefull/blob/master/LICENSE) licensed.

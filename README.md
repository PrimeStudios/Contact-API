# Prime Studios Contact API

## Overview

A [Node.js](https://nodejs.org/) application that handles contact inquires made on the [Prime Studios Contact Page](https://primestudios.co/contact/) using [Express.js](https://expressjs.com/) and [request-promise](https://github.com/request/request-promise).

## Installation

1.  [Install Node.js](https://nodejs.org/en/download/)
    ```bash
     curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
     sudo apt-get install -y nodejs
    ```
2.  Clone Repository
    ```bash
    git clone git@github.com:primestudios/contact-api.git
    ```
3.  Install Dependencies
    ```bash
    cd contact-api
    npm install
    ```

## Usage

### Configuration

Configuration can be found in the [`/app_config/`](./app_config) directory:

#### Application Configuration [`/app_config/app.json`](./app_config/app.json)

```JSON
{
	"interval": 30000 // Enter a valid interval (in milliseconds)
}
```

#### Webhook Configuration `/app_config/hook.json`

```JSON
{
	"protocol": "https", // HTTP or HTTPS
	"host": "discordapp.com", // Where the Webhook is hosted
	"route": "/api/webhooks/myawesomewebhook" // The Route to the Webhook
}
```

### Running

```bash
npm run-script start
```

## License

This project is licensed under the [MIT](./LICENSE) License &copy; 2019-2020 [Prime Studios](https://github.com/PrimeStudios)

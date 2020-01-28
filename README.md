# SCRAPERZ

This is a scraper made to help you find great deals.

### CLI options

1. **--i** - runs in interactive mode, you can manually select what you want to run. This is the default one.
1. **--w** - runs in worker mode. Nothing to pass, worker is started.
1. **--s** - runs in string mode, you have to pass a valid JSON string. Only producer available then.

### Test

Clone the repository.

Create an _.env_ file. See _.env.example_ for reference.

Open two terminals in the project directory. In the first one paste and run:

```
yarn
yarn build
yarn start --w
```

in the second one paste and run:

```
yarn start --s '["https://www.ceneo.pl/86198612"]'
```

If you passed valid Redis credentials (_.env_ file) you should shortly be able to see a created JSON file with scraped data in it.

### Client side scrapers

Just copy a scraper you like, visit the respective site, paste the code into your console and invoke the function. 

Remember that each client side scraper requires [artoo](https://medialab.github.io/artoo/spiders/) to run. Otherwise you will get an error.
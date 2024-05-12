# FullStack-course "notes" app Backend
This goes together with - you guessed it - the frontend repo.
NOTE! ESlint v9+ have changed from .eslintrc.js to eslint.config.js. The material had .eslintrc.js. 
- atm, use “export ESLINT_USE_FLAT_CONFIG=false && npx eslint index.js” when you're linting index.js, for example
- the used solution is to https://eslint.org/docs/latest/use/migrate-to-9.0.0 add to use the "ESLINT_USE_FLAT_CONFIG=false" as written above and keep using the "old" (pre-v9) ESlint config file. 

Another solution for the ESlint "problem" would be to manually rewrite the old format to match the new one according to https://eslint.org/docs/latest/use/configure/migration-guide

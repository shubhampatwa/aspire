# Your task is to build a mini-aspire API:
It is an app that allows authenticated users to go through a loan application. It doesn’t have to contain too many fields, but at least “amount
required” and “loan term.” All the loans will be assumed to have a “weekly” repayment frequency.
After the loan is approved, the user must be able to submit the weekly loan repayments. It can be a simplified repay functionality, which won’t
need to check if the dates are correct but will just set the weekly amount to be repaid.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Shubham Patwa](https://www.linkedin.com/in/shubham-patwa-17b33378/)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# Project Calendly

## Assumption
- User can be created with unique email 
- No password need for any login (user/admin)
- Admin will get created in start of application for now admin email => `shubhampatwa526@gmail.com`
- User are allowed to do following operation:
  - Create Loan
  - View Loan
  - Pay Loan
- Admin are allowed to do following operation:
  - View Loan
  - Approve Loan
- For DB we use postgres
- Application is deployed using docker and docker-compose
- Swagger is already integrated in the app
- Postman url will be added at the end here: [POSTMAN]()

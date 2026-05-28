# Contributing 💙

Thank you :smile: for contributing to [@skchr/color](https://github.com/skchr/color)!

On this page you'll find information on how to setup the project and navigate the file structure.

The project structure is as follows:

- `dos/` - Where the documentation site lives
- `lib/` - This is where the source code is located
- `tests/` This is where the test files for the publicly accessible symbols live.

## Requirements

#

- Supported version of Node (LTS or higher)
- Git
- Bun (for testing)

## Setup⛳

To quickly get the development environment ready you can run the following command, you can replace `npm` with any package manager :

```sh
git clone https://github.com/skchr/color && cd color

# Package manager of your choice
npm i -D
```

## Documentation

The API documentation is written as JSDoc comments and is compiled from the source files using [TypeDoc][typedoc] and [typedoc-plugin-markdown][markdown-plugin].

The site is generated using [Docusaurus](https://docusaurus.io).

You can edit the other pages by going to the `www/docs/` directory.

## Adding/Running tests 🧪

The project uses `bun:test` for unit testing. In order to run and create tests you need to have a working version of `bun` installed.

```sh
bun test

```

Each module with publicly exported symbols has a corresponding `*.test.ts` file. The specs are defined as an object with the following structure:

```ts
export type Spec = {
  description?: string;

  matcher?: string;
  callback: any;
  params: any[];
  result: any;
};
```

and then iterated using a helper function, `run` which takes an array of the `Spec` objects as its only parameter.

### Pull Requests

1. Fork the project
2. Clone your fork
3. Create a pr/**feature** branch replacing **feature** with what you're working on.

> Not necessarily a requirement but it makes understanding the context of the pull request easier.

```sh
git checkout -b pr/feature
```

4. Commit your changes. Follow the prompts asked to complete your commit.

   ```sh
   npx cz
   ```

5. And then push your changes

   ```sh
   git push origin pr/feature
   ```

6. Open a pull request

Happy hacking 🚀!

[typedoc]:[https://npmjs.com/package/typedoc]
[markdown-plugin]:[https://npmjs.com/package/typedoc-plugin-markdown]

# static-api-generator

Build and deploy a static API using:

- NodeJS 20.x
- TypeScript 5.x
- eslint 8.x
- prettier 3.x
- vitest 1.x

## How it works

Update [./src/import.ts](src/import.ts) to dynamically load data from various sources (APIs, Files, Sites). When running `npm run dev` the script will be run, data will be loaded and mapped and save at [./data](data). This data can then be curated and committed as source code.

Update [./src/main.ts](src/main.ts) to generate the static API files from your source files. When running `npm run build && npm start` the script will be run, and the statis api will be generated at [./out](out). If using GitHub Actions it will be deployed to the `gh-pages` branch. You can configure your GitHub repo to serve a GitHub Pages site from that branch.

<div align="center">

![Static API Generator - Diagram](/src/assets/static-api-generator-diagram.svg)

</div>

## Examples

- Registry: https://kmturley.github.io/static-api-generator
- Collection: https://kmturley.github.io/static-api-generator/books
- Organization: https://kmturley.github.io/static-api-generator/books/joe-bloggs
- Package: https://kmturley.github.io/static-api-generator/books/joe-bloggs/adventures-in-coding

## Installation

Install dependencies using:

    npm install

## Usage

Run dev commands using:

    npm run lint
    npm run format
    npm run dev
    npm test

Create and run a build using:

    npm run build && npm start

## Contact

For more information please contact kmturley

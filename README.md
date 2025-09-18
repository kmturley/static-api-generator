# static-api-generator

Build and deploy a static API. Features implemented:

- Import data from different sources:
  - Api endpoints (REST)
  - Files (Csv, Json, Yaml, Xml)
  - Site page crawlers (Html)
- Searchable registry containing:
  - Collections of packages
  - Group packages by organization/author
- Export data to different targets:
  - Files (Csv, Json, Yaml, Xml)
  - Variables in export file pattern
- Automations:
  - GitHub action workflows (test, build, deploy)
  - Unit and integration tests

Features planned:

- Browser/server classes with shared isomorphic code
- Validate package schema, values and links
- User-friendly report/log/debug output
- Command line tool support
- Export aggregate/id-only endpoints

<div align="center">

![Static API Generator - Diagram](/src/assets/static-api-generator-diagram.svg)

</div>

## How it works

[./src/import.ts](src/import.ts) is used to dynamically load data from various sources (APIs, Files, Sites). When running `npm run dev` the data will be loaded, mapped and saved to the targets, in this case [./data](data). This data can then be reviewed/curated before committed as source code. This is a separate process as it can take a long time to run, and you may experience inconsistent data quality, depending on your sources.

```
$ npm run dev

Registry sync
🔗 https://jsonplaceholder.typicode.com/comments/1
📂 data/books/nintendo/the-legend-of-zelda-ocarina-of-time.yaml
📂 data/books/joe-bloggs/adventures-in-coding.yaml
📂 data/books/eliseogardnerbiz/id-labore-ex-et-quam-laborum.yaml
🌐 https://www.metacritic.com/game/the-legend-of-zelda-ocarina-of-time/
SourceApi
📦 eliseogardnerbiz/id-labore-ex-et-quam-laborum
SourceFile
📦 nintendo/the-legend-of-zelda-ocarina-of-time
📦 joe-bloggs/adventures-in-coding
📦 eliseogardnerbiz/id-labore-ex-et-quam-laborum (merge)
SourceSite
📦 nintendo/the-legend-of-zelda-ocarina-of-time (merge)
Registry export
📄 ./data/books/eliseogardnerbiz/id-labore-ex-et-quam-laborum.yaml
📄 ./data/books/nintendo/the-legend-of-zelda-ocarina-of-time.yaml
📄 ./data/books/joe-bloggs/adventures-in-coding.yaml
```

[./src/main.ts](src/main.ts) generates static files from your sources which can be used as a Static API. When running `npm run build && npm start` the script will load the sources (local files), validate them and generate the targets, in this case [./out](out). These are "computed" files which won't be comitted to source code, as they contain duplicate data in many places, to make the Static API simple to use.

```
$ npm run build && npm start

Registry sync
📂 data/books/nintendo/the-legend-of-zelda-ocarina-of-time.yaml
📂 data/books/joe-bloggs/adventures-in-coding.yaml
📂 data/books/eliseogardnerbiz/id-labore-ex-et-quam-laborum.yaml
SourceFile
📦 nintendo/the-legend-of-zelda-ocarina-of-time
📦 joe-bloggs/adventures-in-coding
📦 eliseogardnerbiz/id-labore-ex-et-quam-laborum
Registry export
📄 ./out/index.json
📄 ./out/books/index.json
📄 ./out/books/nintendo/index.json
📄 ./out/books/nintendo/the-legend-of-zelda-ocarina-of-time/index.json
📄 ./out/books/joe-bloggs/index.json
📄 ./out/books/joe-bloggs/adventures-in-coding/index.json
📄 ./out/books/eliseogardnerbiz/index.json
📄 ./out/books/eliseogardnerbiz/id-labore-ex-et-quam-laborum/index.json
```

## Automation

This repo also contains GitHub Action Workflows to automate some steps:

[.github/workflows/test.yml](.github/workflows/test.yml) Runs install, audit, lint, test and build commands on every branch to ensure the registry will generate.
[.github/workflows/release.yml](.github/workflows/release.yml) Runs install, build and deploy commands which deploys the Static API to GitHub Pages.

## Static API example

- Registry: https://kmturley.github.io/static-api-generator
- Collection: https://kmturley.github.io/static-api-generator/books
- Organization: https://kmturley.github.io/static-api-generator/books/joe-bloggs
- Package: https://kmturley.github.io/static-api-generator/books/joe-bloggs/adventures-in-coding

## Developer docs

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

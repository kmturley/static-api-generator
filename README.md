# static-api-generator

Build and deploy a static API. Features implemented:

- Import data from different sources:
  - Api endpoints (REST)
  - Files (Csv, Json, Yaml, Xml)
  - Large-language models (LLMs)
  - Site page crawlers (Html)
- Searchable registry containing:
  - Collections of packages
  - Associate packages between collections
- Export data to different targets:
  - Files (Csv, Json, Yaml, Xml)
  - Variables in export file pattern
- Automations and tools:
  - GitHub action workflows (test, build, deploy)
  - Unit and integration tests
  - User-friendly report/log/debug output
  - Validate package schema

Features planned:

- Browser/server classes with shared isomorphic code
- Command line tool support
- Export aggregate/id-only endpoints

<div align="center">

![Static API Generator - Diagram](/src/assets/static-api-generator-diagram.svg)

</div>

## How it works

[./src/import.ts](src/import.ts) is used to dynamically load data from various sources (APIs, Files, LLMs, Sites). When running `npm run dev` the data will be loaded, mapped and saved to the targets, in this case [./data](data). This data can then be reviewed/curated before committed as source code. This is a separate process as it can take a long time to run, and you may experience inconsistent data quality, depending on your sources.

```
$ npm run dev

❯ Collection books sync
  🔗 https://jsonplaceholder.typicode.com/comments/1
  📂 data/books/the-legend-of-zelda-ocarina-of-time.yaml
  📂 data/books/id-labore-ex-et-quam-laborum.yaml
  📂 data/books/adventures-in-coding.yaml
  🌐 https://www.metacritic.com/game/the-legend-of-zelda-ocarina-of-time/
  SourceApi:
  📦 id-labore-ex-et-quam-laborum
  SourceFile:
  📦 the-legend-of-zelda-ocarina-of-time
  📦 id-labore-ex-et-quam-laborum (merge)
  📦 adventures-in-coding
  SourceSite:
  📦 the-legend-of-zelda-ocarina-of-time (merge)
  Packages:  3

❯ Validation report
  ✓ id-labore-ex-et-quam-laborum
  ✓ the-legend-of-zelda-ocarina-of-time
  ✓ id-labore-ex-et-quam-laborum
  ✓ adventures-in-coding
  ✓ the-legend-of-zelda-ocarina-of-time
  Packages  5 passed (5)
  Duration  1009ms

❯ Registry export started
  📄 ./data/books/id-labore-ex-et-quam-laborum.yaml
  📄 ./data/books/the-legend-of-zelda-ocarina-of-time.yaml
  📄 ./data/books/adventures-in-coding.yaml
  Export completed
```

[./src/main.ts](src/main.ts) generates static files from your sources which can be used as a Static API. When running `npm run build && npm start` the script will load the sources (local files), validate them and generate the targets, in this case [./out](out). These are "computed" files which won't be comitted to source code, as they contain duplicate data in many places, to make the Static API simple to use.

```
$ npm run build && npm start

❯ Collection authors sync
  📂 data/authors/joe-bloggs.yaml
  SourceFile:
  📦 joe-bloggs
  Packages:  1

❯ Collection books sync
  📂 data/books/the-legend-of-zelda-ocarina-of-time.yaml
  📂 data/books/id-labore-ex-et-quam-laborum.yaml
  📂 data/books/adventures-in-coding.yaml
  SourceFile:
  📦 the-legend-of-zelda-ocarina-of-time
  📦 id-labore-ex-et-quam-laborum
  📦 adventures-in-coding
  Packages:  3

❯ Validation report
  ✓ joe-bloggs
  ✓ the-legend-of-zelda-ocarina-of-time
  ✓ id-labore-ex-et-quam-laborum
  ✓ adventures-in-coding
  Packages  4 passed (4)
  Duration  19ms

❯ Registry export started
  📄 ./out/index.json
  📄 ./out/authors/index.json
  📄 ./out/authors/joe-bloggs/index.json
  📄 ./out/books/index.json
  📄 ./out/books/the-legend-of-zelda-ocarina-of-time/index.json
  📄 ./out/books/id-labore-ex-et-quam-laborum/index.json
  📄 ./out/books/adventures-in-coding/index.json
  Export completed

  📄 ./out/authors/joe-bloggs/books/index.json
  📄 ./out/authors/joe-bloggs/books/adventures-in-coding/index.json
```

## Automation

This repo also contains GitHub Action Workflows to automate some steps:

[.github/workflows/test.yml](.github/workflows/test.yml) Runs install, audit, lint, test and build commands on every branch to ensure the registry will generate.
[.github/workflows/release.yml](.github/workflows/release.yml) Runs install, build and deploy commands which deploys the Static API to GitHub Pages.

## Static API example

- Registry: https://kmturley.github.io/static-api-generator
- Collection: https://kmturley.github.io/static-api-generator/books
- Package: https://kmturley.github.io/static-api-generator/books/adventures-in-coding

Multiple collections:

- https://kmturley.github.io/static-api-generator/authors
- https://kmturley.github.io/static-api-generator/books

Associations from another collection:

- https://kmturley.github.io/static-api-generator/authors/joe-bloggs/books

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

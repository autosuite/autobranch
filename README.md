# Autobranch

| Summary           | Badge                                              |
| ----------------- | -------------------------------------------------- |
| Release Stability | ![Autobadge Release Stability][release-stability] |
| Latest Release    | ![Autobadge Latest Release][latest-release]       |
| Code Quality      | [![Maintainability][quality-image]][quality-link]  |
| Code Coverage     | [![Test Coverage][coverage-image]][coverage-link]  |

[release-stability]: https://img.shields.io/static/v1?label=latest&message=0.0.0&color=purple
[latest-release]: https://img.shields.io/static/v1?label=stability&message=unusable&color=red
[quality-image]: https://api.codeclimate.com/v1/badges/74ffb9e627a105dd7a43/maintainability
[quality-link]: https://codeclimate.com/github/autosuite/autobranch/maintainability
[coverage-image]: https://api.codeclimate.com/v1/badges/74ffb9e627a105dd7a43/test_coverage
[coverage-link]: https://codeclimate.com/github/autosuite/autobranch/test_coverage

## Introduction

Autobranch is a GitHub Action for the `issues` event. It automatically creates
`issue/<number>-<short_description>`-style issues, e.g.: `issue/311-migrate-editor`.

## Usage

> **Note:** You should never expect stability from the `master` branch. Please specify a version from the
> [releases](https://github.com/autosuite/autobranch/releases) instead.

You must add Autobranch to a workflow that uses the `issues` event. See below:

```yaml
name: my-workflow

on:
  issues:
    types: [assigned]

jobs:
  autobranch:
    runs-on: ubuntu-latest
    steps:
      - uses: autosuite/autobranch@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Configuration

> You can see all configuration in the [action.yml](action.yml) file.

There is no special configuration for this Action; just the token. This may be subject to change as the need arises.

## Documentation

If you would like to contribute to this project, please read our [contributors documentation](CONTRIBUTING.md) and our
[code of conduct](CODE_OF_CONDUCT.md). The license we use for this project is here: [LICENSE](LICENSE).

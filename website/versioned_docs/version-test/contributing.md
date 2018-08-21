---
id: version-test-contributing
title: Contributing
original_id: contributing
---

We'd love you to contribute to our source code and to make our project even
better than it is today! Here are the guidelines we'd like you to follow:

- [Question or Problem?](#question-or-problem)
- [Issues and Bugs](#issues-and-bugs)
- [Feature Requests](#feature-requests)
- [Local Development](#local-development)
- [Submission Guidelines](#submission-guidelines)
- [Coding Rules](#coding-rules)
- [Commit Message Guidelines](#commit-messages)

## <a name="question-or-problem"></a> Got a Question or Problem?

If you have questions about how to use this project, please make sure to double
check our [documentation](https://fuse-box.org). I you haven't found an answer
there, reach out to us on [Gitter](https://gitter.im/fusebox-bundler/Lobby).
We'll be happy to help!

## <a name="issues-and-bugs"></a> Found an Issue?

If you find a bug in the source code or a mistake in the documentation, you can
help us by submitting an issue to our
[GitHub repository](https://github.com/fuse-box/fuse-box/issues). Even better if
you can submit a Pull Request with a fix.

## <a name="feature-requests"></a> Want a Feature?

You can request a new feature by submitting an issue to our GitHub repository.
If you would like to implement a new feature then consider what kind of change
it is:

- **Major Changes** that you wish to contribute to the project should be
  discussed first with (at least some of) core team members, in order to prevent
  duplication of work, and help you to craft the change so that it is
  successfully accepted into the project.
- **Small Changes** can be crafted and submitted to the GitHub repository as a
  Pull Request.

## <a name="local-development"></a> Local Development

### Developing

Setting up development is very easy - `gulp dev` will prepare everything
including `_playground/generic` folder. So you can start helping out and testing
bugfixes and features right away.

```sh
gulp dev
```

Wait a little a bit until all modules are copied and FuseBox has launched itself
to bundle FuseBox. Yes, we are using FuseBox to bundle FuseBox for development.
That's insanely fast. Hit save and your dev bundle is ready in 50ms. (We are
using one of the stable versions of FuseBox located in `bin` folder - that
version is isolated from everything else).

```sh
cd _playground/generic
node fuse
```

Feel free to create as many folders as required, `_playground` folder is in our
`.gitignore`

### How to test

Run

```bash
gulp installDevDeps
```

That will install a bunch of super heavy libraries, that's why they are not
added to `devDependencies`. Mind `package.json`, your npm shouldn't save them
there, if it did - please revert unnecessary changes.

Run all tests

```bash
node test
```

Run one test case

```bash
node test --file=CSSDependencyExtractor.test.ts
```

## <a name="submission-guidelines"></a> Submission Guidelines

### Submitting an Issue

Before you submit your issue search the archive, maybe your question was already
answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues.

### Submitting a Pull Request

Before you submit your pull request consider the following guidelines:

- Search [GitHub repository](https://github.com/fuse-box/fuse-box/issues) for an
  open or closed Pull Request that relates to your submission. You don't want to
  duplicate effort.
- Make your changes in a new branch:

  ```shell
  git checkout -b my-branch master
  ```

- Follow our [Coding Rules](#rules).
- Run the full project's test suite and ensure that all tests are passing.
- Commit your changes using a descriptive commit message that follows our
  [commit message conventions](#commit).
- Push your branch to GitHub:

  ```shell
  git push origin my-fix-branch
  ```

In GitHub, send a pull request to a `master` branch. If we suggest changes,
then:

- Make the required updates.
- Re-run the test suite to ensure tests are still passing.
- Commit your changes to your branch (e.g. `my-branch`).
- Push the changes to GitHub repository (this will update your Pull Request).

If the PR gets too outdated we may ask you to merge and push to update the PR:

```shell
git fetch upstream
git merge upstream/master
git push origin my-fix-branch
```

That's it! Thank you for your contribution!

## <a name="coding-rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as
you are working:

- All features or bug fixes **must be tested** by one or more unit tests.
- All API methods **must be documented** using JSDoc. To see how we document our
  APIs, please check out the existing source code.
- This repository contains `.editorconfig` file, which configures IDE code
  formatting. **Do not override these settings**

## <a name="commit-messages"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.
This leads to **more readable messages** that are easy to follow when looking
through the **project history**.

The commit message formatting can be added using a typical git workflow or
through the use of a CLI wizard
([Commitizen](https://github.com/commitizen/cz-cli)). To use the wizard, run
`npm run commit` in your terminal after staging your changes in git.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`,
followed by the header of the reverted commit. In the body it should say:
`This reverts commit <hash>.`, where the hash is the SHA of the commit being
reverted.

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such
  as documentation generation

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not
"changed" nor "changes". The body should include the motivation for the change
and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also
the place to reference GitHub issues that this commit closes.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space
or two newlines. The rest of the commit message is then used for this.

# Contributing to Pokemon Felix

First off, thank you for considering contributing to Pokemon Felix! It's people like you that make Pokemon Felix such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Pokemon Felix and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b feature/325-add-new-town-building
```

## Get the test suite running

Make sure the tests pass before making your changes, and then run them again after to ensure you didn't break anything.

```sh
npm test
```

## Implement your fix or feature

At this point, you're ready to make your changes. Feel free to ask for help; everyone is a beginner at first.

### Code Style Guidelines

- Keep your code clean and readable
- Write descriptive commit messages
- Ensure new features include appropriate tests
- Follow existing project conventions

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Pokemon Felix's master branch:

```sh
git remote add upstream https://github.com/juan/pokemon-felix.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout feature/325-add-new-town-building
git rebase master
git push --set-upstream origin feature/325-add-new-town-building
```

Finally, go to GitHub and make a Pull Request.

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

# AO3 Enhancement Suite Contribution Guide

## Branch structure

The `main` branch has the current release. It is expected to be extremely
stable. Branches must be up to date with this branch before they can be merged.

The `beta` branch is the next release. It is always ahead of `main`. Branches
must be up to date with this branch before they can be merged.

Patch branches are created from and merged to `main` to address a specific bug.
Once merged, they are deleted.

Feature branches are created from and merged to `beta` to develop a new feature.
Once merged, they are deleted.

## Commit messages

This project follows [Conventional Commits][cc] for commit messages. VS Code
users will be prompted to install the extension.

## Testing

There is unfortunately no unit testing. If you have a suggestion for how to
automate userscript testing, you are invited to open an issue.

Instead, we rely on manual testing. Before you merge a PR, run through the
feature list in the README and make sure everything works as expected.

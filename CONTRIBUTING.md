# Contributing to Novu

Thank you for showing an interest in contributing to Novu! All kinds of contributions are valuable to us. In this guide, we will cover how you can quickly onboard and make your first contribution.

## Submitting an issue

Before submitting a new issue, please search the existing [issues](https://github.com/novuhq/novu/issues). Maybe an issue already exists and might inform you of workarounds. Otherwise, you can give new information.

While we want to fix all the [issues](https://github.com/novuhq/novu/issues), before fixing a bug we need to be able to reproduce and confirm it. Please provide us with a minimal reproduction scenario using a repository or [Gist](https://gist.github.com/). Having a live, reproducible scenario gives us the information without asking questions back & forth with additional questions like:

- 3rd-party libraries being used and their versions (mainly providers, but not exclusively)
- a use-case that fails

Without said minimal reproduction, we won't be able to investigate all [issues](https://github.com/novuhq/novu/issues), and the issue might not be resolved.

You can open a new issue with this [issue form](https://github.com/novuhq/novu/issues/new).

## Projects setup and Architecture

### Requirements

- Node.js version v16.15.1
- MongoDB
- Redis. To install Redis on your O.S, please follow the below guides
  - [To install Redis on Windows](https://redis.io/docs/getting-started/installation/install-redis-on-windows/)
  - [To install Redis on Linux](https://redis.io/docs/getting-started/installation/install-redis-on-linux/)
  - [To install Redis on macOS](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)
- **(Optional)** pnpm - Needed if you want to install new packages
- **(Optional)** localstack (required only in S3 related modules)

### Setup the project

The project is a monorepo, meaning that it is a collection of multiple packages managed in the same repository.

To learn more about the project structure and running the project locally, please have a look [here](https://docs.novu.co/community-support/introduction#run-novu-locally). After cloning your fork, you will need to run the `npm run setup:project` command to install and build all dependencies.

To learn a detailed guide on running the project locally, checkout our guide on [how to run novu in local machine](https://docs.novu.co/community/run-in-local-machine).

## Accessing Repositories After Setting Up Docker Containers

If you have successfully set up the project using Docker containers but are unsure how to access the different repositories such as web, API, and workers for development, follow these steps:

### Web Repository

After running the Docker containers, the web repository can be accessed at [http://localhost:4200](http://localhost:4200). This URL points to the local development instance of the Novu web management platform. You can use this URL to access and contribute to the web repository.

### API Repository

To access the API repository for development, you can use [http://localhost:3000](http://localhost:3000). This URL corresponds to the local development instance of the Novu API. Use this URL to contribute to the API repository.

### Workers Repository

For the workers repository, you can access the development instance using [http://localhost:3004](http://localhost:3004). This URL is associated with the local development instance of the Novu worker service. Utilize this URL for contributing to the workers repository.

Feel free to explore and contribute to other repositories based on the corresponding URLs and ports mentioned above. If you encounter any issues or need further assistance, don't hesitate to reach out on our [Discord Server](https://discord.novu.co) or open a [GitHub Issue](https://github.com/novuhq/novu/issues/new/choose).

## Missing a Feature?

If a feature is missing, you can directly _request_ a new one [here](https://github.com/novuhq/novu/issues/new?assignees=&labels=feature&template=feature_request.yml&title=%F0%9F%9A%80+Feature%3A+). You also can do the same by choosing "🚀 Feature" when raising a [New Issue](https://github.com/novuhq/novu/issues/new/choose) on our GitHub Repository. If you would like to _implement_ it, an issue with your proposal must be submitted first, to be sure that we can use it. Please consider the guidelines given below.

## Coding guidelines

To ensure consistency throughout the source code, please keep these rules in mind as you are working:

- All features or bug fixes must be tested by one or more specs (unit-tests).
- We use [Eslint default rule guide](https://eslint.org/docs/rules/), with minor changes. An automated formatter is available using prettier.

## Need help? Questions and suggestions

Questions, suggestions, and thoughts are most welcome. Feel free to open a [GitHub Issue](https://github.com/novuhq/novu/issues/new/choose). We can also be reached on our [Discord Server](https://discord.novu.co).

## Ways to contribute

- Try the Novu API and platform and give feedback
- Add new providers
- Help with open [issues](https://github.com/novuhq/novu/issues) or [create your own](https://github.com/novuhq/novu/issues/new/choose)
- Share your thoughts and suggestions with us
- Help create tutorials and blog posts
- Request a feature by submitting a proposal
- Report a bug
- **Improve documentation** - fix incomplete or missing [docs](https://docs.novu.co/), bad wording, examples or explanations.

## Missing a provider?

If you are in need of a provider we do not yet have, you can request a new one by [submitting an issue](#submitting-an-issue). Or you can build a new one by following our [create a provider guide](https://docs.novu.co/community/add-a-new-provider).

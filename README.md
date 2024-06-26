**Join our [Discord](https://discord.gg/UBTrHxA78f) to discuss about our software!**

# heusalagroup/fi.hg.frontend

Our enterprise frontend library for TypeScript.

### It doesn't have many runtime dependencies

### We don't have traditional releases

We don't have traditional releases.  This project evolves directly to our git repository in an agile manner.

This git repository contains only the source code for a compile time use case. It is meant to be used as a git submodule in a NodeJS or webpack project.

See also [hg.fi](https://hg.fi) for easy NPM package creators for your project and other additional modules from us.

### License

Copyright (c) Heusala Group Ltd. All rights reserved.

Each software release is initially under the HG Evaluation and 
Non-Commercial License for the first two years. This allows use, modification, 
and distribution for non-commercial and evaluation purposes only. Post this 
period, the license transitions to the standard MIT license, permitting broader
usage, including commercial applications. For full details, refer to the 
[LICENSE.md](LICENSE.md) file. 

**Commercial usage licenses can be obtained under separate agreements.**

## Install & maintain our library

Run the installation commands from your project's root directory. Usually it's where your `package.json` is located.

For these sample commands we expect your source files to be located in `./src` and we'll use `./src/io/hyperify/frontend` for location for our submodule.

Setup git submodule:

```shell
mkdir -p src/fi/hg
git submodule add git@github.com:heusalagroup/fi.hg.frontend.git src/io/hyperify/frontend
git config -f .gitmodules submodule.src/io/hyperify/frontend.branch main
```

Next install our required dependencies (newest [lodash library](https://lodash.com/) and [reflect-metadata library](https://www.npmjs.com/package/reflect-metadata)):

```shell
git submodule add git@github.com:hyperifyio/io.hyperify.core.git src/io/hyperify/core
git config -f .gitmodules submodule.src/io/hyperify/core.branch main
npm i --save-dev lodash @types/lodash 'moment-timezone' '@types/moment-timezone'
```

### Checking out a project with git submodules

Git doesn't automatically clone your sub modules.

You'll need to command:

```shell
git clone --recurse-submodules git@github.com:heusalagroup/your-project.git your-project
```

...or:

```shell
git clone git@github.com:heusalagroup/your-project.git your-project
cd your-project
git submodule init
git submodule update
```

### Updating upstream library code

Later when you want to update your submodules, you may do:

```shell
git pull
git submodule update --remote
```

### Why git submodules, you may wonder?

NPM doesn't provide a good way to implement pure compile time TypeScript libraries.

We would have to compile our whole library in our bundle even though you probably don't use everything.

It wouldn't be possible to use compile time optimizations and other ENV based feature flags.

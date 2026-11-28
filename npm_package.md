Publishing an npm package to GitHub Packages

Here's the full setup, using the scope from your earlier command (@gipsycloud).

1. Configure package.json
json
{
  "name": "@gipsycloud/digital-tools",
  "version": "1.0.1",
  "description": "Digital tools shop API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "prisma"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/gipsycloud/digital-tools-shop.git"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
The scope (@gipsycloud) must match your GitHub username or organization in lowercase.
files controls what gets uploaded, so .env, src, and node_modules stay out.
prepublishOnly builds automatically before every publish.
Use a new version (1.0.1), since 1.0.0 already exists.
2. Check tsconfig.json produces declarations
json
{
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true,
    "module": "commonjs",
    "target": "es2020",
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["src"]
}
3. Create a GitHub token

GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → scopes: write:packages and read:packages (and repo if the repo is private).

4. Create .npmrc

In your project root:

@gipsycloud:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

Then set the token in your shell:

bash
export GITHUB_TOKEN=ghp_yourtokenhere

Never write the real token into .npmrc or commit it. Add .npmrc to .gitignore if you do paste a token there.

5. Preview, then publish
bash
npm publish --dry-run     # shows exactly which files will be uploaded
npm publish

Check that the dry run doesn't list .env or secrets.

6. For future updates
bash
npm version patch   # 1.0.1 -> 1.0.2
npm publish

You can never republish the same version, which is what caused your E409.

7. Install it in another project
bash
# that project's .npmrc
@gipsycloud:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

npm install @gipsycloud/digital-tools
Optional: publish automatically with GitHub Actions

.github/workflows/publish.yml:

yaml
name: Publish package
on:
  release:
    types: [created]

permissions:
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://npm.pkg.github.com
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

No personal token is needed here, since GITHUB_TOKEN is provided automatically.
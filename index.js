const fs = require('fs');
const minimist = require('minimist');
const NpmApi = require('npm-api');

const npm = new NpmApi();

(async function () {
  const { i: inputFile, o: outputFile } = minimist(process.argv.slice(2));

  const Package = require(inputFile);
  const dependencies = { ...Package.dependencies, ...Package.devDependencies };
  const dependenciesInfoMap = {};

  for (const dependency of Object.keys(dependencies)) {
    console.log(`Fetching info for ${dependency}...`);
    const dependencyInfo = await npm.repo(dependency).package();
    dependenciesInfoMap[dependency] = dependencyInfo;
  }

  await fs.promises.writeFile(
    outputFile,
    JSON.stringify(dependenciesInfoMap, null, 4)
  );
})();

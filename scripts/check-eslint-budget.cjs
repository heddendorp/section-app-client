const { ESLint } = require('eslint');

const MAX_ERRORS = 849;
const MAX_WARNINGS = 0;

async function main() {
  const results = await new ESLint().lintFiles(['.']);
  const errorCount = results.reduce(
    (total, result) => total + result.errorCount,
    0,
  );
  const warningCount = results.reduce(
    (total, result) => total + result.warningCount,
    0,
  );

  console.log(
    `ESLint budget: ${errorCount}/${MAX_ERRORS} errors, ${warningCount}/${MAX_WARNINGS} warnings`,
  );

  if (errorCount > MAX_ERRORS || warningCount > MAX_WARNINGS) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

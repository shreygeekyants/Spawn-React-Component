#! /usr/bin/env node
var inquirer = require("inquirer");
const chalk = require("chalk");
const { getFileContents } = require("./utils");

function validateName(val) {
  // check if the component name is empty
  if (val.trim() === "") {
    return "Component's name can't be empty, try again.";
  }

  return true;
}

async function init() {
  try {
    const { component_name } = await inquirer.prompt([
      {
        name: "component_name",
        type: "input",
        message: "Tell me your component's name:",
        validate: validateName,
      },
    ]);

    const { files_needed } = await inquirer.prompt([
      {
        name: "files_needed",
        type: "checkbox",
        message: "Please select the files you want to create.",
        default: false,
        choices: ["index.js", `${component_name}.js`, "styles.css"],
      },
    ]);
    const fs = require("fs-extra");
    const path = require("path");
    const component_directory = `${__dirname}/${component_name}`;
    fs.mkdirSync(component_directory);
    files_needed.forEach((file) => {
      fs.writeFileSync(
        path.join(component_directory, file),
        getFileContents(file, component_name),
        (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          }
        },
      );
    });
    console.log(chalk.white.bgGreen("Component created"));
  } catch (error) {
    console.error("An error occurred, please try again!", error);
  }
}

init();

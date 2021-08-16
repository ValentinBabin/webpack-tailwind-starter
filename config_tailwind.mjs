import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const logStatusMsg = {
    normal: 0,
    warning: 1,
    error: 2
}

/**
 * Init method
 */
function init() {
    if (fs.existsSync(path.resolve("./", 'tailwind_config.json'))) {
        logger(`${chalk.underline(path.basename(path.resolve("./", 'tailwind_config.json')))} existing, we can config tailwind.config.js.`, logStatusMsg.normal);

        fs.readFile(path.resolve("./", 'tailwind_config.json'), 'utf8', function (err, data) {
            if (err) throw err

            updateTailwindFile(JSON.parse(data), function (response) {
                if (response == true) {
                    logger(`${chalk.underline('tailwind.config.js')} configured.`, logStatusMsg.normal);
                }
            });

        });
    }
}

/**
 * Provide data to fill in tailwind config
 * @param dataToConfig data form json to config into tailwind file
 * @param callback return callback 
 * @returns boolean callback
 */
function updateTailwindFile(dataToConfig, callback) {
    let tailwindConfigLocation = path.resolve("./", 'tailwind.config.js');

    if (fs.existsSync(tailwindConfigLocation) && dataToConfig != null) {
        // Using stub file to custom original config file
        let stubFile = fs.readFileSync(path.resolve("./", 'simpleConfig.stub.js'), 'utf8');

        logger('Reading file and replacing ...', logStatusMsg.normal);

        // Change colors
        if (dataToConfig.primaryColor != null)
            stubFile = stubFile.replace('primaryColor: "",', `primaryColor: "${dataToConfig.primaryColor}",`);
        if (dataToConfig.secondaryColor != null)
            stubFile = stubFile.replace('secondaryColor: "",', `secondaryColor: "${dataToConfig.secondaryColor}",`);

        // TODO: Add more data next...

        logger('Replacing done.', logStatusMsg.normal);

        // Writing file 
        fs.writeFile(tailwindConfigLocation, stubFile, 'utf8', function (err, data) {
            if (err) throw err

            return callback(true);
        });
    } else {
        logger('tailwind.config.js not existing, cannot config file.', logStatusMsg.error);
        return callback(false);
    }
}

/**
 * Log method
 * @param message message to display
 * @param status stautus message (reference to varibale logStatusMsg)
 */
function logger(message, status) {
    const currentTime = new Date();
    const timeString = chalk.blackBright(currentTime.toLocaleTimeString());
    if (status != null)
        switch (status) {
            case 1:
                console.log(timeString + " " + chalk.bold.yellow(message));
                break;
            case 2:
                console.log(timeString + " " + chalk.bold.red(message));
                break;
            default:
                console.log(timeString + " " + chalk.bold.green(message));
                break;
        }
    console.log("");
}

init();
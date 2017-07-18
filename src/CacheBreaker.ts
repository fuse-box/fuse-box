import { Config } from "./Config";
import * as path from "path";
import { fastHash, removeFolder, ensureDir } from "./Utils";
import * as fs from "fs";
import * as log from "fliplog";
/**
 * 
 * The only purpose of this ugly function is to break cache when user changes the config..
 * 
 * @export
 */
export function breakCache() {

    const mainFile = require.main.filename;
    const fileKey = fastHash(mainFile);
    const currentStat = fs.statSync(mainFile);
    const fileModificationTime = currentStat.mtime.getTime()
    const bustingCacheFolder = path.join(Config.NODE_MODULES_DIR, "fuse-box/.cache-busting");
    ensureDir(bustingCacheFolder)
    const infoFile = path.join(bustingCacheFolder, fileKey as string);
    if (fs.existsSync(infoFile)) {
        const lastModifiedStored = fs.readFileSync(infoFile).toString();
        if (fileModificationTime.toString() !== lastModifiedStored) {
            log.white(``).echo();
            log.white(`-- cache cleared ---`).echo();
            removeFolder(Config.TEMP_FOLDER);
            fs.writeFileSync(infoFile, fileModificationTime.toString());
        }
    } else {
        fs.writeFileSync(infoFile, fileModificationTime.toString());
    }
}
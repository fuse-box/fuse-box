import { File } from "../../core/File";
/**
 * This plugin exists to understand FuseBox bundles.
 * For example if you bundle fusebox bundle this plugin will ensure
 * that all redundancies are removed (API wise)
 *
 * It will understand an uglified version of FuseBox
 * That's why we need OwnVariable plugin
 */
export declare class OwnBundle {
    static onNode(file: File, node: any, parent: any): void;
    static onEnd(file: File): void;
    /**
     * Getting rid of redundancies
     */
    private static removeFuseBoxApiFromBundle(file);
}

import { CSSCollection } from '../core/CSSCollection';
import { QuantumCore } from './QuantumCore';

export class CSSOptimizer {
    constructor(public core: QuantumCore) {

    }
    public optimize(cssCollection: CSSCollection, options: any) {
        let CleanCSS;
        this.core.log.echoInfo('CSS: Using "clean-css" module to optimise CSS');
        try {
            CleanCSS = require('clean-css');
        } catch (e) {
            this.core.log.echoWarning('"clean-css" module was not found! RUN: npm install clean-css');
            return;
        }
        const response = new CleanCSS(Object.assign(options || {}, {
            sourceMap: cssCollection.useSourceMaps,
            sourceMapInlineSources : true,
        })).minify(cssCollection.getString(),
            cssCollection.useSourceMaps ? cssCollection.sourceMap : undefined);

        if (response.errors && response.errors.length) {
            this.core.log.echoWarning(response.errors);
        } else {
            if( cssCollection.useSourceMaps ){
                this.core.log.echoInfo('CSS: Updating source maps');
                cssCollection.sourceMap = response.sourceMap.toString();
            }
            cssCollection.setString(response.styles);
            this.core.log.echoInfo('CSS: Successfully optimised');
        }
    }
}
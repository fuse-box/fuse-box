import { CSSFile } from './CSSFile';
import { QuantumCore } from '../plugin/QuantumCore';
import { Concat } from '../../Utils';

export class CSSCollection {
    public collection = new Set<CSSFile>();
    public sourceMap: any;
    public useSourceMaps = false;
    constructor(public core: QuantumCore) { }

    public add(css: CSSFile) {
        this.collection.add(css);
    }

    public getASString(fileName : string) {
        const producer = this.core.producer;
        const concat = new Concat(true, fileName, '\n')
        this.collection.forEach(file => {
            this.core.log.echoInfo(`CSS: Grouping inlined css ${file.name}`)
            const sourceMaps = producer.sharedSourceMaps.get(file.name);
            const contents = file.contents.replace(/\/*#\s*sourceMappingURL=\s*([^\s]+)\s*\*\//, '')
            concat.add(null, `/* ${file.name} */`)
            if (sourceMaps) {
                this.useSourceMaps = true;
                concat.add(file.name, contents, sourceMaps)
            } else {
                concat.add(null, contents);
            }
        });
        if ( this.useSourceMaps){
            concat.add(null, `/*# sourceMappingURL=/${fileName}.map */`);
        }
        this.sourceMap = concat.sourceMap;
        return concat.content.toString();
    }

}
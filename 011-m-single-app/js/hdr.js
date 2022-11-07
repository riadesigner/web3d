import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

class Hdr {

    static load(src) {

        return new Promise(resolve => {

            const loader = new RGBELoader();

            loader.load(src, resolve, undefined, exception => {

                throw exception;

            });

        });

    }

}

export {Hdr};


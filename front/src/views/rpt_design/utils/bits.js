//https://github.com/brockwhittaker/BitArray.js
const BitArray = (() => {
    // The BitArray is a simple bit flag implementation that utilizes standard arrays
    // (for expandability) and Uint32Array types for memory efficiency.
    // Every value is assumed either true or false (inclusive of uninitialized values),
    // however a warning is given if a particular block does not exist yet.
    const BitArray = function (opts) {
        // if the opts aren't specified, let's just make it an object so we can
        // safely OR its properties below.
        if (!opts) {
            opts = {};
        }

        // an internal map of Uint32Array blocks.
        // this has the fault of becoming a hole-d array, which could be bad.
        // perhaps give the option to use objects rather than arrays?
        this.map = [];
        // the size of a block inside of the map of Uint32Array objects.
        this.binSize = opts.binSize || 100;
    };

    BitArray.prototype = {
        // get a flag by its ID.
        get: function (id) {
            let b = this.binSize;
            // faster than `Math.floor`.
            // this gets the zone (bin) of Uint32Arrays (primary array index).
            let z = ~~(id / (b * 32));
            // if a value is inside a block that has already been created, we cannot
            // *really* tell whether a value has been set, but if the block doesn't
            // exist yet then it definitely doesn't.
            if (!this.map[z]) {
                //console.warn(`A value at the index '${id}' does not exist.`);
                return false;
            }

            // the bin of Uint32Array objects that we're looking in.
            let bin = this.map[z];
            // the actual Uint32Array the boolean exists within.
            // secondary array index.
            let slot = ~~((id % (b * 32)) / 32);

            // id & 31 is equivalent to id % 32
            // 1 << n is equal to 2 ^ x
            //
            // for any mod n where n = 2^i, modulo is simply keeping the lower order
            // bits 0 through i - 1
            //     00100100 | 36
            // AND 00011111 | 31
            // ==> 00000100 | 4
            return !!(bin[slot] & (1 << (id & 31)));
        },

        // set a Boolean value into an ID.
        set: function (id, val) {
            // this code is copied from above because this function call is expensive
            // (adds 20%) and can't really be inlined by JIT.
            let b = this.binSize;
            let z = ~~(id / (b * 32));
            if (!this.map[z]) {
                this.map[z] = new Uint32Array(b);
            }

            let bin = this.map[z];
            let slot = ~~((id % (b * 32)) / 32);

            if (val) {
                // if the value is truthy, use |= which will OR update the flag.
                //     01010001
                //  OR 00100000
                // ==> 01110001
                bin[slot] |= 1 << (id & 31);
            } else {
                // if the value is falsy, use &= ~FLAG to negate the flag.
                //     01010001
                // AND 11101111
                // ==> 01000001
                bin[slot] &= ~(1 << (id & 31));
            }

            return bin[slot];
        },

        // flip a bit to the opposite of its current value.
        // this will initialize flags that don't exist yet and set them to "true".
        flip: function (id) {
            let b = this.binSize;
            let z = ~~(id / (b * 32));
            if (!this.map[z]) {
                this.map[z] = new Uint32Array(b);
            }

            let bin = this.map[z];
            let slot = ~~((id % (b * 32)) / 32);

            // flip the particular flag.
            //      01000100
            // FLIP 00000100
            // ===> 01000000
            bin[slot] ^= 1 << (id & 31);

            return bin[slot];
        }
    };

    return BitArray;
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = BitArray;
}
/**
 * @description The ClassContainer is a container for classes that makes it possible
 * to share properties across classes through a common prototype. Any contained class will
 * have the ClassContainer obj set as its prototype. You can then select which of the
 * class properties will be copied and linked to get/set directly to the ClassContainer obj.
 * If the same property is linked from multiple classes they will effectively get/set to the
 * same property (that now resides in the ClassContainer obj).
 * @see eg: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
 * @author Mikael Norlén
 * @class ClassContainer
 */
class ClassContainer {
    constructor(params) {
        this.setProps(params);
    }

    /**
     * @description Contain a class on a given "classContainer.key" and set the ClassContainer obj
     * as its prototype. Then choose which properties will be linked - copied and updated
     * to get/set directly to the ClassContainer obj.
     * @author Mikael Norlén
     * @param {Obj} { key, className, (constructor) params, linkProps, linkPropsOverride }
     * @see linkPropsOf()
     * linkProps: Properties that are copied and linked to the ClassContainer obj
     * linkPropsOverride = false: If contained props should override existing values
     * @memberof ClassContainer
     */
    containClass({ key, className, params, linkProps, linkPropsOverride }) {
        // First create a new class object and set the ClassContainer obj as its prototype
        // This makes sure any calls to the prototype in a class constructor
        // would already be properly carried over to the ClassContainer obj
        let obj = Object.create(className.prototype);
        Object.setPrototypeOf(Object.getPrototypeOf(obj), this);
        // Then init contained class with "new"
        obj = new obj.constructor(params);
        // Store contained class in key
        this[key] = obj;

        // Link specified properties from contained class to prototype
        if (linkProps) {
            this.linkPropsOf([key], linkProps, linkPropsOverride);
        }
    }

    /**
     * @description Helper to set multiple properties to the ClassContainer obj
     * Equivalent to "this.property = value" for each property
     * @author Mikael Norlén
     * @param {obj} params eg. { prop1: value1, prop2: value2 }
     * @memberof ClassContainer
     */
    setProps(params) {
        Object.assign(this, params);
    }

    /**
     * @description Link a contained class' properties.
     * First copy the properties to the ClassContainer obj. Then update the contained class'
     * properties to get/set directly to the ClassContainer obj.
     * @author Mikael Norlén
     * @param {Array[Strings]} keys the "classContainer.keys" where the classes are contained
     * @param {Array[Strings]} props the properties to link
     * @param {Boolean} [propsOverride=false] if overriding existing props
     * @memberof ClassContainer
     */
    linkPropsOf(keys, props, propsOverride = false) {
        keys.forEach(key => {
            props.forEach(prop => {
                if (propsOverride) {
                    // Copy all
                    this[prop] = this[key][prop];
                } else if (!this[prop]) {
                    // Copy only if unset (falsy)
                    this[prop] = this[key][prop];
                }

                // Link (get/set) property to ClassContainer obj
                Object.defineProperty(this[key], prop, {
                    set: value => {
                        this[prop] = value;
                    },
                    get: () => this[prop],
                });
            });
        });
    }
}

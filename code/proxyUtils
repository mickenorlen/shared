/**
 * @description Redirect properties to get/set to another object
 * @author Mikael Norlén
 * @param {Obj} targetObj
 * @param {Arr/Obj} originObjsArrOrSingle
 * @param {Arr/String} propsArrOrSingle
 * @param {Boolean} [copyProps=true]
 * @param {Boolean} [hardCopy=false]
 */
function redirectPropsTo(
    targetObj,
    originObjsArrOrSingle,
    propsArrOrSingle,
    copyProps = true,
    hardCopy = false,
) {
    // Redirect prop to get/set to target Obj prop
    function redirectProp(originObj, prop) {
        if (copyProps) {
            if (hardCopy) {
                // Copy all
                // console.log('target', targetObj[prop], 'origin', originObj[prop]);
                targetObj[prop] = originObj[prop];
                // console.log('targetAfter', targetObj[prop]);
            } else if (!targetObj[prop]) {
                // Copy only if unset (falsy)
                targetObj[prop] = originObj[prop];
            }
        }

        // Set get/set property to target obj
        Object.defineProperty(originObj, prop, {
            set: value => {
                targetObj[prop] = value;
            },
            get: () => targetObj[prop],
        });
    }

    // Loop through if array arguments and then run redirectProp()
    if (Array.isArray(originObjsArrOrSingle)) {
        originObjsArrOrSingle.forEach(originObj => {
            if (Array.isArray(propsArrOrSingle)) {
                propsArrOrSingle.forEach(prop => {
                    redirectProp(originObj, prop);
                });
            } else {
                redirectProp(originObj, propsArrOrSingle);
            }
        });
    } else if (Array.isArray(propsArrOrSingle)) {
        propsArrOrSingle.forEach(prop => {
            redirectProp(originObjsArrOrSingle, prop);
        });
    } else {
        redirectProp(originObjsArrOrSingle, propsArrOrSingle);
    }
}

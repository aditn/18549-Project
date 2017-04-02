import _CONST from '../constants/RedKnifeConstants.js';

const ApiDataUtil = {

  reformArrayOfObjFromObjOfArray(obj) {
    const result = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const reformed = {};
        const fields = obj[key];
        fields.forEach((field, i) => {
          if (field.column === undefined) {
            console.warn('Undefined column being passed! will ignore');
          }else {
            reformed[field.column] = field.val;
          }
        });
        result.push(reformed);
      }
    }
    return result;
  },

  /**
   * Use this function to safely divide two numbers
   * This function guarentees to return a number
   * @param num1 - numerator
   * @param num2 - denominator
   * @param toFix - number of digits you want for the result
   * @return num1/num2 with fixed digits
   */
  safeDivide(num1, num2, toFix) {
    if (isNaN(num1) || isNaN(num2)) {
      console.warn('Tried to dived non-numbers: ', num1, num2);
      return 0;
    }
    let fix = toFix;
    // The division might be float, we only use 1 decimal
    if (fix === undefined) {
      fix = 1;
    }
    if (num2 === 0) {
      // Trying to divide by 0
      // console.error('Dividing ' + num1 + ' by ' + num2 + ', returning 0');
      return 0;
    }
    // console.log((num1/num2).toFixed(toFix));
    return parseFloat((num1 / num2).toFixed(toFix));
  },
  /**
   * Given an valid object and a list of Id,
   * This function searches for object elems whose id is in listOfId and add each value up
   * @param obj - the main object
   * @param listOfId - a list of ids you want
   * @return a single object that concats/adds each elem data in @param obj
   */
  getSumFromObj(obj, listOfId) {
    const sum = {};
    for (const i in obj) {
      const elem = obj[i];
      if (elem === undefined || elem._id === undefined) {
        continue;
      }
      if (listOfId.indexOf(elem._id) !== -1) {
        // Found it
        for (let name in elem) {
          const value = elem[name];
          if (sum[name] === undefined) {
            sum[name] = value;
          } else {
            sum[name] += value;
          }
        }
      }
    }
    return sum;
  },
  /**
   * This function takes in a list(UD) and re-group them
   * @param list
   * @return an object with customerType as keys
   */
  seperateDataFromUD(list) {
    let result = {};
    let customerType = _CONST.customerType;
    for (let elem in list) {
      switch (list[elem]._id) {
        case customerType.newUser:
          result.newUser = list[elem];
          break;
        case customerType.hypoActiveUser:
          result.hypoActiveUser = list[elem];
          break;
        case customerType.activeUser:
          result.activeUser = list[elem];
          break;
        case customerType.hyperActiveUser:
          result.hyperActiveUser = list[elem];
          break;
        case customerType.employee:
          result.employee = list[elem];
          break;
        case customerType.other:
          result.other = list[elem];
          break;
        default:
          console.log('Uncatagorized type: ', elem._id);
          break;
      }
    }
    // Before we return we try to validate the result
    // Writing each defaultValue out to prevend alias
    if (result.newUser === undefined) {
      console.warn('UD has no newUser, using defaultValue');
      result.newUser = {
        _id: '-1',
        longstay: 0,
        pv: 0,
        shortstay: 0,
        uv: 0,
        vpv: 0,
        vuv: 0
      };
    }
    if (result.activeUser === undefined) {
      console.warn('UD has no activeUser, using defaultValue');
      result.activeUser = {
        _id: '-1',
        longstay: 0,
        pv: 0,
        shortstay: 0,
        uv: 0,
        vpv: 0,
        vuv: 0
      };
    }
    if (result.hypoActiveUser === undefined) {
      console.warn('UD has no hypoActiveUser, using defaultValue');
      result.hypoActiveUser = {
        _id: '-1',
        longstay: 0,
        pv: 0,
        shortstay: 0,
        uv: 0,
        vpv: 0,
        vuv: 0
      };
    }
    if (result.hyperActiveUser === undefined) {
      console.warn('UD has no hyperActiveUser, using defaultValue');
      result.hyperActiveUser = {
        _id: '-1',
        longstay: 0,
        pv: 0,
        shortstay: 0,
        uv: 0,
        vpv: 0,
        vuv: 0
      };
    }
    if (result.employee === undefined) {
      console.warn('UD has no employee, using defaultValue');
      result.employee = {
        _id: '-1',
        longstay: 0,
        pv: 0,
        shortstay: 0,
        uv: 0,
        vpv: 0,
        vuv: 0
      };
    }
    if (result.other === undefined) {
      console.warn('UD has no other, using defaultValue');
      result.other = {
        _id: '-1',
        longstay: 0,
        pv: 0,
        shortstay: 0,
        uv: 0,
        vpv: 0,
        vuv: 0
      };
    }

    return result;
  },
  /**
   * This function simply checks for data existence
   * @param resp - an object that you wanna check
   * @return 'OK' if resp has many keys, 'FAILED' if @param resp
   *       does not have an '_id' key, or the data for each elem
   */
  eval(resp) {
    // console.log(resp);
    if (resp === undefined || resp === null) {
      return 'FAILED';
    }
    if (Object.keys(resp).length > 2) {
      // Too many data, simly show if it's okay
      return 'OK';
    }
    for (const elem in resp) {
      // Just 2
      if (elem !== '_id') {
        return resp[elem];
      }
    }
    return 'FAILED';
  },
  /**
   * @param list - a list
   * @return a modified list with unique ap for every elem in modified list
   */
  combineAp(list) {
    const result = [];
    for (let i = 0, l = list.length; i < l; i++) {
      const elem = list[i];
      const index = this.findInListByAp(result, elem.ap);
      if (index !== -1) {
        // Elem contains ap that result already has
        result[index] = this.multiAdd(result[index], elem);
      } else {
        // Not in result
        result.push(this.multiAdd({}, elem));
      }
    }
    return result;
  },
  /**
   * @param list - the list (of objects) you wanna check
   * @param ap - the ap you want to check
   * @return an integer that shows the index of the object that has identical ap
   *         to our @param ap
   */
  findInListByAp(list, ap) {
    for (let i = 0, l = list.length; i < l; i++) {
      const elem = list[i];
      if (elem !== undefined && elem.ap === ap) {
        return i;
      }
    }
    return -1;
  },
  // This is a VERY specific function for multidata usage only
  /**
   * @param obj1
   * @param obj2
   * @return a result that adds everything in obj1 and obj2
   */
  multiAdd(obj1, obj2) {
    const result = {};
    // Take out the ap
    const transformed = {
      type: obj2.type,
      longstay: obj2.longstay,
      shortstay: obj2.shortstay,
      pv: obj2.pv,
      uv: obj2.uv,
      vuv: obj2.vuv,
      vpv: obj2.vpv,
      dw: obj2.dw,
      vluv: obj2.vluv
    };
    if (obj1.data === undefined) {
      // Empty obj1, restructure obj2 and return
      result.ap = obj2.ap;
      result.data = [transformed];
    } else {
      // Non-empty obj1, add transformed to result.data
      // Obj1 alread has data
      result.ap = obj2.ap;
      result.data = obj1.data;
      result.data.push(transformed);
    }
    return result;
  },
  /**
   * Given a list of objects, this function will add all elem[target] for
   * elem in list if elem[types||id] is in param types
   *
   * @param list - a list of objects
   * @param types - will only add elems whose types are in this param
   * @param target - a string
   * @return an integer that is calculated based on argument list
   */
  addSpecific(list, tps, target) {
    if (list === undefined || list.length <= 0) {
      // console.error('Adding with an empty/undefined list');
      return 0;
    }
    let types = tps;
    if (types === undefined || types.length <= 0 || types === null) {
      // Automatic get default types
      types = [_CONST.customerType.newUser,
        _CONST.customerType.hypoActiveUser,
        _CONST.customerType.activeUser,
        _CONST.customerType.hyperActiveUser
      ];
    }
    let result = 0;
    for (let i = 0, l = list.length; i < l; i++) {
      const elem = list[i];
      if (elem === undefined || (elem.type === undefined && elem._id === undefined)) {
        // Ignore elements without type or id
        continue;
      }
      if (elem.type !== undefined) {
        // Uses type for key
        if (types.indexOf(elem.type) !== -1) {
          // This type is allowed
          result += elem[target];
        }
      } else {
        // uses id for key
        if (types.indexOf(elem._id) !== -1) {
          result += elem[target];
        }
      }
    }
    return result;
  },
};

export default ApiDataUtil;

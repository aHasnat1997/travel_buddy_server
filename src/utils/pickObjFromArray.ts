/**
 * pick function for picking right object. 
 * @param obj full object
 * @param keys needed keys array
 * @returns Object with needed property
 */
export const pick = (obj: Record<string, unknown>, keys: string[]) => {
  const finalObj: Record<string, unknown> = {};

  keys.forEach(key => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      if (key === 'limit' || key === 'page') {
        finalObj[key] = Number(obj[key])
      }
      finalObj[key] = obj[key]
    }
  })
  return finalObj;
};
export const objectCropper = (object, ...keys) => {
  let currentObject = object;
  
  keys.forEach(key => currentObject = cropProperty(currentObject, key));

  return currentObject;
}

function cropProperty(object, key) {
  const {[key]: deletedKey, ...remainingKeys} = object;
  
  return remainingKeys;
}
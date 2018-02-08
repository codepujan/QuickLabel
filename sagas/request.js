import 'whatwg-fetch';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

function processResponse(response) {
  return new Promise((resolve, reject) => {
    const status = response.status;
    console.log('response status: ', status);
    if(status >= 200 && status < 300) {
      return response.json()
           .then(data => resolve(data));
    }
    return response.json()
         .then(data => reject(data));
  });
}


/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  console.log('request: ',url);
//  console.log('options: ',JSON.stringify(options));
  return fetch(url, options)
      .then(processResponse);
//    .then(checkStatus)
//    .then(parseJSON);
}

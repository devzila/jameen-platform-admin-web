const options = {
  headers: {
    Accept: 'application/json',
    Authorization: localStorage.getItem('platform_token')
  },
  interceptors: {
    // every time we make an http request, this will run 1st before the request is made
    // url, path and route are supplied to the interceptor
    // request options can be modified and must be returned
    request: async ({ options, url, path, route }) => {
      return options
    },
    /*
    // every time we make an http request, before getting the response back, this will run
    response: async ({ response, abort }) => {
      if(response.status === 400){
        // TODO: try to destroy session and take user to login page as auth token either expired 
        // or not a valid one   
      }
      return response
    }
    */
  },
  cachePolicy: 'no-cache'
}

export default options
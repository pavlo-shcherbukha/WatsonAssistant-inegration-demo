import axios from "axios";

function parseErrorMessage(message) {
  let error = {
    type: "",
    status: "",
    message: "",
    url: "",
    method: ""
  };

  error.message = message.message ? message.message : null;
  error.url = message.config ? message.config.url : null;
  error.method = message.config ? message.config.method : null;

  if (!message.response) {
    error.type = "network";
    error.status = null;
  } else {
    error.type = "response";
    error.status = message.response.status;
    error.headers = message.response.headers;
    error.data = message.response.data;
  }

  return error;
}

export default {
  get: async (url, headers, callbackSuccess, callbackError) => {
    try {
      let response = await axios.get(url, { headers });

      if (callbackSuccess) {
        callbackSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      let error = parseErrorMessage(err);

      if (callbackError) {
        callbackError(error);
      }
      console.log("Error: ", JSON.stringify(error, null, 2));
      return error;
    }
  },

  post: async (url, data, headers, callbackSuccess, callbackError) => {
    try {
      let response = await axios({
        method: "post",
        url: url,
        data: data,
        headers: headers
      });

      if (callbackSuccess) {
        callbackSuccess(response);
      }

      return response;
    } catch (err) {
      let error = parseErrorMessage(err);

      if (callbackError) {
        callbackError(error);
      }
      console.log("Error: ", JSON.stringify(error, null, 2));
      return error;
    }
  }
};

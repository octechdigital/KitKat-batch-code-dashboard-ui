/* eslint-disable @typescript-eslint/no-explicit-any */
// import { enqueueSnackbar } from "notistack";
import { logoutUser, showToast } from "../lib/utils";
import { store } from "../store/store";

const jsonHeaders: { [key: string]: string } = {
  // Accept: "application/json",
  Accept: "*/*",
  // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  "Content-Type": "application/json",
};

export async function unauthorisedApiCall(
  url: string,
  data: any = {},
  method = "POST",
  additionalHeaders: { [key: string]: string } = {}
) {
  const headers = {
    ...jsonHeaders,
    ...additionalHeaders,
  };
  return makeApiCall(url, data, method, headers);
}

export async function authorisedApiCall(
  url: string,
  data: any = {},
  method = "POST",
  additionalHeaders: { [key: string]: string } = {}
) {
  const { accessToken } = await store.getState().auth;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...additionalHeaders,
    ...jsonHeaders,
  };
  return makeApiCall(url, data, method, headers);
}

function makeApiCall(
  url: string,
  data: any = {},
  method = "POST",
  headers = jsonHeaders
) {
  const fetchOptions: RequestInit = {
    method,
    headers,
  };
  let qp = "";
  if (method === "POST") {
    fetchOptions.body = JSON.stringify(data);
  } else if (method === "GET") {
    // fetchOptions.body = JSON.stringify(data);
    qp = new URLSearchParams(data).toString();
  }
  return fetch(
    `${import.meta.env.VITE_API_BASE_URL}${url}?${qp}`,
    fetchOptions
  );
}

export const fetchHandler = (response: any): Promise<any> => {
  const defaultResp = {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  };
  if (response.ok) {
    return response
      .json()
      .then((data: any) => {
        // the status was ok and there is a json body
        return Promise.resolve({ data, rawResp: response, ...defaultResp });
      })
      .catch((err: any) => {
        // the status was ok but there is no json body
        return Promise.resolve({
          data: err,
          rawResp: response,
          ...defaultResp,
        });
      });
  } else {
    return response
      .json()
      .catch((err: any) => {
        // the status was not ok and there is no json body
        return Promise.resolve({
          rawResp: response,
          data: err,
          ...defaultResp,
        });
      })
      .then((json: any) => {
        // the status was not ok but there is a json body
        return Promise.resolve({
          rawResp: response,
          data: json,
          ...defaultResp,
        });
      });
  }
};

export const responseHelper = (response: any): Promise<any> => {
  const { statusCode } = response.data;
  if (statusCode >= 200 && statusCode < 300) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response.data);
  }
};

// Default catch function when API fails
export function defaultCatch<T>(err: any): Promise<T> {
  const ignoreMessageKeys: string[] = [];
  const { message, messageId = "" } = err;
  if (typeof err === "string") {
    showToast(
      "error",
      message || "Something went wrong, try again after some time"
    );
  } else if (!ignoreMessageKeys.includes(messageId)) {
    if (message === "Failed to fetch") {
      showToast("error", "Please check your network and try again");
    } else if (message === "Unauthorized") {
      logoutUser();
      showToast("error", "Your session has been expired");
    } else {
      showToast("error", message || "Your session has been expired");
    }
  }
  return Promise.reject(err);
}

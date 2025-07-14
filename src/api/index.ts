/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BaseResponse,
  DashboardCountResponse,
  GetAnyDataResponse,
  GetRejectReasonResponse,
  GetUserDataResponse,
  LoginResponse,
} from "../interface/api";

import {
  authorisedApiCall,
  defaultCatch,
  fetchHandler,
  responseHelper,
  unauthorisedApiCall,
} from "./utils";

class APIS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private showLoader = (loaderTitle?: string | undefined) => {};
  private hideLoader = (loaderTitle?: string | undefined) => {};
  private static instance: APIS | null = null;
  public instanceId = "TEST";

  constructor(instanceId: string) {
    this.instanceId = instanceId;
  }

  static getInstance() {
    return APIS.instance || (APIS.instance = new APIS("TEST NEW 1"));
  }

  initialize(
    showLoader: (loaderTitle?: string | undefined) => void,
    hideLoader: () => void
  ) {
    this.showLoader = showLoader;
    this.hideLoader = hideLoader;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return unauthorisedApiCall("/admin/login", { email, password })
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async logout(): Promise<BaseResponse> {
    this.showLoader("Logout...");
    return authorisedApiCall("/admin/logout", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally(this.hideLoader);
  }

  async dashboardCount(): Promise<DashboardCountResponse> {
    return authorisedApiCall("/admin/getCodeData", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async getPendingData(): Promise<GetAnyDataResponse> {
    return authorisedApiCall("/admin/getCodeInfo", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }
  async getApproveData(): Promise<GetAnyDataResponse> {
    return authorisedApiCall("/admin/getApprovedUsers", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }
  async getRejectedData(): Promise<GetAnyDataResponse> {
    return authorisedApiCall("/admin/getRejectedUsers", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async getUserData(userId: string): Promise<GetUserDataResponse> {
    return authorisedApiCall(`/admin/getUserInfo/${userId}`, {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async getRejectReasonData(): Promise<GetRejectReasonResponse> {
    return authorisedApiCall("/admin/rejectReason", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }
  async getApproveReasonData(): Promise<GetRejectReasonResponse> {
    return authorisedApiCall("/admin/approveReason", {}, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch)
      .finally();
  }

  async updateCodeStatus(code: string): Promise<BaseResponse> {
    return authorisedApiCall(`/admin/updateCodeStatus/${code}`, null, "GET")
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch);
  }

 // In your API file
  async userAction<T = BaseResponse>(
    endpoint: "addCode",
    payload: Record<string, any> = {}
  ): Promise<T> {
    const finalPayload = { ...payload };

    return authorisedApiCall(`/admin/${endpoint}`, finalPayload)
      .then(fetchHandler)
      .then(responseHelper)
      .catch(defaultCatch);
  }
}
const API = APIS.getInstance();

export default API;

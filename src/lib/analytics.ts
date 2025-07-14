/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

const PROJECT_PREFIX = ""; // TODO: change this before deployment

export enum EVENTS {
  // landing and auth
  GET_OTP = "GET_OTP",
  VERIFY_OTP = "VERIFY_OTP",
}

type EventsMapType = { [key in keyof typeof EVENTS]?: any };

const GA_EVENTS: EventsMapType = {
  [EVENTS.GET_OTP]: "GET_OTP",
  [EVENTS.VERIFY_OTP]: "VERIFY_OTP",
};

const FLOODLIGHT_EVENTS: EventsMapType = {};

const FB_PIXEL_EVENTS: EventsMapType = {};

const CDS_PIXEL_EVENTS: EventsMapType = {
  // [EVENTS.HOME_PAGE_LOAD]: {
  //   event_type: "Page_view",
  //   event_sub_type: "Homepage_Landing",
  // },
};

const UPA_PIXEL_EVENTS: EventsMapType = {};

function trackCdsPixelEvent(payload: any = {}, additionalInfo?: any): void {
  //   payload.user_identifier = getCookie("__cds_pixel_id");
  //   payload.user_identifier_type = "COKE_COOKIE";
  //   payload.user_identifier_sub_type = "CDS_PIXEL_COOKIE";
  payload.brand_name = "Limca";

  // console.log("cds pixel payload", { ...payload, ...additionalInfo });
  if ((window as any).cds_pixel) {
    (window as any).cds_pixel(import.meta.env.REACT_APP_CDP_CLIENT_ID, {
      ...payload,
      ...additionalInfo,
    });
  }
}

function trackFloodLightEvent(event: any, additionalInfo?: any) {
  if ((window as any).gtag) {
    (window as any).gtag("event", "conversion", {
      allow_custom_scripts: true,
      send_to: event,
      ...(additionalInfo || {}),
    });
  }
}

function trackFbPixelEvent(event: any, _additionalInfo?: any) {
  if ((window as any).fbq) {
    (window as any).fbq("track", event);
  }
}

function gtagTrackEvent(event: any, additionalInfo?: any) {
  if ((window as any).gtag) {
    (window as any).gtag("event", PROJECT_PREFIX + event, additionalInfo);
  }
}

const trackUniversalPixelEvent = (event: any, _additionalInfo?: any) => {
  try {
    // Removing and adding new universal pixel
    const pixelUrl = `https://insight.adsrvr.org/track/pxl/?adv=zuazor5&ct=${event}&fmt=3`;
    const existingPixels = document.querySelectorAll(`img[src="${pixelUrl}"]`);
    existingPixels.forEach((pixel: any) => pixel.parentNode.removeChild(pixel));

    // Create a new tracking pixel
    const img = new Image(1, 1); // Creates an image of 1x1 pixels
    img.src = pixelUrl;
    img.alt = "";
    img.style.borderStyle = "none";
    img.style.position = "absolute";
    img.style.opacity = "0";

    // adding the pixel image
    if (document.body.firstChild) {
      document.body.insertBefore(img, document.body.firstChild);
    } else {
      document.body.appendChild(img);
    }
  } catch (error) {
    console.error("Error Universal Pixel", error);
  }
};

export function trackEvent(
  event: EVENTS,
  additionalInfo?: {
    common?: any;
    ga?: any;
    fl?: any;
    fbPixel?: any;
    cdsPixel?: any;
    upaPixel?: any;
  }
) {
  const gaEvent = GA_EVENTS[event];
  const flEvent = FLOODLIGHT_EVENTS[event];
  const fbPixelEvent = FB_PIXEL_EVENTS[event];
  const cdsPixelEvent = CDS_PIXEL_EVENTS[event];
  const upaPixelEvent = UPA_PIXEL_EVENTS[event];

  if (gaEvent) {
    gtagTrackEvent(gaEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.ga,
    });
  }
  if (flEvent) {
    trackFloodLightEvent(flEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.fl,
    });
  }
  if (fbPixelEvent) {
    trackFbPixelEvent(fbPixelEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.fbPixel,
    });
  }
  if (cdsPixelEvent) {
    trackCdsPixelEvent(cdsPixelEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.cdsPixel,
    });
  }
  if (upaPixelEvent) {
    trackUniversalPixelEvent(upaPixelEvent, {
      ...additionalInfo?.common,
      ...additionalInfo?.upaPixel,
    });
  }
}

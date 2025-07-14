/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import toast from "react-hot-toast";
import { setAccessToken } from "../store/slices/authSlice";
import { clearUserDetails } from "../store/slices/userSlice";
import { store } from "../store/store";
export function addCaptchaScript(cb?: () => void): void {
  const script = document.getElementById("grecaptcha-script");
  if (script) {
    if (cb) cb();
  } else {
    const newScript = document.createElement("script");
    newScript.src =
      "https://www.google.com/recaptcha/enterprise.js?render=" +
      import.meta.env.VITE_CAPTCHA_SITE_KEY;
    newScript.id = "grecaptcha-script";
    document.body.append(newScript);
    newScript.onload = () => {
      if (cb) cb();
    };
  }
}

export function showCaptchaBadge(): void {
  const badge: HTMLDivElement | null =
    document.querySelector(".grecaptcha-badge");
  if (badge) {
    badge.style.display = "block";
  } else {
    addCaptchaScript();
  }
}

export function hideCaptchaBadge(): void {
  const badge: HTMLDivElement | null =
    document.querySelector(".grecaptcha-badge");
  if (badge) {
    badge.style.display = "none";
  }
}

/**
 * Opens given url url in a new tab
 * @param {string} url
 * @return {void}
 */
export function openInNewTab(url: string): void {
  Object.assign(document.createElement("a"), {
    target: "_blank",
    href: url,
  }).click();
}

/**
 * Copy given text to clipboard
 * @param {string} text
 * @return {void}
 */
export function copyToClipboard(text: string): void {
  const inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = text;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function setCookie(name: string, value: string, days?: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const formats = ["jpg", "png", "jpeg"];
    let extension = file.name.split(".").pop();
    if (extension) {
      extension = extension.toLowerCase();
      if (formats.includes(extension)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      } else {
        reject("Unsupported file format - " + extension);
      }
    } else {
      reject("Unsupported file format - " + extension);
    }
  });

export function dataURItoBlob(dataURI: string) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export async function shareImage(
  link: string,
  text: string,
  fallback?: (text: string, link: string) => void
) {
  const titleText = "Havell’s festive selfie";

  if (
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i)
  ) {
    const shareData = {
      title: text,
      text: text,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          // recordAction(ApiRecordActions.INSTA_SHARE);
          // gaDataPush({
          //   event: "customEvent",
          //   eventCategory: "redeem prize social link",
          //   eventAction: "instagram",
          // });
        })
        .catch(() => {
          if (fallback) fallback(text, link);
        });
    } else {
      if (fallback) fallback(text, link);
    }
  } else {
    const blob = await fetch(link, { mode: "no-cors" }).then((r) => r.blob());
    const file = new File([blob], "Share.jpg", { type: "image/jpeg" });
    const nav: any = navigator;
    if (nav.canShare && nav.canShare({ files: [file] })) {
      nav
        .share({
          files: [file],
          title: titleText,
          text: text,
          // url: `${location.origin}${process.env.VUE_APP_PUBLIC_PATH}`,
        })
        .then(() => {
          // recordAction(ApiRecordActions.INSTA_SHARE);
          // gaDataPush({
          //   event: "customEvent",
          //   eventCategory: "redeem prize social link",
          //   eventAction: "instagram",
          // });
        })
        .catch(() => {
          if (fallback) fallback(text, link);
        });
    } else {
      if (fallback) fallback(text, link);
    }
  }
}

export function nativeShareText(
  text: string,
  fallback?: (text: string) => void
) {
  const shareData = {
    title: "Title",
    text: text,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {
      if (fallback) fallback(text);
    });
  } else {
    if (fallback) fallback(text);
  }
}

// const isMobile = function() {
//     let check = false;
//     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
//     return check;
// };
// const mobileStatus = isMobile();
// console.log(`isMobile`, mobileStatus);

export function shareOnTwitter(text: string) {
  openInNewTab(`http://twitter.com/share?text=${encodeURIComponent(text)}`);
}

export function shareOnSMS(text: string) {
  openInNewTab(`sms:;?&body=${encodeURIComponent(text)}`);
}

export function shareOnWhatsapp(text: string, url: string) {
  const message = `${text}\n${url}`;
  // console.log("message",message);
  // console.log("encodeURIComponent",encodeURIComponent(message));
  openInNewTab(`https://wa.me/?text=${encodeURIComponent(message)}`);
}

export function shareOnInstagram() {
  if (
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i)
  ) {
    openInNewTab(`instagram://`);
  } else {
    openInNewTab(`https://www.instagram.com/`);
  }
}

export function shareOnFacebook(text: string, url: string) {
  if (
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i)
  ) {
    openInNewTab(`fb://`);
  } else {
    openInNewTab(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(
        text
      )}`
    );
  }
}

export function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function logoutUser() {
  store.dispatch(setAccessToken(""));
  store.dispatch(clearUserDetails());
  // console.log('State after clearing:', store.getState().questionsSlice);
}

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
export const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

export const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "header",
  "blockquote",
  "code-block",
  "indent",
  "list",
  "direction",
  "align",
  "link",
  "image",
  "video",
  "formula",
];

export const showToast = (
  type: "success" | "error" | "exist",
  message: string,
  duration = 3000,
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right" = "bottom-right"
) => {
  const options = {
    duration,
    position,
  };

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else if (type === "exist") {
    toast(message, {
      ...options,
      icon: "✅",
      style: {
        background: "#fff",
        color: "#000",
        border: "1px solid #000",
      },
    });
  }
};

export const convertUrlToFileList = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  // Extract the file name from the URL
  const fileName = url.split("/").pop() || "image.jpg";
  const file = new File([blob], fileName, { type: blob.type });

  // Create a DataTransfer object to simulate a FileList
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  return dataTransfer.files; // Return the FileList object
};

export const goBack = () => window.history.back();

export const getMediaTypeFromSrc = (
  src?: string
): "image" | "pdf" | "video" => {
  if (!src || typeof src !== "string") return "image";

  const extension = src.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension!))
    return "image";
  if (["mp4", "webm", "ogg"].includes(extension!)) return "video";
  if (extension === "pdf") return "pdf";

  return "image";
};

// import { localStorageExt } from "@web-learning/utils/local-storage";
// import { LOCAL_STORAGE_KEYS } from "@web-learning/utils/constants";
import { redirect } from "next/navigation";
import PAGE_NAME from "./constants/page_name";
// import PAGE_NAME from "@web-learning/constants/page_name";
// import { useEffect, useRef, useState } from "react";

export default function Home() {
  // const user: string | null = localStorageExt.getToken();
  // const role = localStorageExt.getLocalStorage(LOCAL_STORAGE_KEYS.USER_ROLE);

  // if (user) {
  //   redirect(PAGE_NAME.cari_lowongan);
  // } else {
  //   redirect(PAGE_NAME.login);
  // }
  redirect(PAGE_NAME.login);
}

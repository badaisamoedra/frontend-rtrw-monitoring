import { redirect } from "next/navigation";
import PAGE_NAME from "./constants/page_name";
import { localStorageExt } from "@rtrw-monitoring-system/utils";

export default function Home() {
  const user: string | null = localStorageExt.getToken();

  if (user) {
    redirect(PAGE_NAME.dashboard);
  } else {
    redirect(PAGE_NAME.login);
  }
  redirect(PAGE_NAME.login);
}

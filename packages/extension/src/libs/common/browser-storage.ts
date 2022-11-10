import Storage from "@samaraapp/storage";
import { BrowserStorageArea } from "@samaraapp/types";

class BrowserStorage extends Storage {
  constructor(namespace: string, storage?: BrowserStorageArea) {
    super(namespace, { storage });
  }
}

export default BrowserStorage;

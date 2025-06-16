import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Quantity } from "ao-tokens";
import { get, set, del } from "idb-keyval";

function deepSerialize(data: any): any {
  if (data instanceof Quantity) {
    return {
      __type: "Quantity",
      raw: data.raw.toString(),
      denomination: data.denomination.toString()
    };
  }

  if (Array.isArray(data)) {
    return data.map(deepSerialize);
  }

  if (data && typeof data === "object") {
    const serialized: Record<string, any> = {};

    for (const key in data) {
      serialized[key] = deepSerialize(data[key]);
    }

    return serialized;
  }

  return data;
}

function deepDeserialize(data: any): any {
  if (Array.isArray(data)) {
    return data.map(deepDeserialize);
  }

  if (data && typeof data === "object") {
    if (data.__type === "Quantity") {
      return new Quantity(
        data.raw,
        BigInt(data.denomination)
      );
    }

    const deserialized: Record<string, any> = {};

    for (const key in data) {
      deserialized[key] = deepDeserialize(data[key]);
    }

    return deserialized;
  }

  return data;
}

export const persister = createAsyncStoragePersister({
  storage: {
    getItem: get,
    setItem: set,
    removeItem: del
  },
  serialize: (data) => deepSerialize(data),
  deserialize: (data) => deepDeserialize(data)
});

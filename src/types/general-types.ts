import { compServiceStatusEnum } from "../db/schema";

export interface payloadType {
  user: {
    id: string;
  };
}

export type compServiceStatusEnumType =
  (typeof compServiceStatusEnum.enumValues)[number];

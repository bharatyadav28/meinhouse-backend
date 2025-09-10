import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { Address } from "./address.model";

export const saveAddress = async (userId: string, data: any) => {
  const { id, ...addressData } = data;
  const defaultAddress = await db
    .select({ id: Address.id })
    .from(Address)
    .where(and(eq(Address.userId, userId), eq(Address.isDefault, "true")))
    .limit(1);

  const doesDefaultExist = defaultAddress && defaultAddress.length > 0;

  const address = await db
    .insert(Address)
    .values({
      ...addressData,
      userId,
      isDefault: !doesDefaultExist,
    })
    .returning();

  if (!address || address.length === 0) {
    throw new Error("Address not saved");
  }

  return address[0];
};

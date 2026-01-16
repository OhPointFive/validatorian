import type { Validator } from "../validator-helpers/validator";
import { vNull, vUndefined } from "./const";
import { vUnion } from "./union";

/**
 * Validates that the passed value either passes the validator, or is `undefined` or `null`.
 *
 * If you only want to allow `null`, use `vNullable` instead.
 * If you only want to allow `undefined`, use `vOrUndefined` instead.
 */
export const vOptional = <T>(v: Validator<T>) => vUnion(v, vUndefined, vNull);

/** Validates that the passed value either passes the validator, or is `null`. */
export const vNullable = <T>(v: Validator<T>) => vUnion(v, vNull);

/** Validates that the passed value either passes the validator, or is `undefined`. */
export const vOrUndefined = <T>(v: Validator<T>) => vUnion(v, vUndefined);

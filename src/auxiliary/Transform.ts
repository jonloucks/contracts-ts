/**
 * Transform.ts
 * 
 * Defines a Transform type that can transform values of type I to type O.
 */ 

import { guardFunctions, isFunctionWithArity, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck, used } from "@jonloucks/contracts-ts/auxiliary/Checks";

/**
 * A function that transforms type I to type O
 */
export type Method<I, O> = (input: I) => O;

/**
 * A transformation from type I to type O
 */
export interface Transform<I, O> {

  /**
   * Transform an input of type I to an output of type O
   * 
   * @param input the input to transform
   * @returns the transformed output
   */
  transform(input: I): O;
}

/**
 * A transformation type that can be a Transform or a function from type I to type O
 */
export type Type<I, O> = Transform<I, O> | Method<I, O> | O;

/**
 * Check if a value is a Transform
 * 
 * @param transform the value to check
 * @returns true if the value is a Transform, false otherwise
 */
export function guard<I, O>(transform: unknown): transform is Transform<I, O> {
  return guardFunctions(transform, 'transform');
}

/**
 * Check if a value is a function with arity 1
 * 
 * @param transform the value to check
 * @returns true if the value is a function with arity 1, false otherwise
 */
export function guardMethod<I, O>(transform: unknown): transform is Method<I, O> {
  return isFunctionWithArity(transform, 1);
}

/**
 * Convert a TransformType to a Transform
 * 
 * @param transform the TransformType to convert
 * @returns the Transform
 */
export function fromType<I, O>(transform: Type<I, O>): RequiredType<Transform<I, O>> {
  const validTransformType = presentCheck(transform, "TransformType must be present.");
  if (guard<I, O>(validTransformType)) {
    return validTransformType;
  } else if (guardMethod<I, O>(validTransformType)) {
    return { transform: validTransformType };
  } else {
    return { transform: (input: I) : O => { used(input); return validTransformType; } };
  }
}

/**
 * Get the value from a Transform Type
 * 
 * @param type the Transform Type
 * @param <T> the type of value supplied
 * @returns the value supplied by the Transform Type
 */
export function toValue<I,O>(type: Type<I,O>, input: I): O {
  if (guard(type)) {
    return type.transform(input);
  } else if (guardMethod<I,O>(type)) {
    return type(input); // type is a Method, call it with input
  } else {
    return type; // type is a direct value of type O
  }
}

/**
 * Check that a Transform is present
 *
 * @param transform the transform to check
 * @return the transform if present
 * @throws IllegalArgumentException if the transform is not present
 */
export function check<I,O>(transform: Type<I,O>): Type<I,O> {
  return presentCheck(transform, "Transform must be present.");
}
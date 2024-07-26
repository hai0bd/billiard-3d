import { Vec3 } from "cc"

export const zero = new Vec3()
export const up = new Vec3(0, 0, 1)

export function addScaledVector(pos: Vec3, vector: Vec3, scale: number): Vec3 {
  return pos.add(vector.clone().multiplyScalar(scale));
};

export function vec(v) {
  return new Vec3(v.x, v.y, v.z)
}

export function upCross(v) {
  return new Vec3(up).cross(v)
}

export function norm(v) {
  return new Vec3(v).normalize()
}

export function passesThroughZero(v, dv) {
  return new Vec3(v).add(dv).dot(v) <= 0
}

export function unitAtAngle(theta) {
  // return new Vec3(1, 0, 0).applyAxisAngle(up, theta)
}

export function round(num) {
  const sign = Math.sign(num)
  return (sign * Math.floor((Math.abs(num) + Number.EPSILON) * 10000)) / 10000
}

export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

export function roundVec(v) {
  v.x = round(v.x)
  v.y = round(v.y)
  v.z = round(v.z)
  return v
}

export function roundVec2(v) {
  v.x = round2(v.x)
  v.y = round2(v.y)
  v.z = round2(v.z)
  return v
}

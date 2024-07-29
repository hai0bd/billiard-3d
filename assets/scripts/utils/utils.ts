import { v2 } from "cc";
import { Quat } from "cc";
import { Vec3 } from "cc"

export const up = new Vec3(0, 0, 1)

declare module 'cc' {
    interface Vec3 {
        setZ(z: number): Vec3;
        distanceToSquared(v2: Vec3): number;
        addScaledVector(vector: Vec3, scale: number): Vec3;
        applyAxisAngle(axis: Vec3, angle: number): Vec3;

    }
}

Vec3.prototype.setZ = function(z: number): Vec3{
    return new Vec3(this.x, this.y, z);
}

Vec3.prototype.distanceToSquared = function(v2: Vec3): number{
    let dx = v2.x - this.x;
    let dy = v2.y - this.y;
    let dz = v2.z - this.z;
    return dx * dx + dy * dy + dz * dz;
};

Vec3.prototype.addScaledVector = function(vector: Vec3, scale: number): Vec3 {
    this.add(vector.clone().multiplyScalar(scale));
    return this;
};

const _q = new Quat();
Vec3.prototype.applyAxisAngle = function (axis: Vec3, angle: number): Vec3 {
    // Tạo quaternion từ trục và góc
    Quat.fromAxisAngle(_q, axis, angle);

    // Áp dụng quaternion vào vector
    Vec3.transformQuat(this, this, _q);

    return this;
};

export function vec(v) {
    return new Vec3(v.x, v.y, v.z)
}

export function upCross(v) {
    return up.cross(v)
}

export function norm(v) {
    return v.normalize()
}

export function passesThroughZero(v, dv) {
    return v.add(dv).dot(v) <= 0
}

export function unitAtAngle(theta) {
    return new Vec3(1, 0, 0).applyAxisAngle(up, theta)
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

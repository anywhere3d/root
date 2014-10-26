'use strict';
var Math2 = {
    IsValid: function (a) {
        return isFinite(a)
    },
    Dot: function (a, b) {
        return a.x * b.x + a.y * b.y
    },
    CrossVV: function (a, b) {
        return a.x * b.y - a.y * b.x
    },
    CrossVF: function (a, b) {
        return new Vec2(b * a.y, -b * a.x)
    },
    CrossFV: function (a, b) {
        return new Vec2(-a * b.y, a * b.x)
    },
    MulMV: function (a, b) {
        return new Vec2(a.col1.x * b.x + a.col2.x * b.y, a.col1.y * b.x + a.col2.y * b.y)
    },
    MulTMV: function (a, b) {
        return new Vec2(Math2.Dot(b, a.col1), Math2.Dot(b, a.col2))
    },
    AddVV: function (a, b) {
        return new Vec2(a.x + b.x, a.y + b.y)
    },
    SubtractVV: function (a, b) {
        return new Vec2(a.x - b.x, a.y - b.y)
    },
    MulFV: function (a, b) {
        return new Vec2(a * b.x, a * b.y)
    },
    AddMM: function (a, b) {
        return new Mat22(0, Math2.AddVV(a.col1, b.col1), Math2.AddVV(a.col2, b.col2))
    },
    MulMM: function (a, b) {
        return new Mat22(0, Math2.MulMV(a, b.col1), Math2.MulMV(a, b.col2))
    },
    MulTMM: function (a, b) {
        var c = new Vec2(Math2.Dot(a.col1, b.col1), Math2.Dot(a.col2, b.col1)),
            d = new Vec2(Math2.Dot(a.col1, b.col2), Math2.Dot(a.col2, b.col2));
        return new Mat22(0, c, d)
    },
    Abs: function (a) {
        return 0 < a ? a : -a
    },
    AbsV: function (a) {
        return new Vec2(Math2.Abs(a.x), Math2.Abs(a.y))
    },
    AbsM: function (a) {
        return new Mat22(0, Math2.AbsV(a.col1), Math2.AbsV(a.col2))
    },
    Min: function (a, b) {
        return a < b ? a : b
    },
    MinV: function (a, b) {
        return new Vec2(Math2.Min(a.x, b.x), Math2.Min(a.y, b.y))
    },
    Max: function (a, b) {
        return a > b ? a : b
    },
    MaxV: function (a, b) {
        return new Vec2(Math2.Max(a.x, b.x), Math2.Max(a.y, b.y))
    },
    Clamp: function (a, b, c) {
        return Math2.Max(b, Math2.Min(a, c))
    },
    ClampV: function (a, b, c) {
        return Math2.MaxV(b, Math2.MinV(a, c))
    },
    Swap: function (a, b) {
        var c = a[0];
        a[0] = b[0];
        b[0] = c
    },
    Sign: function (a) {
        return 0 > a ? -1 : 0 < a ? 1 : 0
    },
    Random: function () {
        return 2 * Math.random() - 1
    },
    NextPowerOfTwo: function (a) {
        a |= a >> 1 & 2147483647;
        a |= a >> 2 & 1073741823;
        a |= a >> 4 & 268435455;
        a |= a >> 8 & 16777215;
        return (a | a >> 16 & 65535) + 1
    },
    IsPowerOfTwo: function (a) {
        return 0 < a && 0 == (a & a - 1)
    }
};
var Mat22;
Mat22 = function (a, b, c) {
    null == a && (a = 0);
    this.col1 = new Vec2;
    this.col2 = new Vec2;
    null != b && null != c ? (this.col1.SetV(b), this.col2.SetV(c)) : (b = Math.cos(a), a = Math.sin(a), this.col1.x = b, this.col2.x = -a, this.col1.y = a, this.col2.y = b)
};
Mat22.prototype.Set = function (a) {
    var b = Math.cos(a);
    a = Math.sin(a);
    this.col1.x = b;
    this.col2.x = -a;
    this.col1.y = a;
    this.col2.y = b
};
Mat22.prototype.SetVV = function (a, b) {
    this.col1.SetV(a);
    this.col2.SetV(b)
};
Mat22.prototype.Copy = function () {
    return new Mat22(0, this.col1, this.col2)
};
Mat22.prototype.SetM = function (a) {
    this.col1.SetV(a.col1);
    this.col2.SetV(a.col2)
};
Mat22.prototype.AddM = function (a) {
    this.col1.x += a.col1.x;
    this.col1.y += a.col1.y;
    this.col2.x += a.col2.x;
    this.col2.y += a.col2.y
};
Mat22.prototype.SetIdentity = function () {
    this.col1.x = 1;
    this.col2.x = 0;
    this.col1.y = 0;
    this.col2.y = 1
};
Mat22.prototype.SetZero = function () {
    this.col1.x = 0;
    this.col2.x = 0;
    this.col1.y = 0;
    this.col2.y = 0
};
Mat22.prototype.Invert = function (a) {
    var b = this.col1.x,
        c = this.col2.x,
        d = this.col1.y,
        e = this.col2.y,
        f;
    f = 1 / (b * e - c * d);
    a.col1.x = f * e;
    a.col2.x = -f * c;
    a.col1.y = -f * d;
    a.col2.y = f * b;
    return a
};
Mat22.prototype.Solve = function (a, b, c) {
    var d = this.col1.x,
        e = this.col2.x,
        f = this.col1.y,
        k = this.col2.y,
        g;
    g = 1 / (d * k - e * f);
    a.x = g * (k * b - e * c);
    a.y = g * (d * c - f * b);
    return a
};
Mat22.prototype.Abs = function () {
    this.col1.Abs();
    this.col2.Abs()
};

function Vec2(a, b) {
    void 0 === a && (a = 0);
    this.x = a;
    void 0 === b && (b = 0);
    this.y = b
}
Vec2.prototype.SetZero = function () {
    this.y = this.x = 0
};
Vec2.prototype.Set = function (a, b) {
    this.x = a;
    this.y = b
};
Vec2.prototype.SetV = function (a) {
    this.x = a.x;
    this.y = a.y
};
Vec2.prototype.Negative = function () {
    return new Vec2(-this.x, -this.y)
};
Vec2.prototype.Copy = function () {
    return new Vec2(this.x, this.y)
};
Vec2.prototype.MulM = function (a) {
    var b = this.x;
    this.x = a.col1.x * b + a.col2.x * this.y;
    this.y = a.col1.y * b + a.col2.y * this.y
};
Vec2.prototype.MulTM = function (a) {
    var b = Vec2.dot(this, a.col1);
    this.y = Vec2.dot(this, a.col2);
    this.x = b
};
Vec2.prototype.AddV = function (a) {
    this.x += a.x;
    this.y += a.y;
    return this
};
Vec2.prototype.MulS = function (a) {
    this.x *= a;
    this.y *= a;
    return this
};
Vec2.prototype.CrossVF = function (a) {
    var b = this.x;
    this.x = a * this.y;
    this.y = -a * b
};
Vec2.prototype.CrossFV = function (a) {
    var b = this.x;
    this.x = -a * this.y;
    this.y = a * b
};
Vec2.prototype.MinV = function (a) {
    this.x = this.x < a.x ? this.x : a.x;
    this.y = this.y < a.y ? this.y : a.y
};
Vec2.prototype.MaxV = function (a) {
    this.x = this.x > a.x ? this.x : a.x;
    this.y = this.y > a.y ? this.y : a.y
};
Vec2.prototype.Abs = function () {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y)
};
Vec2.prototype.Length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
};
Vec2.prototype.Normalize = function () {
    var a = this.Length();
    if (a < Number.MIN_VALUE) return 0;
    var b = 1 / a;
    this.x *= b;
    this.y *= b;
    return a
};
Vec2.prototype.IsValid = function () {
    return isFinite(this.x) && isFinite(this.y)
};
Vec2.dot = function (a, b) {
    return a.x * b.x + a.y * b.y
};
Vec2.cross = function (a, b) {
    return a.x * b.y - a.y * b.x
};
Vec2.crossScalar = function (a, b) {
    return new Vec2(-a * b.y, a * b.x)
};
Vec2.add = function (a, b) {
    return new Vec2(a.x + b.x, a.y + b.y)
};
Vec2.subtract = function (a, b) {
    return new Vec2(a.x - b.x, a.y - b.y)
};
Vec2.multiplyScalar = function (a, b) {
    return new Vec2(a * b.x, a * b.y)
};
Vec2.abs = function (a) {
    return new Vec2(Math.abs(a.x), Math.abs(a.y))
};
var Trans2;
Trans2 = function (a, b, c) {
    null == b && (b = 0);
    this.pos = new Vec2;
    this.m_r = new Mat22;
    null != a && this.pos.SetV(a);
    null != c ? this.m_r.SetM(c) : this.m_r.Set(b)
};
Trans2.prototype.SetT = function (a) {
    this.pos.SetV(a.pos);
    this.m_r.SetM(a.m_r)
};
Trans2.prototype.TransFromV = function (a) {
    return Vec2.add(this.pos, Math2.MulMV(this.m_r, a))
};
Trans2.prototype.TransToV = function (a) {
    return Math2.MulTMV(this.m_r, Vec2.subtract(a, this.pos))
};
Trans2.prototype.TransFromM = function (a) {
    return Math2.MulMM(this.m_r, a)
};
Trans2.prototype.TransFromT = function (a) {
    var b = this.TransFromV(a.pos);
    a = this.TransFromM(a.m_r);
    return new Trans2(b, 0, a)
};



var Phys = {  g: 9.8 };
var Debug = {
    enable: !0,
    output: function (a) { this.enable && (document.getElementById("debug").innerHTML = a) },
    write_line: function (a) { this.enable && (document.getElementById("debug").innerHTML += a + "<br/>") },
    clear: function () { this.output("") }
};

function ContextEx(a, b, c) {
    this.m_ctx = a;
    this.m_width = b;
    this.m_height = c;
    this.m_camera = {
        x: 0,
        y: 0,
        z: 50,
        FOV: 0.5
    };
    this.m_zoom = 1;
    this.m_trans = new Trans2({
        x: 0,
        y: 0
    }, 0, null)
}
ContextEx.prototype.set_trans = function (a) {
    this.m_trans.SetT(a)
};
ContextEx.prototype.run = function (a) {
    this.m_zoom = this.m_width / (this.m_camera.z * this.m_camera.FOV)
};
ContextEx.prototype.world2screen = function (a) {
    a = {
        x: a.x - this.m_camera.x,
        y: a.y - this.m_camera.y
    };
    a.x *= this.m_zoom;
    a.y *= -this.m_zoom;
    a.x += 0.5 * this.m_width;
    a.y += 0.5 * this.m_height;
    return a
};
ContextEx.prototype.screen2world = function (a) {
    a = {
        x: a.x - 0.5 * this.m_width,
        y: a.y - 0.5 * this.m_height
    };
    a.x /= this.m_zoom;
    a.y /= -this.m_zoom;
    a.x += this.m_camera.x;
    a.y += this.m_camera.y;
    return a
};
ContextEx.prototype.draw_poly = function (a, b, c) {
    this.m_ctx.beginPath();
    var d = this.m_trans.TransFromV(a[0]),
        d = this.world2screen(d);
    this.m_ctx.moveTo(d.x + 0.5, d.y + 0.5);
    for (var e = 1; e < a.length; ++e) d = this.m_trans.TransFromV(a[e]), d = this.world2screen(d), this.m_ctx.lineTo(d.x + 0.5, d.y + 0.5);
    null != b && (this.m_ctx.strokeStyle = b, this.m_ctx.stroke());
    null != c && (this.m_ctx.fillStyle = c, this.m_ctx.fill())
};
ContextEx.prototype.draw_circle = function (a, b, c, d) {
    this.m_ctx.beginPath();
    a = this.m_trans.TransFromV(a);
    a = this.world2screen(a);
    this.m_ctx.arc(a.x + 0.5, a.y + 0.5, b * this.m_zoom, 0, 2 * Math.PI, !1);
    null != c && (this.m_ctx.strokeStyle = c, this.m_ctx.stroke());
    null != d && (this.m_ctx.fillStyle = d, this.m_ctx.fill())
};
ContextEx.prototype.draw_grid = function () {
    this.m_ctx.fillStyle = "#FFFFFF";
    this.m_ctx.fillRect(0, 0, this.m_width, this.m_height);
    var a = {
        x: 0,
        y: 0
    },
        a = this.screen2world(a),
        b = {
            x: this.m_width,
            y: this.m_height
        },
        b = this.screen2world(b);
    this.m_ctx.lineWidth = 1;
    var c;
    c = function (a) {
        return 0 == a ? "#000000" : 0 == a % 1E3 ? "#606060" : 0 == a % 100 ? "#909090" : 0 == a % 10 ? "#C0C0C0" : "#F0F0F0"
    };
    for (var d = 15 > this.m_zoom ? 5 : 1, e = Math.round(a.x / d) * d; e < b.x; e += d) {
        var f = this.world2screen({
            x: e,
            y: 0
        });
        this.m_ctx.beginPath();
        this.m_ctx.strokeStyle = c(e);
        this.m_ctx.moveTo(f.x + 0.5, 0);
        this.m_ctx.lineTo(f.x + 0.5, this.m_height);
        this.m_ctx.stroke()
    }
    for (b = Math.round(b.y / d) * d; b < a.y; b += d) f = this.world2screen({
        x: 0,
        y: b
    }), this.m_ctx.beginPath(), this.m_ctx.strokeStyle = c(b), this.m_ctx.moveTo(0, f.y + 0.5), this.m_ctx.lineTo(this.m_width, f.y + 0.5), this.m_ctx.stroke();
    f = this.world2screen({
        x: 0,
        y: 0
    });
    this.m_ctx.beginPath();
    this.m_ctx.lineWidth = 1;
    this.m_ctx.strokeStyle = "#000000";
    this.m_ctx.arc(f.x + 0.5, f.y + 0.5, 0.5 * this.m_zoom, 0, 2 * Math.PI, !1);
    this.m_ctx.stroke()
};

function GameObject() {
    this.pos = new Vec2(0, 0);
    this.flags = this.angle = this.z = 0;
    this.engine = null
}
GameObject.DRAWABLE = 1;
GameObject.RUNABLE = 2;
GameObject.MOVABLE = 4;
GameObject.prototype.init = function (a, b, c) {
    this.engine = a;
    this.pos.SetV(b);
    this.angle = c
};
GameObject.prototype.run = function (a) {};
GameObject.prototype.draw = function (a) {};

function ControllableObject() {
    this.strafe = this.steering = this.traction = 0;
    this.hand_brake = !1;
    this.flags = GameObject.DRAWABLE | GameObject.RUNABLE | GameObject.MOVABLE
}
ControllableObject.prototype = new GameObject;
ControllableObject.prototype.run = function (a) {};
ControllableObject.prototype.draw = function (a) {};

function SimpleCar() {
    this.path = this.steer_angle = this.speed = 0;
    this.friction = 1;
    this.buget = this.friction * Phys.g;
    this.c_drag = 1;
    this.c_turb = 30;
    this.resistance = 0.001;
    this.power = 100;
    this.max_speed1 = this.power / this.buget;
    this.max_steer = Math.PI / 4;
    this.back_wheels = 1.2;
    this.front_wheels = 1.5;
    this.wheel_base = this.back_wheels + this.front_wheels
}
SimpleCar.prototype = new ControllableObject;
SimpleCar.prototype.run = function (a) {
    var b = 0;
    this.hand_brake ? b = 0 > this.speed ? this.buget : 0 < this.speed ? -this.buget : 0 : (b = this.traction * this.buget, 0 < b * this.speed && Math.abs(this.speed) > this.max_speed1 && (b /= Math.abs(this.speed) / this.max_speed1));
    b -= (Math.abs(this.speed) * this.c_drag + this.c_turb) * this.speed * this.resistance;
    this.hand_brake && Math.abs(b * a) > Math.abs(this.speed) ? this.speed = 0 : this.speed += b * a;
    //Debug.write_line("<br/>Speed: " + Math.round(3.6 * this.speed) + "km/h");
    b = this.max_steer;
    if (1E-4 < this.speed || -1E-4 > this.speed) {
        var c = Math.atan(this.wheel_base / (this.speed * this.speed / this.buget));
        c < b && (b = c)
    }
    this.steer_angle = this.steering * b;
    var c = Math.cos(this.angle),
        d = Math.sin(this.angle),
        c = new Vec2(-d, c),
        c = Vec2.multiplyScalar(this.speed * a, c);
    this.pos = Vec2.add(this.pos, c);
    this.path += Math.abs(this.speed * a);
    Debug.write_line("Path: " + Math.round(this.path) + "m");
    this.hand_brake || (this.angle += b * a * this.steering * this.speed / 2.7)
};
SimpleCar.prototype.draw = function (a) {
    var w = 1;
    var h = 2;
    var corner = 0.1;
    var corner2 = 0.2;
    var corner3 = 0.15;
    a = [{x:-w-corner, y:-h+corner},{x:-w, y:-h},  {x:0, y:-h-0.1 },  { x:w, y:-h }, { x:w+corner, y:-h+corner },
    { x:w+corner, y:h-corner3 },{ x:w-corner2, y:h }, { x:0, y:h+0.1 }, { x:-w+corner2, y:h },  { x:-w-corner, y:h-corner3 }, { x:-w-corner, y:-h+corner }];
    this.engine.m_ctx_ex.set_trans(new Trans2(this.pos, this.angle, null));
    this.engine.m_ctx_ex.m_trans.pos = Vec2.add(this.engine.m_ctx_ex.m_trans.pos, { x: 0.1, y: -0.1 });
    this.engine.m_ctx_ex.draw_poly(a, null, "rgba(0,0,0,0.5)");
    /*var d = new Trans2({
        x: 0.85,
        y: this.front_wheels
    }, this.steer_angle);
    this.engine.m_ctx_ex.set_trans(c.TransFromT(d));
    this.engine.m_ctx_ex.draw_poly(b, null, "#404040");
    d.pos.x = -d.pos.x;
    this.engine.m_ctx_ex.set_trans(c.TransFromT(d));
    this.engine.m_ctx_ex.draw_poly(b, null, "#404040");
    d.m_r.Set(0);
    d.pos.x = 0.85;
    d.pos.y = -this.back_wheels;
    this.engine.m_ctx_ex.set_trans(c.TransFromT(d));
    this.engine.m_ctx_ex.draw_poly(b, null, "#404040");
    d.pos.x = -d.pos.x;
    this.engine.m_ctx_ex.set_trans(c.TransFromT(d));
    this.engine.m_ctx_ex.draw_poly(b, null, "#404040");
    this.engine.m_ctx_ex.set_trans(c);
    this.engine.m_ctx_ex.draw_poly(a, "#808080", "white");
    this.engine.m_ctx_ex.draw_poly([{
        x: 0,
        y: 1.2
    }, {
        x: -0.8,
        y: 1
    }, {
        x: -0.8,
        y: 0
    }, {
        x: 0.8,
        y: 0
    }, {
        x: 0.8,
        y: 1
    }, {
        x: 0,
        y: 1.2
    }, {
        x: 0,
        y: 2
    }], "#808080", null);
    this.engine.m_ctx_ex.draw_poly([{
        x: -0.7,
        y: 0
    }, {
        x: -0.7,
        y: -1.9
    }, {
        x: 0.7,
        y: -1.9
    }, {
        x: 0.7,
        y: 0
    }], "#808080", null)*/
};

function CarWheel(a, b, c, d) {
    this.car = a;
    this.pos = b.Copy();
    this.drive = c;
    this.steer = d;
    this.angle = 0;
    this.blocked = this.sliding = !1;
    this.buget = 0;
    this.old_force = new Vec2;
    this.sliding_coef = 0.5;
    this.trail = []
}
CarWheel.prototype.calc_force = function (a, b, c, d) {
    var e = this.pos.Copy();
    e.CrossFV(1);
    (this.blocked = Math.abs(b) > this.buget) && !this.car.hand_brake && this.car.abs && (b = this.buget, this.blocked = !1);
    if (this.blocked) a = c.Copy(), a.Normalize(), a = Vec2.dot(e, a), e = Vec2.multiplyScalar(1 / (1 / this.car.mass + a * a / this.car.inertia), c), d = Vec2.multiplyScalar(-1 / d / 2, e);
    else {
        var f = new Mat22(this.angle),
            k = f.col1,
            e = Vec2.dot(e, k),
            e = -Vec2.dot(k, c) / (1 / this.car.mass + e * e / this.car.inertia);
        d = Vec2.multiplyScalar(e / d / 2, k);
        this.drive && (Math.abs(a) > this.buget && this.car.tcs && (a = this.buget * Math2.Sign(a)), d.AddV(Vec2.multiplyScalar(a, f.col2)));
        0 < Vec2.dot(c, f.col2) ? d.AddV(Vec2.multiplyScalar(-b, f.col2)) : d.AddV(Vec2.multiplyScalar(b, f.col2))
    }
    c = d.Length();
    (this.sliding = c > this.buget) && (c > 3 * this.buget ? d.MulS(this.sliding_coef * this.buget / c) : d.MulS((1 - (c - this.buget) / (2 * this.buget) * (1 - this.sliding_coef)) * this.buget / c));
    this.old_force.SetV(d);
    return d
};

function ArcadeCar() {
    this.steer_angle = 0;
    this.velocity = new Vec2(0, 0);
    this.angular_vel = 0;
    this.prev_accel = new Vec2(0, 0);
    this.speed = 0;
    this.direction = 1;
    this.trans = new Trans2(this.pos, this.angle, null);
    this.steer_control = this.tcs = this.abs = !0;
    this.mass = 1E3;
    this.inertia = this.mass / 12 * 20;
    this.friction = 1;
    this.buget = this.friction * Phys.g * this.mass;
    this.braking_coef = 2;
    this.front_braking = 0.3;
    this.c_sqr = 0.5;
    this.c_lin = 30 * this.c_sqr;
    this.power = 1E5;
    this.max_steer = Math.PI / 4;
    this.mass_height = 0.5;
    this.back_wheels = 1.2;
    this.front_wheels = 1.5;
    this.wheel_base = this.back_wheels + this.front_wheels;
    this.wheel_shift = 0.85;
    this.trails_len = 300;
    this.wheels = [];
    this.wheels[0] = [];
    this.wheels[0][0] = new CarWheel(this, new Vec2(-this.wheel_shift, this.front_wheels), !1, !0);
    this.wheels[0][1] = new CarWheel(this, new Vec2(this.wheel_shift, this.front_wheels), !1, !0);
    this.wheels[1] = [];
    this.wheels[1][0] = new CarWheel(this, new Vec2(-this.wheel_shift, -this.back_wheels), !0, !1);
    this.wheels[1][1] = new CarWheel(this, new Vec2(this.wheel_shift, -this.back_wheels), !0, !1)
}
ArcadeCar.prototype = new ControllableObject;
ArcadeCar.prototype.set_drive = function (a, b) {
    this.wheels[0][0].drive = a;
    this.wheels[0][1].drive = a;
    this.wheels[1][0].drive = b;
    this.wheels[1][1].drive = b
};
ArcadeCar.prototype.run = function (a) {
    if (!(0.001 > a)) {
        var b = new Vec2,
            c = 0,
            d = 0,
            e = 0,
            f = [0, 0],
            k = this.velocity.Copy();
        k.MulTM(this.trans.m_r);
        e = k.y;
        (0 < this.traction || 0 <= e * this.traction) && !this.hand_brake ? (d = Math.abs(e), d = 1 < d ? this.power / d : this.power, d *= this.traction) : (e = this.hand_brake ? 1 * this.buget * this.braking_coef : Math.abs(this.traction) * this.buget * this.braking_coef, f[0] = this.front_braking * e, f[1] = (1 - this.front_braking) * e);
        var g = this.prev_accel.Copy();
        g.MulTM(this.trans.m_r);
        var h = [];
        h[0] = this.mass / this.wheel_base * (this.back_wheels * Phys.g - this.mass_height * g.y);
        h[1] = this.mass / this.wheel_base * (this.front_wheels * Phys.g + this.mass_height * g.y);
        for (var l = 0, e = 0; e < this.wheels.length; ++e) this.wheels[e][0].drive && ++l, this.wheels[e][0].buget = (this.wheel_shift * h[e] + this.mass_height * g.x * this.mass) / (2 * this.wheel_shift), this.wheels[e][1].buget = (this.wheel_shift * h[e] - this.mass_height * g.x * this.mass) / (2 * this.wheel_shift);
        d /= 2 * l;
        e = this.max_steer;
        this.steer_control && (e = Math.abs(Math.atan2(k.x, k.y)) / 0.9, 1E-4 < this.speed || -1E-4 > this.speed ? (g = Math.atan(this.wheel_base / (this.speed * this.speed / this.buget * this.mass)), g > e && (e = 0.9 * g)) : e = this.max_steer, e > this.max_steer && (e = this.max_steer));
        this.steer_angle = this.steering * e;
        for (e = 0; e < this.wheels.length; ++e) for (g = 0; g < this.wheels[e].length; ++g) h = this.wheels[e][g], 0 > h.buget && (h.buget = 0), h.steer && (h.angle = 0 < h.pos.y ? this.steer_angle : -this.steer_angle), l = k.Copy(), l.AddV(Vec2.crossScalar(this.angular_vel, h.pos)), l = h.calc_force(d, f[e] / 2, l, a), c += Vec2.cross(h.pos, l), l.MulM(this.trans.m_r), b.AddV(l);
        b.AddV(Vec2.multiplyScalar(-(this.velocity.Length() * this.c_sqr + this.c_lin), this.velocity));
        b.MulS(1 / this.mass);
        this.prev_accel.SetV(b);
        this.velocity.AddV(b.MulS(a));
        this.speed = this.velocity.Length();
        this.direction = 0 > this.velocity.y ? -1 : 1;
        //Debug.write_line("<br/>Speed: " + Math.round(3.6 * this.speed) + "km/h");
        //Debug.output("Speed: " + Math.round(3.6 * this.speed) + "km/h");
        this.pos.AddV(Vec2.multiplyScalar(a, this.velocity));
        c *= a / this.inertia;
        this.angular_vel += c;
        this.angle += this.angular_vel * a;
        this.trans = new Trans2(this.pos, this.angle, null);
        for (e = 0; e < this.wheels.length; ++e) for (g = 0; g < this.wheels[e].length; ++g) h = this.wheels[e][g], a = this.trans.TransFromV(h.pos), h.trail.push({
            p: a,
            w: h.sliding ? h.buget : 0
        }), h.trail.length > 2 * this.trails_len && (h.trail = h.trail.slice(this.trails_len, h.trail.length - 1))
    }
};
ArcadeCar.prototype.draw = function (a) {
    var w = 1;
    var h = 2;
    var corner = 0.1;
    var corner2 = 0.2;
    var corner3 = 0.15;
    a = [{x:-w-corner, y:-h+corner},{x:-w, y:-h},  {x:0, y:-h-0.1 },  { x:w, y:-h }, { x:w+corner, y:-h+corner },
    { x:w+corner, y:h-corner3 },{ x:w-corner2, y:h }, { x:0, y:h+0.1 }, { x:-w+corner2, y:h },  { x:-w-corner, y:h-corner3 }, { x:-w-corner, y:-h+corner }];
    this.engine.m_ctx_ex.set_trans(new Trans2(this.pos, this.angle, null));
    this.engine.m_ctx_ex.m_trans.pos = Vec2.add(this.engine.m_ctx_ex.m_trans.pos, { x: 0.1, y: -0.1 });
    this.engine.m_ctx_ex.draw_poly(a, null, "rgba(0,0,0,0.5)");


    for (var b = this.wheels.length; b--;) for (a = this.wheels[b].length; a--;) {
        var c = this.wheels[b][a];
        this.engine.m_ctx_ex.set_trans(new Trans2({
            x: 0,
            y: 0
        }, 0));
        this.engine.m_ctx_ex.m_ctx.lineWidth = 0.24 * this.engine.m_ctx_ex.m_zoom;
        this.engine.m_ctx_ex.m_ctx.lineJoin = "bevel";
        for (var d = c.trail.length, e = !1, f = [], k = d - 1; 0 < k && k > d - this.trails_len; --k) {
            var g = c.trail[k];
            1E3 < g.w ? (e = !0, f.push(g.p)) : e && (e = !1, this.engine.m_ctx_ex.draw_poly(f, "rgba(0,0,0,0.5)", null), f = [])
        }
        e && this.engine.m_ctx_ex.draw_poly(f, "rgba(0,0,0,0.5)", null);
        this.engine.m_ctx_ex.m_ctx.lineWidth = 1;
        this.engine.m_ctx_ex.set_trans(this.trans);
        d = Vec2.multiplyScalar(2.5E-4, c.old_force);
        this.engine.m_ctx_ex.draw_poly([c.pos, Vec2.add(c.pos, d)], "#808080", null);
        c = new Trans2(c.pos, c.angle);
        this.engine.m_ctx_ex.set_trans(this.trans.TransFromT(c))
    }
    this.engine.m_ctx_ex.set_trans(this.trans);

};

function Hover() {
    this.velocity = new Vec2(0, 0);
    this.path = this.angular_vel = this.speed = 0;
    this.trans = new Trans2(this.pos, this.angle, null);
    this.c_drag = 1;
    this.c_turb = 30;
    this.resistance = 0.003;
    this.side_res = 0.015;
    this.rotation = this.strafe_force = this.force = 10;
    this.angular_res = 0.5
}
Hover.prototype = new ControllableObject;
Hover.prototype.run = function (a) {
    var b = Vec2.multiplyScalar(this.traction * this.force, this.trans.m_r.col2);
    b.AddV(Vec2.multiplyScalar(this.strafe * this.strafe_force, this.trans.m_r.col1));
    this.angular_vel += (this.steering * this.rotation - this.angular_vel * this.angular_res * (this.speed + 1)) * a;
    var c = Vec2.dot(this.trans.m_r.col2, this.velocity),
        d = Vec2.dot(this.trans.m_r.col1, this.velocity),
        c = (Math.abs(c) * this.c_drag + this.c_turb) * c * this.resistance;
    b.AddV(Vec2.multiplyScalar(-c, this.trans.m_r.col2));
    d = (Math.abs(d) * this.c_drag + this.c_turb) * d * this.side_res;
    b.AddV(Vec2.multiplyScalar(-d, this.trans.m_r.col1));
    this.velocity.AddV(Vec2.multiplyScalar(a, b));
    this.speed = this.velocity.Length();
    //Debug.write_line("<br/>Speed: " + Math.round(3.6 * this.speed) + "km/h");
    
    this.angle += a * this.angular_vel;
    this.pos.AddV(Vec2.multiplyScalar(a, this.velocity));
    this.trans = new Trans2(this.pos, this.angle, null)
};
Hover.prototype.draw = function (a) {
    var w = 0.8;
    var h = 1.8;
    var corner = 0.1;
    var corner2 = 0.2;
    var corner3 = 0.15;
    a = [{x:-w-corner, y:-h+corner},{x:-w, y:-h},  {x:0, y:-h-0.1 },  { x:w, y:-h }, { x:w+corner, y:-h+corner },
    { x:w+corner, y:h-corner3 },{ x:w-corner2, y:h }, { x:0, y:h+0.1 }, { x:-w+corner2, y:h },  { x:-w-corner, y:h-corner3 }, { x:-w-corner, y:-h+corner }];
    this.engine.m_ctx_ex.set_trans(new Trans2(this.pos, this.angle, null));
    this.engine.m_ctx_ex.m_trans.pos = Vec2.add(this.engine.m_ctx_ex.m_trans.pos, { x: 0.1, y: -0.1 });
    this.engine.m_ctx_ex.draw_poly(a, null, "rgba(0,0,0,0.5)");

};

function Mechmind() {
    this.velocity = new Vec2(0, 0);
    this.path = this.speed = 0;
    this.c_drag = 1;
    this.c_turb = 30;
    this.resistance = 0.001;
    this.force = 0.5 * Phys.g
}
Mechmind.prototype = new ControllableObject;
Mechmind.prototype.run = function (a) {
    var b = Math2.Clamp(this.strafe - this.steering, -1, 1),
        b = new Vec2(b, this.traction);
    b.Normalize();
    b.MulS(this.force);
    var c = (this.velocity.Length() * this.c_drag + this.c_turb) * this.resistance;
    b.AddV(Vec2.multiplyScalar(-c, this.velocity));
    this.velocity.AddV(Vec2.multiplyScalar(a, b));
    this.speed = this.velocity.Length();
    //Debug.write_line("<br/>Speed: " + Math.round(3.6 * this.speed) + "km/h");
    this.pos.AddV(Vec2.multiplyScalar(a, this.velocity))
};
Mechmind.prototype.draw = function (a) {
    this.engine.m_ctx_ex.m_trans.pos = Vec2.add(this.pos, {
        x: 0.1,
        y: -0.1
    });
    this.engine.m_ctx_ex.draw_circle({
        x: 0,
        y: 0
    }, 2, null, "rgba(0,0,0,0.5)");
    this.engine.m_ctx_ex.m_trans.pos.SetV(this.pos);
    this.engine.m_ctx_ex.draw_circle({
        x: 0,
        y: 0
    }, 2, "#808080", "white")
};

function BaseApplication() {
    this.m_ctx_id = "";
    this.m_canvas_elm = this.m_ctx = null;
    this.m_canvas_height = this.m_canvas_width = 0;
    this.m_buf_ctx = this.m_canvas_buffer = null;
    this.m_last_tick = 0;
    this.m_keys = [];
    this.m_double_buffering = !1
}
BaseApplication.prototype.pre_init = function (a) {
    this.m_canvas_elm = a;
    this.init_int();
    var b = this;
    /*window.onload = function () {
        b.init_int()
    };
    document.onkeydown = function (a) {
        b.key_down(a)
    };
    document.onkeyup = function (a) {
        b.key_up(a)
    }*/
};
BaseApplication.prototype.init_int = function () {
    this.m_ctx = this.m_canvas_elm.getContext("2d");
    this.m_canvas_width = parseInt(this.m_canvas_elm.width);
    this.m_canvas_height = parseInt(this.m_canvas_elm.height);
    this.m_double_buffering ? (this.m_canvas_buffer = document.createElement("canvas"), this.m_canvas_buffer.width = this.m_canvas_width, this.m_canvas_buffer.height = this.m_canvas_height, this.m_buf_ctx = this.m_canvas_buffer.getContext("2d")) : this.m_buf_ctx = this.m_ctx;
    this.m_ctx_ex = new ContextEx(this.m_buf_ctx, this.m_canvas_width, this.m_canvas_height);
    this.m_last_tick = (new Date).getTime();
    this.init();
    //this.step();
    /*var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null,
        b = this,
        c;
    a ? (c = function () {
        b.step();
        a(c)
    }, c()) : (c = function () {
        b.step()
    }, setInterval(c, 0))*/
};
/*BaseApplication.prototype.get_key = function (a) {
    if (window.event) return a.returnValue = !1, a.keyCode;
    if (a.which) return a.preventDefault(), a.which
};
BaseApplication.prototype.key_down = function (a) {
    this.m_keys[this.get_key(a)] = !0
};
BaseApplication.prototype.key_up = function (a) {
    this.m_keys[this.get_key(a)] = !1
};*/
BaseApplication.prototype.step = function () {
    var a = (new Date).getTime(),
        b = (a - this.m_last_tick) / 1E3;
    if (isNaN(b) || 0.1 < b) b = 0.1;
    this.m_last_tick = a;
    //0 < b ? Debug.output("FPS: " + Math.floor(1 / b)) : Debug.output("FPS: inf");
    this.process_keys(b);
    this.run(b);
    this.m_ctx_ex.run(b);
    this.draw(b);
    this.m_double_buffering && this.m_ctx.drawImage(this.m_canvas_buffer, 0, 0)
};
BaseApplication.prototype.init = function () {};
BaseApplication.prototype.process_keys = function (a) {};
BaseApplication.prototype.run = function (a) {};
BaseApplication.prototype.draw = function (a) {};
var key;

function Application(a, b, c) {
    this.carOptions = c;
    this.current = 1;
    this.applyCar = b;
    this.car = new ArcadeCar();
    this.car.init(this, { x: 0, y: 0 }, 0);
    this.pre_init(a);
    this.setOptions();
}
Application.prototype = new BaseApplication;
Application.prototype.init = function () {
    var a = this;
    /*document.getElementById("chABS").onchange = function () {
        void 0 !== a.car.abs && (a.car.abs = this.checked)
    };
    document.getElementById("chTCS").onchange = function () {
        void 0 !== a.car.tcs && (a.car.tcs = this.checked)
    };
    document.getElementById("chSTEER").onchange = function () {
        void 0 !== a.car.steer_control && (a.car.steer_control = this.checked)
    };
    document.getElementById("selDRIVE").onchange = function () {
        if (void 0 !== a.car.set_drive) switch (this.value) {
        case "RWD":
            a.car.set_drive(!1, !0);
            break;
        case "FWD":
            a.car.set_drive(!0, !1);
            break;
        case "AWD":
            a.car.set_drive(!0, !0)
        }
    }*/
};

Application.prototype.setOptions = function(c){
    if(c)this.carOptions = c;
    switch (this.carOptions.drive) {
        case 'RWD': this.car.set_drive(false, true); break;
        case 'FWD': this.car.set_drive(true, false); break;
        case 'AWD': this.car.set_drive(true, true); break;
    }
    void 0 !== this.car.abs && (this.car.abs = this.carOptions.abs)
    void 0 !== this.car.tcs && (this.car.tcs = this.carOptions.tcs)
    void 0 !== this.car.steer_control && (this.car.steer_control = this.carOptions.steering)
    //this.car.abs = this.carOptions.abs;
    //this.car.tcs = this.carOptions.tcs;
    //this.car.steer_control = this.carOptions.steering;


}

function drive_val(a, b, c) {
    if (Math.abs(a - b) < c) return a;
    b += (0 < a - b ? 1 : -1) * c;
    return Math2.Clamp(b, -1, 1)
}
Application.prototype.process_keys = function (a) {
    this.car.hand_brake = !1;
    var b = 0;
    key[0] && (b = 1);
    key[1] && (b -= 1);
    this.car.traction = drive_val(b, this.car.traction, 2 * a);
    b = 0;
    key[2] && (b = 1);
    key[3] && (b -= 1);
    this.car.steering = drive_val(b, this.car.steering, 4 * a);
    key[5] && (this.car.hand_brake = !0);
    this.car.strafe = drive_val(0, this.car.strafe, 4 * a);
};
Application.prototype.change = function(n){
    if(this.current == n) return;
    var new_car = null;
    if (n==1) {
        new_car = new ArcadeCar();
        /*new_car.abs = document.getElementById('chABS').checked;
        new_car.tcs = document.getElementById('chTCS').checked;
        new_car.steer_control = document.getElementById('chSTEER').checked;
        switch (document.getElementById('selDRIVE').value) {
            case 'RWD': new_car.set_drive(false, true); break;
            case 'FWD': new_car.set_drive(true, false); break;
            case 'AWD': new_car.set_drive(true, true); break;
        }*/
    }
    if (n==2) new_car = new SimpleCar();
    if (n==3) new_car = new Hover();
    if (n==4) new_car = new Mechmind();

    if (new_car != null) {
        new_car.init(this, this.car.pos, this.car.angle);
        this.car = new_car;
        this.current = n;
        if (n==1) this.setOptions();
    }
}
Application.prototype.run = function (a) {
    this.car.run(a);
    Debug.output("Speed: " + Math.round(3.6 * this.car.speed) + "km/h");
    this.applyCar(this.car.pos.x, this.car.pos.y, this.car.z, this.car.angle, 50 + this.car.speed * this.car.speed * 0.25, this.car.steer_angle || 0, this.car.speed * (this.car.direction || 1));
    this.m_ctx_ex.m_camera.x = this.car.pos.x;
    this.m_ctx_ex.m_camera.y = this.car.pos.y;
    this.m_ctx_ex.m_camera.z = 100;
};
Application.prototype.draw = function (a) {
    this.m_ctx_ex.draw_grid();
    this.car.draw(a);
};
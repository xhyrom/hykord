const std = @import("std");

pub const Environment = @import("./environment.zig");
pub const Logger = @import("./logger.zig");
pub const string = []const u8;
pub const stringM = []u8;

pub fn homedir() string {
    if (comptime Environment.isWindows) return std.os.getenv("USERPROFILE") orelse "unknown";

    return std.os.getenv("HOME") orelse "unknown";
}

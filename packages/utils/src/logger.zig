const std = @import("std");
const string = @import("./main.zig").string;

const Level = enum { info, warn, err };

const Color = struct {
    pub const Red = "\x1b[31m";
    pub const Green = "\x1b[32m";
    pub const Yellow = "\x1b[33m";
    pub const Reset = "\x1b[0m";
};

pub fn info(comptime message: string, args: anytype) void {
    log(.info, message, args);
}

pub fn infoNoBreak(comptime message: string, args: anytype) void {
    logNoBreak(.info, message, args);
}

pub fn warn(comptime message: string, args: anytype) void {
    log(.warn, message, args);
}

pub fn err(comptime message: string, args: anytype) void {
    log(.err, message, args);
}

fn log(level: Level, comptime message: string, args: anytype) void {
    const writer = std.io.getStdOut().writer();
    switch (level) {
        .info => {
            _ = writer.print(Color.Green, .{}) catch unreachable;
            _ = writer.print("info", .{}) catch unreachable;
        },
        .warn => {
            _ = writer.print(Color.Yellow, .{}) catch unreachable;
            _ = writer.print("warn", .{}) catch unreachable;
        },
        .err => {
            _ = writer.print(Color.Red, .{}) catch unreachable;
            _ = writer.print("error", .{}) catch unreachable;
        },
    }

    _ = writer.print(Color.Reset, .{}) catch unreachable;
    _ = writer.print(": ", .{}) catch unreachable;
    _ = writer.print(message ++ "\n", args) catch unreachable;
}

pub fn logNoBreak(level: Level, comptime message: string, args: anytype) void {
    const writer = std.io.getStdOut().writer();
    switch (level) {
        .info => {
            _ = writer.print(Color.Green, .{}) catch unreachable;
            _ = writer.print("info", .{}) catch unreachable;
        },
        .warn => {
            _ = writer.print(Color.Yellow, .{}) catch unreachable;
            _ = writer.print("warn", .{}) catch unreachable;
        },
        .err => {
            _ = writer.print(Color.Red, .{}) catch unreachable;
            _ = writer.print("error", .{}) catch unreachable;
        },
    }

    _ = writer.print(Color.Reset, .{}) catch unreachable;
    _ = writer.print(": ", .{}) catch unreachable;
    _ = writer.print(message, args) catch unreachable;
}